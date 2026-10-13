/** Only allow same-site relative redirects. */
export const safeNext = (n?: string | null, fallback = "/play") =>
  n && /^\/(?![\\/])/.test(n) ? n : fallback;
