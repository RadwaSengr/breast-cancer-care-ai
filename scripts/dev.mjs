import { spawn } from "node:child_process";
import process from "node:process";

const tsx = process.platform === "win32" ? "tsx.cmd" : "tsx";
const child = spawn(tsx, ["server/index.ts"], {
  env: { ...process.env, NODE_ENV: "development" },
  stdio: "inherit",
  // Windows must invoke the .cmd shim through a shell.
  shell: process.platform === "win32",
});

const forwardSignal = signal => {
  if (!child.killed) child.kill(signal);
};
process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

child.on("error", error => {
  console.error("Unable to start the development server:", error.message);
  console.error("Run pnpm install first, then try pnpm dev again.");
  process.exit(1);
});
