type Products = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: Stock;
  tags: string[];
  rating: number;
  deleted: boolean;
};

type StockInfo = {
  available: number;
  reserved: number;
};

type StockLocation = {
  location: string;
};

type Stock = StockInfo & StockLocation;

type Data = {
  products: Products[];
};

export { Data, Products, Stock, StockLocation };
