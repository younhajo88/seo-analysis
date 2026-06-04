import { lookup } from "node:dns/promises";
import net from "node:net";

export type UrlSafetyCode = "INVALID_URL" | "UNSUPPORTED_PROTOCOL" | "UNSAFE_HOST" | "UNSAFE_IP";

export class UrlSafetyError extends Error {
  constructor(
    public readonly code: UrlSafetyCode,
    message: string
  ) {
    super(message);
    this.name = "UrlSafetyError";
  }
}

export type UrlSafetyOptions = {
  resolveHost?: (host: string) => Promise<string[]>;
};

const blockedHostnames = new Set(["localhost"]);

export async function assertPublicHttpUrl(input: string, options: UrlSafetyOptions = {}) {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new UrlSafetyError("INVALID_URL", "URL is invalid.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UrlSafetyError("UNSUPPORTED_PROTOCOL", "Only http and https URLs are supported.");
  }

  const hostname = normalizeHostname(url.hostname);

  if (blockedHostnames.has(hostname.toLowerCase()) || hostname.endsWith(".localhost")) {
    throw new UrlSafetyError("UNSAFE_HOST", "Localhost targets are not allowed.");
  }

  if (net.isIP(hostname) && isUnsafeIp(hostname)) {
    throw new UrlSafetyError("UNSAFE_IP", "Private, loopback, or reserved IP targets are not allowed.");
  }

  const resolveHost = options.resolveHost ?? resolvePublicAddresses;
  const addresses = await resolveHost(hostname);

  if (addresses.length === 0 || addresses.some((address) => isUnsafeIp(address))) {
    throw new UrlSafetyError("UNSAFE_IP", "Host resolves to an unsafe IP address.");
  }

  return url;
}

async function resolvePublicAddresses(hostname: string) {
  const records = await lookup(hostname, { all: true, verbatim: true });
  return records.map((record) => record.address);
}

function normalizeHostname(hostname: string) {
  return hostname.replace(/^\[/, "").replace(/\]$/, "");
}

function isUnsafeIp(address: string) {
  const normalized = normalizeHostname(address).toLowerCase();
  const family = net.isIP(normalized);

  if (family === 4) {
    return isUnsafeIpv4(normalized);
  }

  if (family === 6) {
    return isUnsafeIpv6(normalized);
  }

  return true;
}

function isUnsafeIpv4(address: string) {
  const parts = address.split(".").map((part) => Number(part));

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isUnsafeIpv6(address: string) {
  return (
    address === "::" ||
    address === "::1" ||
    address.startsWith("fc") ||
    address.startsWith("fd") ||
    address.startsWith("fe8") ||
    address.startsWith("fe9") ||
    address.startsWith("fea") ||
    address.startsWith("feb") ||
    address.startsWith("ff")
  );
}
