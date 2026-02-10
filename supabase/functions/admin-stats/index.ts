// Supabase Edge Function: admin-stats
// Returns aggregated stats across all users.
//
// Security:
// - Requires a valid session token (Authorization: Bearer <jwt>)
// - Caller must have role=admin in `public.users`
// - Uses SUPABASE_SERVICE_ROLE_KEY (stored as a Supabase secret) to query counts

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
  const match = header.match(/^Bearer\s+(.+)$/i);
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

function parseContentRangeCount(value: string | null) {
  if (!value) {
    return 0;
  }
  const match = value.match(/\/(\d+)\s*$/);
  if (!match) {
    return 0;
  }
  const count = Number(match[1]);
  return Number.isFinite(count) ? count : 0;
}

async function fetchCount(supabaseUrl: string, serviceRoleKey: string, path: string) {
  // Use `Prefer: count=exact` and a tiny limit to get the total via Content-Range.
  const url = `${supabaseUrl}/rest/v1/${path}${path.includes("?") ? "&" : "?"}select=id&limit=1`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "count=exact",
    },
  });
  if (!res.ok) {
    return { ok: false, count: 0 };
  }
  return { ok: true, count: parseContentRangeCount(res.headers.get("content-range")) };
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

  const [saved, png, jpg] = await Promise.all([
    fetchCount(supabaseUrl, serviceRoleKey, "chapse"),
    fetchCount(supabaseUrl, serviceRoleKey, "export_events?format=eq.png"),
    fetchCount(supabaseUrl, serviceRoleKey, "export_events?format=eq.jpg"),
  ]);

  if (!saved.ok || !png.ok || !jpg.ok) {
    return jsonResponse(500, { error: "count_failed" });
  }

  return jsonResponse(200, {
    total_saved: saved.count,
    exports_png: png.count,
    exports_jpg: jpg.count,
  });
});
