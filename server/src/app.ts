import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import videoRoutes from "./routes/video.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json()); //[body parsing middleware]
/*
"Parse incoming requests whose body is JSON." 
[example :  
axios.post("/api/auth/login", {  
  email: "test@gmail.com",  
  password: "123456" 
}); 
then the reques body is : 
{
    "email": "test@gmail.com",
    "password": "123456" 
}
    
express.json() parses it and makes it available as:

req.body

*/

app.use(express.urlencoded({ extended: true })); // [body parsing middleware]
/**
 * username=Kshitija&email=test%40gmail.com

express.urlencoded() parses that data.
 */

app.use("/api/auth", authRoutes);

app.use("/api/videos", videoRoutes);

export default app;
