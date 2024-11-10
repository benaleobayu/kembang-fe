import { NextRequest } from "next/server";

/**
 * Utility function to extract token from request cookies
 */
export function getAuthToken(req: NextRequest): string | null {
    const cookieName = 'accessToken';
    const cookie = req.cookies.get(cookieName);
    return cookie ? cookie.value : null;
}
