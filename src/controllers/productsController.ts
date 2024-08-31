import { Request, Response } from "express";
import { getData, reWriteFIle } from "../globalFunction/getData";
import { Products, StockLocation } from "../types/products";

type Controller = (a: Request, b: Response) => void;

const getProducts: Controller = async (req, res) => {
  try {
    res.set("Content-Type", "application/json");
    const data = await getData();
    if (!data) {
      res.status(404).send("No products found");
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const getProduct: Controller = async (req, res) => {
  try {
    const ID = req.params.id;
    const data = await getData();

    if (!data) {
      res.status(404).json({ message: "No products found" });
    } else {
      const product = data.products.find((el) => el.id === ID);
      product
        ? res.send(product)
        : res.status(404).json({ message: "id is not Exist" });
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.log("getProduct: ", error);
  }
};

const getProductViaCategory: Controller = async (req, res) => {
  if (!("category" in req.query)) res.status(404).send("Category not found");
  const category = req.query.category;
  const data = await getData();

  if (!data) {
    res.status(404).json({ message: "No products found" });
  } else {
    const products = data.products.filter((el) => el.category === category);
    res.send(products);
  }
};

const setProduct: Controller = async (req, res) => {
  try {
    const product: Products = req.body;

    if (product.price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number." });
    } else if (product.stock.available < 0) {
      return res
        .status(400)
        .json({ message: "Stock available must be a non-negative integer." });
    }
    const data = await getData();
    product.id = String(new Date().valueOf());
    data.products.push(product);

    await reWriteFIle(JSON.stringify(data));
    res.sendStatus(200).json({ message: "Product has been added" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log("setProduct: ", error);
  }
};

const updateProduct: Controller = async (req, res) => {
  try {
    const ID = req.params.id;
    const data = await getData();
    const updateLocation: StockLocation = req.body;

    if (!data) {
      res.status(404).json({ message: "No products found" });
    } else {
      for (let i = 0; i < data.products.length; i++) {
        if (data.products[i].id === ID) {
          data.products[i].stock.location = updateLocation.location;
          break;
        }
      }

      await reWriteFIle(JSON.stringify(data));
      res.sendStatus(200).json({ message: "Product has been updated" });
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.log("UpdateProduct: ", error);
  }
};

const deleteProduct: Controller = async (req, res) => {
  try {
    const ID = req.params.id;
    const data = await getData();

    if (!data) {
      res.status(404).send("No products found");
    } else {
      for (let i = 0; i < data.products.length; i++) {
        if (data.products[i].id === ID) {
          data.products[i].deleted = true;
          break;
        }
      }

      await reWriteFIle(JSON.stringify(data));
      res.sendStatus(200).json({ message: "Product has been deleted" });
    }
  } catch (error) {
    res.status(500).send("Server error");

    console.log("deleteProduct: ", error);
  }
};

export {
  getProducts,
  getProduct,
  getProductViaCategory,
  setProduct,
  updateProduct,
  deleteProduct,
};
