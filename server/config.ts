export const serverVersion = "0.1.0";
export const defaultPort = 4317;

export const defaultAllowedOrigins = [
  "https://seo-analysis-two.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

export type ServerConfig = {
  port: number;
  allowedOrigins: string[];
};

export function loadServerConfig(): ServerConfig {
  const extraOrigins = (process.env.SEO_ANALYSIS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    port: Number(process.env.SEO_ANALYSIS_PORT ?? defaultPort),
    allowedOrigins: [...defaultAllowedOrigins, ...extraOrigins]
  };
}
