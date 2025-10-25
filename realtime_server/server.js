import http from 'http';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
// Kalıcı saklama istersen aç:
import { LeveldbPersistence } from 'y-leveldb';

// ---------- Ayarlar ----------
const PORT = process.env.PORT ? Number(process.env.PORT) : 1234;
const HOST = process.env.HOST || '0.0.0.0';

// Persist (opsiyonel): y-doc'ları ./ydata klasöründe saklar
const ldb = new LeveldbPersistence('./ydata');

// ---------- HTTP + WS ----------
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('y-websocket realtime server up\n');
});

const wss = new WebSocketServer({ server });

// İstemci bağlantıları
wss.on('connection', (ws, req) => {
  // URL: ws://host:port/<docname>?room=<room>
  // docName'i path’ten al (örn: /project-123)
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const docName = url.pathname.slice(1) || 'default';

  // setupWSConnection: y-websocket’in server helper’ı
  setupWSConnection(ws, req, {
    docName,
    // persistence ver, kalıcılık olsun
    persistenceDir: './ydata',
    // y-leveldb ile birlikte çalışsın
    gcEnabled: true,
    // kendi storage adaptörünü ver
    // (y-websocket >=1.5.10 persistenceDir kullanıyor, ancak LeveldbPersistence ile de uyumlu)
    // aşağıdaki iki satır opsiyonel:
    // persistence: {
    //   bindState: ldb.bindState,
    //   writeState: ldb.writeState
    // }
  });
});

// Keepalive (bazı load-balancer’lar için iyi olur)
wss.on('listening', () => {
  console.log(`✅ WebSocket listening on ws://${HOST}:${PORT}`);
});
server.listen(PORT, HOST, () => {
  console.log(`🚀 Realtime server running on http://${HOST}:${PORT}`);
});

// Basit ping/pong
const interval = setInterval(() => {
  for (const client of wss.clients) {
    if (client.isAlive === false) return client.terminate();
    client.isAlive = false;
    client.ping();
  }
}, 30000);

wss.on('close', () => clearInterval(interval));