// API Configuration
//
// In dev, API calls route through Vite's proxy (see vite.config.ts) so they are
// same-origin and skip the production API's CORS restriction; in production they
// hit the real API host directly.
const API_ORIGIN = import.meta.env.DEV ? '/api' : 'https://api.cameronjim.com'

export const API_CONFIG = {
  // The validation endpoint - validates tokens and returns metadata
  validateUrl: `${API_ORIGIN}/validate`,

  // Short link base URL (for reference/display purposes)
  shortLinkBase: 'https://go.cameronjim.com',

  // Main site URL
  siteUrl: 'https://www.cameronjim.com',
}

export interface TokenValidationResponse {
  valid: boolean
  campaign?: string
  variant?: string
  destinationPath?: string
}

export async function validateToken(token: string): Promise<TokenValidationResponse> {
  try {
    const response = await fetch(`${API_CONFIG.validateUrl}?token=${encodeURIComponent(token)}`)

    if (!response.ok) {
      return { valid: false }
    }

    return await response.json()
  } catch (error) {
    console.error('Token validation failed:', error)
    return { valid: false }
  }
}
