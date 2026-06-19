import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes, createHash, createHmac, timingSafeEqual } from 'crypto';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TOKENS_TABLE = process.env.TOKENS_TABLE || 'Tokens';
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'TokenEvents';
// Fail closed: this password is the only thing protecting the admin API. A
// missing env var must lock the API, never silently fall back to a default.
const ADMIN_PASSWORD = requireEnv('ADMIN_PASSWORD');
// Sessions are signed with their own secret when provided, otherwise the admin
// password (one secret to manage). Either way it stays server-side.
const SESSION_SECRET = process.env.SESSION_SECRET || ADMIN_PASSWORD;
const SESSION_TTL_SECONDS = 8 * 60 * 60; // browser session lifetime
const SHORT_LINK_DOMAIN = process.env.SHORT_LINK_DOMAIN || 'go.cameronjim.com';
const MAX_TOKEN_DAYS = 365;
const MAX_CAMPAIGN_LENGTH = 200;

// CORS: pin to the admin origin. A non-wildcard default keeps a missing env var
// from ever opening the admin API to every site (never use '*' on an
// authenticated endpoint).
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://www.cameronjim.com';
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Vary': 'Origin',
};

interface TokenItem {
  token: string;
  campaign: string;
  createdAt: string;
  expiresAt: number;
  expiresAtISO: string;
}

interface EventItem {
  token: string;
  ts: string;
  eventType: string;
  campaign?: string;
  ipHash?: string;
  userAgent?: string;
}

interface CreateTokenRequest {
  campaign: string;
  days?: number;
}

// Read a required env var or throw at module load — a function that never
// initialises fails every request (fail closed) instead of using a default.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

// Constant-time compare via fixed-length digests, so neither length nor a
// matched prefix leaks through timing.
function safeEqual(a: string, b: string): boolean {
  const ah = createHash('sha256').update(a).digest();
  const bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah, bh);
}

// Issue a signed, time-limited session token so the browser never persists the
// raw admin password. Format: "v1.<expiry-epoch>.<hmac>".
function issueSession(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${exp}`;
  const sig = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function isValidSession(value: string): boolean {
  const lastDot = value.lastIndexOf('.');
  if (lastDot < 0) return false;
  const payload = value.slice(0, lastDot);
  const sig = value.slice(lastDot + 1);
  const expected = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;
  const [version, expStr] = payload.split('.');
  if (version !== 'v1') return false;
  const exp = Number(expStr);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}

// Accept a valid, unexpired session token or the admin password. The browser
// sends the password once (to /verify) and then carries the session token.
function checkAuth(event: APIGatewayProxyEventV2): boolean {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader) return false;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return false;
  const credential = parts[1];
  return isValidSession(credential) || safeEqual(credential, ADMIN_PASSWORD);
}

// Generate a random token, rejection-sampling the CSPRNG output to avoid the
// modulo bias of `byte % 62`.
function generateToken(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // Largest multiple of the alphabet size that fits in a byte; reject anything
  // at or above it so every character is equally likely.
  const limit = Math.floor(256 / chars.length) * chars.length;
  let token = '';
  while (token.length < length) {
    const bytes = randomBytes(length);
    for (let i = 0; i < bytes.length && token.length < length; i++) {
      if (bytes[i] < limit) token += chars[bytes[i] % chars.length];
    }
  }
  return token;
}

function badRequest(message: string): APIGatewayProxyResultV2 {
  return { statusCode: 400, headers, body: JSON.stringify({ error: message }) };
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const method = event.requestContext?.http?.method;
  const path = event.rawPath || '';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Check authentication for all routes except OPTIONS
  if (!checkAuth(event)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    // Route handling
    if (path.endsWith('/tokens') && method === 'GET') {
      return await listTokens();
    }

    if (path.endsWith('/tokens') && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      // No DELETE route is wired up in API Gateway, so deletes come through POST
      // with an explicit action discriminator.
      if (body.action === 'delete') {
        return await deleteToken(body.token);
      }
      return await createToken(body);
    }

    if (path.endsWith('/events') && method === 'GET') {
      const tokenId = event.queryStringParameters?.token;
      return await getEvents(tokenId);
    }

    if (path.endsWith('/verify') && method === 'GET') {
      // Password (or session) already verified above — hand back a fresh
      // short-lived session token for the browser to carry.
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: true, session: issueSession() }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}

async function listTokens(): Promise<APIGatewayProxyResultV2> {
  const result = await docClient.send(new ScanCommand({
    TableName: TOKENS_TABLE,
  }));

  const tokens = (result.Items as TokenItem[] || []).map(item => ({
    token: item.token,
    campaign: item.campaign,
    createdAt: item.createdAt,
    expiresAt: item.expiresAt,
    shortLink: `https://${SHORT_LINK_DOMAIN}/${item.token}`,
  }));

  // Sort by creation date, newest first
  tokens.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ tokens }),
  };
}

async function deleteToken(token?: unknown): Promise<APIGatewayProxyResultV2> {
  if (typeof token !== 'string' || !token) {
    return badRequest('Token is required');
  }

  await docClient.send(new DeleteCommand({
    TableName: TOKENS_TABLE,
    Key: { token },
  }));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ deleted: token }),
  };
}

async function createToken({ campaign, days = 30 }: CreateTokenRequest): Promise<APIGatewayProxyResultV2> {
  if (typeof campaign !== 'string' || !campaign.trim()) {
    return badRequest('Campaign name is required');
  }
  if (campaign.length > MAX_CAMPAIGN_LENGTH) {
    return badRequest(`Campaign name must be ${MAX_CAMPAIGN_LENGTH} characters or fewer`);
  }
  if (!Number.isInteger(days) || days < 1 || days > MAX_TOKEN_DAYS) {
    return badRequest(`Expiry (days) must be a whole number between 1 and ${MAX_TOKEN_DAYS}`);
  }

  const trimmedCampaign = campaign.trim();
  const token = generateToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const item: TokenItem = {
    token,
    campaign: trimmedCampaign,
    createdAt: now.toISOString(),
    expiresAt: Math.floor(expiresAt.getTime() / 1000), // TTL expects seconds
    expiresAtISO: expiresAt.toISOString(),
  };

  await docClient.send(new PutCommand({
    TableName: TOKENS_TABLE,
    Item: item,
  }));

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      token,
      campaign: trimmedCampaign,
      shortLink: `https://${SHORT_LINK_DOMAIN}/${token}`,
      expiresAt: expiresAt.toISOString(),
    }),
  };
}

async function getEvents(tokenId?: string): Promise<APIGatewayProxyResultV2> {
  let result;

  if (tokenId) {
    // Get events for specific token
    result = await docClient.send(new QueryCommand({
      TableName: EVENTS_TABLE,
      KeyConditionExpression: '#token = :token',
      ExpressionAttributeNames: { '#token': 'token' },
      ExpressionAttributeValues: { ':token': tokenId },
      ScanIndexForward: false, // Newest first
      Limit: 100,
    }));
  } else {
    // Get all recent events
    result = await docClient.send(new ScanCommand({
      TableName: EVENTS_TABLE,
      Limit: 100,
    }));
  }

  const events = (result.Items as EventItem[] || []).map(item => ({
    token: item.token,
    timestamp: item.ts,
    type: item.eventType,
    campaign: item.campaign,
    ipHash: item.ipHash,
    userAgent: item.userAgent,
  }));

  // Sort by timestamp, newest first
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ events }),
  };
}
