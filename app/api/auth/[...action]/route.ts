import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { generateToken, verifyAuth } from "@/lib/auth";

export async function POST(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const params = await props.params;
  const action = params.action ? params.action.join("/") : "";

  // 1. LOGIN
  if (action === "login") {
    try {
      const body = await request.json();
      const identifier = (body.usernameOrEmail || body.username || "").trim();
      const password = body.password || "";

      if (!identifier || !password) {
        return NextResponse.json({ message: "Username/Email and password are required." }, { status: 400 });
      }

      const users = await query<any>(
        'SELECT * FROM "Users" WHERE LOWER("Username") = LOWER($1) OR LOWER("Email") = LOWER($1) LIMIT 1',
        [identifier]
      );

      if (users.length === 0) {
        return NextResponse.json({ message: "Invalid credentials or account is inactive." }, { status: 401 });
      }

      const user = users[0];
      if (!user.IsActive) {
        return NextResponse.json({ message: "Account is inactive." }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.PasswordHash);
      if (!isMatch) {
        return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
      }

      // Update LastLoginUtc
      await query('UPDATE "Users" SET "LastLoginUtc" = $1 WHERE "Id" = $2', [new Date().toISOString(), user.Id]);

      // Add audit log
      try {
        await query(
          'INSERT INTO "AuditLogs" ("Id", "Username", "Action", "EntityName", "EntityId", "Details", "TimestampUtc") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)',
          [user.Username, "Login", "User", String(user.Id), "User logged in via Web", new Date().toISOString()]
        );
      } catch {
        // ignore audit log failure
      }

      const { token, expiresAtUtc } = generateToken({
        id: user.Id,
        username: user.Username,
        email: user.Email,
        role: user.Role,
      });

      return NextResponse.json({
        token,
        refreshToken: token,
        expiresAtUtc,
        user: {
          id: user.Id,
          username: user.Username,
          email: user.Email,
          role: user.Role,
        },
      });
    } catch (err: any) {
      return NextResponse.json({ message: err.message || "Login failed." }, { status: 500 });
    }
  }

  // 2. CHANGE PASSWORD
  if (action === "change-password") {
    const auth = verifyAuth(request);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
      const body = await request.json();
      const currentPassword = body.currentPassword || "";
      const newPassword = body.newPassword || "";

      if (!currentPassword || !newPassword || newPassword.length < 8) {
        return NextResponse.json({ message: "New password must be at least 8 characters long." }, { status: 400 });
      }

      const users = await query<any>('SELECT * FROM "Users" WHERE "Id"::text = $1 LIMIT 1', [auth.id]);
      if (users.length === 0) return NextResponse.json({ message: "User not found." }, { status: 404 });

      const user = users[0];
      const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
      if (!isMatch) {
        return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
      }

      const newHash = await bcrypt.hash(newPassword, 11);
      await query('UPDATE "Users" SET "PasswordHash" = $1 WHERE "Id"::text = $2', [newHash, auth.id]);

      return NextResponse.json({ message: "Password updated successfully." });
    } catch (err: any) {
      return NextResponse.json({ message: err.message || "Failed to update password." }, { status: 500 });
    }
  }

  // 3. UPDATE ACCOUNT
  if (action === "update-account") {
    const auth = verifyAuth(request);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
      const body = await request.json();
      const username = (body.username || "").trim();
      const email = (body.email || "").trim().toLowerCase();

      if (!username || !email) {
        return NextResponse.json({ message: "Username and Email are required." }, { status: 400 });
      }

      // Check collision
      const checkUsername = await query<any>(
        'SELECT "Id" FROM "Users" WHERE LOWER("Username") = LOWER($1) AND "Id"::text != $2 LIMIT 1',
        [username, auth.id]
      );
      if (checkUsername.length > 0) {
        return NextResponse.json({ message: "Username is already in use." }, { status: 400 });
      }

      const checkEmail = await query<any>(
        'SELECT "Id" FROM "Users" WHERE LOWER("Email") = LOWER($1) AND "Id"::text != $2 LIMIT 1',
        [email, auth.id]
      );
      if (checkEmail.length > 0) {
        return NextResponse.json({ message: "Email is already in use." }, { status: 400 });
      }

      await query(
        'UPDATE "Users" SET "Username" = $1, "Email" = $2 WHERE "Id"::text = $3',
        [username, email, auth.id]
      );

      const updated = await query<any>('SELECT * FROM "Users" WHERE "Id"::text = $1 LIMIT 1', [auth.id]);
      const user = updated[0];

      const { token, expiresAtUtc } = generateToken({
        id: user.Id,
        username: user.Username,
        email: user.Email,
        role: user.Role,
      });

      return NextResponse.json({
        message: "Account updated successfully.",
        token,
        expiresAtUtc,
        user: {
          id: user.Id,
          username: user.Username,
          email: user.Email,
          role: user.Role,
        },
      });
    } catch (err: any) {
      return NextResponse.json({ message: err.message || "Failed to update account." }, { status: 500 });
    }
  }

  // 4. LOGOUT
  if (action === "logout") {
    return NextResponse.json({ message: "Logged out successfully." });
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 });
}

export async function GET(
  request: Request,
  props: { params: Promise<{ action: string[] }> }
) {
  const params = await props.params;
  const action = params.action ? params.action.join("/") : "";

  if (action === "me") {
    const auth = verifyAuth(request);
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const users = await query<any>('SELECT "Id", "Username", "Email", "Role" FROM "Users" WHERE "Id"::text = $1 LIMIT 1', [auth.id]);
    if (users.length === 0) return NextResponse.json({ message: "User not found." }, { status: 404 });

    const u = users[0];
    return NextResponse.json({
      id: u.Id,
      username: u.Username,
      email: u.Email,
      role: u.Role,
    });
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 });
}

