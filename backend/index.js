import express  from "express"
import cors from "cors"
import UserRoute from "./routes/UserRoute.js"
import db from "./config/Database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import User from "./model/UserModel.js";

dotenv.config();

const app = express();

try {
    await db.authenticate();
    console.log('Database Connected');
    // await User.sync()
} catch (error) {
    
}

app.use(cors({ credentials:true,origin:'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json());
app.use(UserRoute);

app.listen(5000, ()=> console.log("Server up and running . . ."));