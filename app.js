// app.js - express app placeholder

import express from "express";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use("/public", express.static("public"));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", configRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
