import path from "path";
import fs from "fs/promises";
import { Data } from "../types/products";
import dirname from "./dirName";

const pathFile = path.join(dirname, "data", "products.json");

async function getData(): Promise<Data> {
  const data = await fs.readFile(pathFile, {
    encoding: "utf8",
  });
  return JSON.parse(data);
}

async function reWriteFIle(data: string) {
  await fs.writeFile(pathFile, data, "utf8");
}

export { getData, reWriteFIle };
