// Supabase Edge Function: admin-create-user
// Creates a new active auth user + inserts its profile row in `public.users`.
//
// Security:
// - Requires a valid session token (Authorization: Bearer <jwt>)
// - Caller must have role=admin in `public.users`
// - Uses SUPABASE_SERVICE_ROLE_KEY (stored as a Supabase secret) for admin APIs

/// <reference types="https://deno.land/x/deno@v1.46.3/mod.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(status: number, payload: unknown, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

function getBearerToken(req: Request) {
  const header = req.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\\s+(.+)$/i);
  return match ? match[1] : null;
}

async function fetchJson(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;
  return { res, data, text };
}

function safeJsonParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isValidEmail(email: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(500, { error: "missing_env" });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: "missing_token" });
  }

  // Validate the caller's JWT and fetch user info.
  const userUrl = `${supabaseUrl}/auth/v1/user`;
  const { res: userRes, data: userData } = await fetchJson(userUrl, {
    method: "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userRes.ok || !userData?.id) {
    return jsonResponse(401, { error: "invalid_token" });
  }

  const callerId = String(userData.id);

  // Enforce admin role from profile table.
  const profileUrl = `${supabaseUrl}/rest/v1/users?select=role&user_id=eq.${encodeURIComponent(callerId)}&limit=1`;
  const { res: profileRes, data: profileData } = await fetchJson(profileUrl, {
    method: "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  const callerRole = Array.isArray(profileData) && profileData[0] ? String(profileData[0].role || "") : "";
  if (!profileRes.ok || callerRole !== "admin") {
    return jsonResponse(403, { error: "forbidden" });
  }

  const body = (await req.json().catch(() => null)) as null | Record<string, unknown>;
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const nom = String(body?.nom || "").trim();
  const prenom = String(body?.prenom || "").trim();
  const roleRaw = String(body?.role || "user").trim().toLowerCase();
  const role = roleRaw === "admin" ? "admin" : "user";

  if (!email || !password || !nom || !prenom) {
    return jsonResponse(400, { error: "missing_fields" });
  }
  if (!isValidEmail(email)) {
    return jsonResponse(400, { error: "invalid_email" });
  }
  if (password.length < 6) {
    return jsonResponse(400, { error: "password_too_short" });
  }

  // Create auth user (active immediately: email_confirm=true).
  const createAuthUrl = `${supabaseUrl}/auth/v1/admin/users`;
  const { res: createRes, data: createdUser } = await fetchJson(createAuthUrl, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });

  if (!createRes.ok || !createdUser?.id) {
    const message = String(createdUser?.msg || createdUser?.message || "create_user_failed");
    return jsonResponse(400, { error: "create_user_failed", message });
  }

  const newUserId = String(createdUser.id);

  // Insert profile row. If this fails, rollback the auth user.
  const insertProfileUrl = `${supabaseUrl}/rest/v1/users`;
  const { res: insertRes, data: insertData } = await fetchJson(insertProfileUrl, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ user_id: newUserId, email, nom, prenom, role }),
  });

  if (!insertRes.ok) {
    // Rollback auth user.
    await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(newUserId)}`, {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }).catch(() => {});

    const message = String(insertData?.message || insertData?.hint || "insert_profile_failed");
    return jsonResponse(400, { error: "insert_profile_failed", message });
  }

  return jsonResponse(200, { user_id: newUserId });
});

