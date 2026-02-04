import { watch } from 'node:fs';

const clients = new Set();

export function createWatcher(dir) {
  watch(dir, (eventType, filename) => {
    console.log(`File change detected: ${eventType} on ${filename}`);
    notify();
  });
}

export function addClient(res) {
  clients.add(res);
  res.on('close', () => {
    clients.delete(res);
  });
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);
}


function notify() {
  console.error('Notifying clients of change...', clients.size);
  for (const client of clients) {
    client.write(`data: ${JSON.stringify({ type: 'reload' })}\n\n`);
  }
}