/**
 * Redirect Lambda
 * Handles: GET https://go.cameronjim.com/{token}
 *
 * 1. Validates token exists and is not expired/revoked
 * 2. Logs an 'open_go' event to TokenEvents table
 * 3. Redirects to https://www.cameronjim.com/t/{token}
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createHmac } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TOKENS_TABLE = process.env.TOKENS_TABLE || 'Tokens';
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'TokenEvents';
const SITE_URL = process.env.SITE_URL || 'https://www.cameronjim.com';
// No default: a known salt makes the IP hash reversible (the whole IPv4 space
// is tiny). With no salt set we store null instead of a guessable hash.
const IP_SALT = process.env.IP_SALT || null;
// Auto-purge analytics after this window (enable DynamoDB TTL on the events
// table with attribute name "expiresAt").
const EVENTS_TTL_DAYS = Number(process.env.EVENTS_TTL_DAYS) || 180;

export const handler = async (event) => {
  // Never log the full event — the access token rides in the path and would
  // land in CloudWatch in plaintext.

  // Extract token from path
  const token = event.pathParameters?.token;

  if (!token) {
    return redirect(`${SITE_URL}/expired`);
  }

  try {
    // Look up token in DynamoDB
    const tokenData = await getToken(token);

    if (!tokenData || isTokenInvalid(tokenData)) {
      console.log('Token invalid or not found');
      return redirect(`${SITE_URL}/expired`);
    }

    // Log the access event
    await logEvent(token, 'open_go', event);

    // Redirect to the portfolio with token
    const destination = tokenData.destinationPath || `/t/${token}`;
    return redirect(`${SITE_URL}${destination.startsWith('/') ? '' : '/'}${destination}`);

  } catch (error) {
    console.error('Error processing redirect:', error);
    return redirect(`${SITE_URL}/expired`);
  }
};

async function getToken(token) {
  const command = new GetCommand({
    TableName: TOKENS_TABLE,
    Key: { token },
  });

  const response = await docClient.send(command);
  return response.Item;
}

function isTokenInvalid(tokenData) {
  // Check if revoked
  if (tokenData.revoked) {
    return true;
  }

  // Check if expired (expiresAt is Unix timestamp in seconds)
  if (tokenData.expiresAt) {
    const now = Math.floor(Date.now() / 1000);
    if (tokenData.expiresAt < now) {
      return true;
    }
  }

  return false;
}

async function logEvent(token, eventType, requestEvent) {
  const timestamp = new Date().toISOString();
  const userAgent = requestEvent.headers?.['user-agent'] || requestEvent.headers?.['User-Agent'] || 'unknown';
  const sourceIp = requestEvent.requestContext?.identity?.sourceIp ||
                   requestEvent.requestContext?.http?.sourceIp ||
                   'unknown';

  // Hash the IP with salt for privacy
  const ipHash = hashIp(sourceIp);

  const command = new PutCommand({
    TableName: EVENTS_TABLE,
    Item: {
      token,
      ts: timestamp,
      eventType,
      userAgent,
      ipHash,
      referrer: requestEvent.headers?.referer || requestEvent.headers?.Referer || null,
      expiresAt: Math.floor(Date.now() / 1000) + EVENTS_TTL_DAYS * 24 * 60 * 60,
    },
  });

  await docClient.send(command);
}

function hashIp(ip) {
  // Without a secret salt, refuse to store a guessable hash — record null
  // rather than pretend to anonymise. HMAC keys the hash to the secret salt.
  if (ip === 'unknown' || !IP_SALT) return null;
  return createHmac('sha256', IP_SALT).update(ip).digest('hex').substring(0, 16);
}

function redirect(url) {
  return {
    statusCode: 302,
    headers: {
      Location: url,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    body: '',
  };
}
