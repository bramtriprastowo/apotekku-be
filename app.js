require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mainRouter = require("./routes/index")

app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.PORT || "http://localhost:3000")
})