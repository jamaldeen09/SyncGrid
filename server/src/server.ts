import express, { Application } from "express"
import http from "http"
import { envData } from "../config/env.config.js";
import { initDb } from "../config/database.config.js";
import { initRedis } from "../config/redis.config.js";
import { Server } from "socket.io";
import { initSocket } from "../config/socket.config.js";
import cors from "cors"

// Express app
const app: Application = express();

// Server instance (created on top of the express app)
const server = http.createServer(app);

// Global express middlewares  
app.use(express.json());
app.use(cors({
    origin:[envData.LOCAL_HOST_URL, envData.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

// Socket.io initialization (ws)

// Config
const io = new Server(server, {
    cors: {
        origin: [envData.LOCAL_HOST_URL, envData.FRONTEND_URL]
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 12000 // 2 minutes before attempting to reconnect 
    }
});

// initialization
initSocket(io);
 
// MongoDb initialization 
await initDb();
  
// Redis initialization;
await initRedis();


// ** Routesgit log --all --full-history -- "**/.env"

// Listens for a port
server.listen(envData.PORT, () => console.log(`Server is running on: ${envData.HOST_URL}`));
 