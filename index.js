const express = require("express");
const connection = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const { restaurantRouter } = require("./routes/resturant.routes");
require('dotenv').config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to Resturant App");
});

app.use("/", userRouter);
app.use("/", restaurantRouter);
app.use("/", userRouter);

const PORT = process.env.port || 8080;
app.listen(PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (err) {
        console.log(err);
        console.log("Error to connect the database");
    }
    console.log(`Server listening on port ${PORT}`);
});