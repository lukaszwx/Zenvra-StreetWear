import { connectDB } from "../database/db.js";

function parseProduct(product) {
  return {
    ...product,
    sizes: product.sizes ? JSON.parse(product.sizes) : [],
    images: product.images ? JSON.parse(product.images) : [],
    featured: Boolean(product.featured),
  };
}

function validateProduct(data) {
  if (!data.name || typeof data.name !== "string") {
    return "Nome é obrigatório.";
  }

  if (!data.category || typeof data.category !== "string") {
    return "Categoria é obrigatória.";
  }

  if (data.price === undefined || Number.isNaN(Number(data.price)) || Number(data.price) <= 0) {
    return "Preço é obrigatório e precisa ser maior que 0.";
  }

  if (!Array.isArray(data.sizes)) {
    return "Sizes precisa ser um array.";
  }

  if (!Array.isArray(data.images)) {
    return "Images precisa ser um array.";
  }

  if (data.stock === undefined || Number.isNaN(Number(data.stock)) || Number(data.stock) < 0) {
    return "Stock precisa ser um número maior ou igual a 0.";
  }

  if (typeof data.description !== "string") {
    return "Description precisa ser uma string.";
  }

  return null;
}

export async function getProducts(req, res) {
  const db = await connectDB();

  const products = await db.all("SELECT * FROM products ORDER BY name ASC");

  res.json(products.map(parseProduct));
}

export async function getProductById(req, res) {
  const db = await connectDB();

  const product = await db.get("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);

  if (!product) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  res.json(parseProduct(product));
}

export async function createProduct(req, res) {
  const error = validateProduct(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const db = await connectDB();

  const {
    id,
    name,
    category,
    price,
    oldPrice = null,
    sizes,
    tag = "Novo",
    image = null,
    images = [],
    stock = 0,
    featured = false,
    description = "",
  } = req.body;

  const productId = id || crypto.randomUUID();
  const timestamp = new Date().toISOString();

  await db.run(
    `
    INSERT INTO products (
      id, name, category, price, oldPrice, sizes, tag,
      image, images, stock, featured, description, createdAt, updatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      productId,
      name,
      category,
      Number(price),
      oldPrice ? Number(oldPrice) : null,
      JSON.stringify(sizes),
      tag,
      image,
      JSON.stringify(images),
      Number(stock),
      featured ? 1 : 0,
      description,
      timestamp,
      timestamp,
    ],
  );

  const createdProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    productId,
  ]);

  res.status(201).json(parseProduct(createdProduct));
}

export async function updateProduct(req, res) {
  const error = validateProduct(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const db = await connectDB();

  const existingProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);

  if (!existingProduct) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  const {
    name,
    category,
    price,
    oldPrice = null,
    sizes,
    tag = "Novo",
    image = null,
    images = [],
    stock = 0,
    featured = false,
    description = "",
  } = req.body;

  const updatedAt = new Date().toISOString();

  await db.run(
    `
    UPDATE products
    SET
      name = ?,
      category = ?,
      price = ?,
      oldPrice = ?,
      sizes = ?,
      tag = ?,
      image = ?,
      images = ?,
      stock = ?,
      featured = ?,
      description = ?,
      updatedAt = ?
    WHERE id = ?
    `,
    [
      name,
      category,
      Number(price),
      oldPrice ? Number(oldPrice) : null,
      JSON.stringify(sizes),
      tag,
      image,
      JSON.stringify(images),
      Number(stock),
      featured ? 1 : 0,
      description,
      updatedAt,
      req.params.id,
    ],
  );

  const updatedProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);

  res.json(parseProduct(updatedProduct));
}

export async function deleteProduct(req, res) {
  const db = await connectDB();

  const existingProduct = await db.get("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);

  if (!existingProduct) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  await db.run("DELETE FROM products WHERE id = ?", [req.params.id]);

  res.json({ message: "Produto deletado com sucesso." });
}
