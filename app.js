// app.js - express app placeholder

import express from "express";
import exphbs from "express-handlebars";
import configRoutes from "./routes/index.js";
import arrestsRoutes from "./routes/arrests.js";   // added this line to test - Shravani

const app = express();

app.use(express.json());
app.use("/public", express.static("public"));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// add this line to hook up /arrests - Shravani
app.use("/arrests", arrestsRoutes);

// keeping our home router on '/'
app.use("/", configRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
