import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "KrishnaPortfolioSuperSecretSecureKey2026!LongerThan32Chars";

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
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { token, expiresAtUtc: expiresAt.toISOString() };
}

export function verifyAuth(request: Request): TokenPayload | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.sub || decoded.nameid,
      username: decoded.unique_name || decoded.username,
      email: decoded.email,
      role: decoded.role || "Admin",
    };
  } catch {
    return null;
  }
}

