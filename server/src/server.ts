import { initRedis, redisClient } from './config/redis.config.js';
import { initDb } from './config/database.config.js';
import { envData } from './config/env.config.js';
import express, { Application } from "express"
import http from "http"
import cors from "cors" 
import { Server } from 'socket.io';
import { authRouter } from './routes/auth.routes.js';
import { profileRouter } from './routes/profile.routes.js';
import { initSocket } from './config/socket.config.js';
import { gameRouter } from './routes/game.routes.js'; 
import { mountGameJanitor } from './services/game-play.service.js';

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
        maxDisconnectionDuration: 20000 // 25 seconds
    }  
}); 
 


// initialization
initSocket(io);
   
// MongoDb initialization 
const dbConnection = await initDb(); 
   
// Redis initialization;  
await initRedis();    

// Game janitor
mountGameJanitor(io);
    
// Routes 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", profileRouter);
app.use("/api/v1", gameRouter);


// Listens for a port (if redis and database are connected)
if (dbConnection && redisClient.isReady) {
    server.listen(envData.PORT, () => console.log(`Server is running on: ${envData.HOST_URL}`));
}


  