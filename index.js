const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
// const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDocument = require("./swagger.json");

const port = 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// TODO : Wire up swaggerJSDoc with real endpoints
