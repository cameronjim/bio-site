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
import { createHash } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TOKENS_TABLE = process.env.TOKENS_TABLE || 'Tokens';
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'TokenEvents';
const SITE_URL = process.env.SITE_URL || 'https://www.cameronjim.com';
const IP_SALT = process.env.IP_SALT || 'default-salt-change-me';

export const handler = async (event) => {
  console.log('Redirect Lambda invoked:', JSON.stringify(event));

  // Extract token from path
  const token = event.pathParameters?.token;

  if (!token) {
    return redirect(`${SITE_URL}/expired`);
  }

  try {
    // Look up token in DynamoDB
    const tokenData = await getToken(token);

    if (!tokenData || isTokenInvalid(tokenData)) {
      console.log('Token invalid or not found:', token);
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
    },
  });

  await docClient.send(command);
}

function hashIp(ip) {
  if (ip === 'unknown') return 'unknown';
  return createHash('sha256').update(ip + IP_SALT).digest('hex').substring(0, 16);
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
