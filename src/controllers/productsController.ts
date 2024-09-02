import { Request, Response } from "express";
import { getData, reWriteFIle } from "../globalFunction/getData";
import { Products, StockLocation } from "../types/products";

type Controller = (a: Request, b: Response) => void;

export const getProducts: Controller = async (req, res) => {
  try {
    res.set("Content-Type", "application/json");
    const data = await getData();
    if (!data) {
      res.status(404).send("No products found");
      return;
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getProduct: Controller = async (req, res) => {
  try {
    const ID = req.params.id;
    const data = await getData();

    if (!data) {
      res.status(404).json({ message: "No products found" });
      return;
    } else {
      const product = data.products.find((el) => el.id === ID);
      if (product) {
        res.send(product);
      } else {
        res.status(404).json({ message: "id is not Exist" });
        return;
      }
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.log("getProduct: ", error);
  }
};

export const getProductViaCategory: Controller = async (req, res) => {
  if (!("category" in req.query)) {
    res.status(404).send("Category not found");
    return;
  }
  const category = req.query.category;
  const data = await getData();

  if (!data) {
    res.status(404).json({ message: "No products found" });
    return;
  }

  const products = data.products.filter((el) => el.category === category);
  if (products.length === 0) {
    res.status(404).json({ message: "Category does not exist" });
    return;
  }
  res.send(products);
};

export const setProduct: Controller = async (req, res) => {
  try {
    const product: Products = req.body;

    if (product.price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    } else if (product.stock.available < 0) {
      return res.status(400).json({ message: "Stock available must be a non-negative integer." });
    }
    const data = await getData();
    product.id = String(new Date().valueOf());
    product.deleted = false;
    data.products.push(product);

    await reWriteFIle(JSON.stringify(data));
    res.sendStatus(200).send(product);
  } catch (error) {
    res.status(500).send("Server error");
    console.log("setProduct: ", error);
  }
};

export const updateProduct: Controller = async (req, res) => {
  try {
    const ID = req.params.id;
    const data = await getData();
    const updateLocation: StockLocation = req.body;

    if (!data) {
      res.status(404).json({ message: "No products found" });
      return;
    } else {
      for (let i = 0; i < data.products.length; i++) {
        if (data.products[i].id === ID) {
          data.products[i].stock.location = updateLocation.location;
          break;
        }
      }

      const convertedData = JSON.stringify(data);
      await reWriteFIle(convertedData);

      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.log("UpdateProduct: ", error);
  }
};

export const deleteProduct: Controller = async (req, res) => {
  try {
    const ID = req.params.id;
    const data = await getData();
    if (!data) {
      res.status(404).send("No products found");
      return;
    } else {
      let updataeProducts;
      for (let i = 0; i < data.products.length; i++) {
        if (data.products[i].id === ID) {
          updataeProducts = data.products[i];
          data.products[i].deleted = true;
          break;
        }
      }

      await reWriteFIle(JSON.stringify(data));
      res.status(200).json(updataeProducts);
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.log("deleteProduct: ", error);
  }
};
