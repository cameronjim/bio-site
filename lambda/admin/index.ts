import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes } from 'crypto';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TOKENS_TABLE = process.env.TOKENS_TABLE || 'Tokens';
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'TokenEvents';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const SHORT_LINK_DOMAIN = process.env.SHORT_LINK_DOMAIN || 'go.cameronjim.com';

// CORS headers
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

// Simple password check
function checkAuth(event: APIGatewayProxyEventV2): boolean {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader) return false;

  // Expect: "Bearer <password>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return false;

  return parts[1] === ADMIN_PASSWORD;
}

// Generate a random token
function generateToken(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
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
      // Just verify the password is correct
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: true }),
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

async function deleteToken(token?: string): Promise<APIGatewayProxyResultV2> {
  if (!token) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Token is required' }),
    };
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
  if (!campaign) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Campaign name is required' }),
    };
  }

  const token = generateToken(8);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const item: TokenItem = {
    token,
    campaign,
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
      campaign,
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
