import jwt from "jsonwebtoken";

const PRIMARY_SECRET = process.env.JWT_SECRET || "KrishnaPortfolioSuperSecretSecureKey2026!LongerThan32Chars";
const KNOWN_SECRETS = Array.from(
  new Set([
    process.env.JWT_SECRET,
    "KrishnaPortfolioSuperSecretSecureKey2026!LongerThan32Chars",
    "KrishnaPortfolio_ASP_NET_Core_Secret_Key_Super_Secure_2026!",
  ].filter(Boolean) as string[])
);

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

export function generateToken(user: { id: string; username: string; email: string; role: string }): { token: string; expiresAtUtc: string } {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = jwt.sign(
    {
      sub: user.id,
      nameid: user.id,
      unique_name: user.username,
      email: user.email,
      role: user.role,
    },
    PRIMARY_SECRET,
    { expiresIn: "7d" }
  );
  return { token, expiresAtUtc: expiresAt.toISOString() };
}

export function verifyAuthWithReason(request: Request): { user: TokenPayload | null; error?: string } {
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("Authorization") ||
    request.headers.get("x-access-token") ||
    request.headers.get("X-Access-Token");

  if (!authHeader) {
    const headerKeys = Array.from(request.headers.keys()).join(", ");
    return { user: null, error: `No authorization header provided. Available headers: [${headerKeys}]` };
  }

  let token = authHeader.trim();
  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  if (!token) return { user: null, error: "Empty token after Bearer extraction" };

  let lastErr = "";
  for (const secret of KNOWN_SECRETS) {
    try {
      const decoded = jwt.verify(token, secret) as any;
      return {
        user: {
          id: decoded.sub || decoded.nameid,
          username: decoded.unique_name || decoded.username,
          email: decoded.email,
          role: decoded.role || "Admin",
        },
      };
    } catch (e: any) {
      lastErr = e?.message || "verification error";
    }
  }

  return { user: null, error: `Invalid token signature (${lastErr})` };
}

export function verifyAuth(request: Request): TokenPayload | null {
  return verifyAuthWithReason(request).user;
}

