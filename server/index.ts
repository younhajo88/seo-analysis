import { buildApp } from "./app";
import { loadServerConfig } from "./config";

const config = loadServerConfig();
const app = buildApp({ allowedOrigins: config.allowedOrigins });

void main();

async function main() {
  try {
    await app.listen({ port: config.port, host: "127.0.0.1" });
    app.log.info(`SEO Analysis local server listening on http://127.0.0.1:${config.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}
