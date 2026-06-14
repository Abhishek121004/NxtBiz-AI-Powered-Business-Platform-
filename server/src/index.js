import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './db/connect.js';
import { registerSocket } from './realtime/socket.js';
import { initializeAgentQueue } from './services/agentQueue.js';

async function main() {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.clientOrigin,
      credentials: true
    }
  });

  registerSocket(io);
  initializeAgentQueue();

  server.listen(env.port, () => {
    console.log(`NxtBiz API listening on port ${env.port}`);
  });
}

main().catch((error) => {
  console.error('NxtBiz failed to start', error);
  process.exit(1);
});
