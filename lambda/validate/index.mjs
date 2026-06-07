/**
 * Validate Lambda
 * Handles: GET https://api.cameronjim.com/validate?token=...
 *
 * 1. Validates token exists and is not expired/revoked
 * 2. Logs a 'validate' event to TokenEvents table
 * 3. Returns JSON with token validity and metadata
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createHash } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TOKENS_TABLE = process.env.TOKENS_TABLE || 'Tokens';
const EVENTS_TABLE = process.env.EVENTS_TABLE || 'TokenEvents';
const IP_SALT = process.env.IP_SALT || 'default-salt-change-me';

// CORS headers for the frontend
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://www.cameronjim.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  console.log('Validate Lambda invoked:', JSON.stringify(event));

  // Handle CORS preflight
  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // Extract token from query string
  const token = event.queryStringParameters?.token;

  if (!token) {
    return response({ valid: false, error: 'No token provided' });
  }

  try {
    // Look up token in DynamoDB
    const tokenData = await getToken(token);

    if (!tokenData || isTokenInvalid(tokenData)) {
      console.log('Token invalid or not found:', token);
      return response({ valid: false });
    }

    // Log the validation event
    await logEvent(token, 'validate', event);

    // Return success with token metadata
    return response({
      valid: true,
      campaign: tokenData.campaign || null,
      variant: tokenData.variant || 'general',
      destinationPath: tokenData.destinationPath || null,
    });

  } catch (error) {
    console.error('Error validating token:', error);
    return response({ valid: false, error: 'Validation failed' });
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

function response(body) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}
