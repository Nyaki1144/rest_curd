import express, { Router } from "express";
import {
  getProducts,
  getProduct,
  getProductViaCategory,
  setProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController";

const productsRout = Router();
productsRout.use(express.json());

productsRout.get("/all", getProducts);
productsRout.get("/:id", getProduct);
productsRout.put("/:id", updateProduct);
productsRout.delete("/:id", deleteProduct);
productsRout.get("/", getProductViaCategory);
productsRout.post("/", setProduct);

export default productsRout;
