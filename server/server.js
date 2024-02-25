import express from "express"
const app = express()

import morgan from "morgan"
if (process.env.NODE_ENV !== 'PRODUCTION') {
    app.use(morgan('dev'));
}

import cors from "cors"
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

import dotenv from "dotenv"
dotenv.config()

import "express-async-errors"

import db from "./db/connect.js"

import authRouter from "./Routes/authRoutes.js"
import adminRouter from "./Routes/adminRoutes.js"
import studentRouter from "./Routes/studentRoute.js";
import teacherRouter from "./Routes/teacherRoutes.js";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js"

import cookieParser from "cookie-parser";

const port = process.env.PORT || 4200

app.use(express.json())  //to pass json objects

app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("Connected to the server").status(200);
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", authenticateUser, adminRouter);
app.use("/api/v1/student", authenticateUser, studentRouter);
app.use("/api/v1/teacher", authenticateUser, teacherRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await db.init();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error(`Error starting the server: ${err}`);
    }
};

start();