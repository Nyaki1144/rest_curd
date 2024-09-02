import express from "express";
import "dotenv/config";
import productsRout from "./routes/productsRout";

const app = express();

app.use("/products", productsRout);

app.listen(process.env.PORT, () => {
  console.log(`server is starting ${process.env.PORT}`);
});
