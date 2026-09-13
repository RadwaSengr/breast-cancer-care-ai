import { spawn } from "node:child_process";
import process from "node:process";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

async function run(command, args) {
  return new Promise(resolve => {
    const child = spawn(pnpm, [command, ...args], {
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "production" },
    });
    child.on("error", error => {
      console.error(`[startup] ${command} failed to start:`, error);
      resolve(false);
    });
    child.on("exit", code => resolve(code === 0));
  });
}

console.log("[startup] Preparing database schema...");
const schemaReady = await run("db:push", []);
if (!schemaReady) {
  console.warn("[startup] Database schema setup failed; starting server anyway.");
}

if (schemaReady) {
  console.log("[startup] Preparing bundled RAG knowledge base...");
  const ragReady = await run("rag:seed", []);
  if (!ragReady) console.warn("[startup] RAG seeding failed; starting server anyway.");
}

console.log("[startup] Starting production server...");
const server = spawn(process.execPath, ["dist/index.js"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});
server.on("exit", code => process.exit(code ?? 1));
server.on("error", error => {
  console.error("[startup] Production server failed:", error);
  process.exit(1);
});
