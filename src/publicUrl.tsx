export function publicUrl(url) {
  const isProd = process.env.NODE_ENV === "production";
  const prefix = isProd ? "/deva" : "";
  return `${prefix}${url}`;
}
