require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const mainRouter = require("./routes/index");

app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/api/v1", mainRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log(process.env.PORT || "http://localhost:3000")
});