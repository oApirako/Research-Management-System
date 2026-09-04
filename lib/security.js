const rateLimitStore = new Map();

export function requireSameOrigin(req) {
  const origin = req.headers.get("origin");

  // บาง request อาจไม่มี Origin
  // ให้ผ่านในกรณีเดียวกับ same-site browser request
  if (!origin) {
    return true;
  }

  const expectedOrigin =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return origin === expectedOrigin;
}

export function checkRateLimit(
  key,
  limit = 10,
  windowMs = 60 * 1000
) {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (
    !existing ||
    now > existing.resetAt
  ) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      retryAfter: 0,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil(
        (existing.resetAt - now) / 1000
      ),
    };
  }

  existing.count += 1;

  return {
    allowed: true,
    remaining:
      limit - existing.count,
    retryAfter: 0,
  };
}

export function isValidEmail(email) {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  );
}

export function isValidPassword(password) {
  return (
    typeof password === "string" &&
    /^(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      password
    )
  );
}

export function isValidArticleStatus(status) {
  return [
    "Pending",
    "Revision",
    "Approved",
    "Rejected",
  ].includes(status);
}