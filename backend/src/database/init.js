import bcrypt from "bcrypt";
import crypto from "crypto";
import { connectDB } from "./db.js";

const initialProducts = [
  {
    id: "snk-001",
    name: "Zenvra Velocity One",
    category: "Sneakers",
    price: 729.9,
    oldPrice: 849.9,
    sizes: ["37", "38", "39", "40", "41", "42"],
    tag: "Lançamento",
    image: "/images/velocityOne.png",
    images: ["/images/velocityOne.png"],
    stock: 8,
    featured: true,
    description:
      "Sneaker com cabedal em knit respirável, amortecimento de alta resposta e acabamento premium para uso urbano intenso.",
  },
  {
    id: "snk-002",
    name: "Zenvra Pulse Street",
    category: "Sneakers",
    price: 599.9,
    oldPrice: null,
    sizes: ["36", "37", "38", "39", "40", "41"],
    tag: "Mais vendido",
    image: "/images/pulseStreet.png",
    images: ["/images/pulseStreet.png"],
    stock: 10,
    featured: true,
    description:
      "Modelo versátil para o dia a dia, com sola aderente, perfil moderno e conforto para longas jornadas.",
  },
  {
    id: "snk-003",
    name: "Zenvra Drift Runner",
    category: "Sneakers",
    price: 689.9,
    oldPrice: 759.9,
    sizes: ["38", "39", "40", "41", "42", "43"],
    tag: "Oferta",
    image: "/images/driftRunner.png",
    images: ["/images/driftRunner.png"],
    stock: 7,
    featured: false,
    description:
      "Design esportivo com visual street, estrutura leve e reforços internos para estabilidade e durabilidade.",
  },
  {
    id: "snk-004",
    name: "Zenvra Core Retro",
    category: "Sneakers",
    price: 649.9,
    oldPrice: null,
    sizes: ["37", "38", "39", "40", "41", "42"],
    tag: "Edição limitada",
    image: "/images/coreRetro.png",
    images: ["/images/coreRetro.png"],
    stock: 5,
    featured: false,
    description:
      "Silhueta retrô reinterpretada com materiais atuais, palmilha anatômica e detalhes em contraste.",
  },
  {
    id: "snk-005",
    name: "Zenvra Aero Grid",
    category: "Sneakers",
    price: 779.9,
    oldPrice: 899.9,
    sizes: ["39", "40", "41", "42", "43"],
    tag: "Premium",
    image: "/images/aeroGrid.png",
    images: ["/images/aeroGrid.png"],
    stock: 6,
    featured: true,
    description:
      "Estrutura com painéis respiráveis e amortecimento ampliado para quem quer performance com visual sofisticado.",
  },
  {
    id: "snk-006",
    name: "Zenvra Urban Shift",
    category: "Sneakers",
    price: 569.9,
    oldPrice: null,
    sizes: ["36", "37", "38", "39", "40"],
    tag: "Novo",
    image: "/images/urbanShift.png",
    images: ["/images/urbanShift.png"],
    stock: 9,
    featured: false,
    description:
      "Modelo compacto e leve, ideal para compor looks urbanos em qualquer estação com máximo conforto.",
  },
  {
    id: "clt-001",
    name: "Jaqueta Zenvra Block",
    category: "Roupas",
    price: 329.9,
    oldPrice: 389.9,
    sizes: ["P", "M", "G", "GG"],
    tag: "Nova coleção",
    image: "/images/ZenvraBlock.png",
    images: ["/images/ZenvraBlock.png"],
    stock: 12,
    featured: true,
    description:
      "Jaqueta corta-vento com tecido resistente e forro interno leve para mobilidade e proteção no clima urbano.",
  },
  {
    id: "clt-002",
    name: "Moletom Zenvra Layer",
    category: "Roupas",
    price: 289.9,
    oldPrice: null,
    sizes: ["P", "M", "G", "GG"],
    tag: "Conforto",
    image: "/images/zenvraLayer.png",
    images: ["/images/zenvraLayer.png"],
    stock: 15,
    featured: false,
    description:
      "Moletom com toque macio, modelagem contemporânea e capuz ajustável para uso casual diário.",
  },
  {
    id: "clt-003",
    name: "Camiseta Zenvra Basic",
    category: "Roupas",
    price: 139.9,
    oldPrice: null,
    sizes: ["P", "M", "G", "GG"],
    tag: "Essential",
    image: null,
    images: [],
    stock: 20,
    featured: false,
    description:
      "Camiseta premium em algodão encorpado com corte reto e acabamento reforçado para maior durabilidade.",
  },
  {
    id: "acs-001",
    name: "Boné Zenvra Cap",
    category: "Acessórios",
    price: 119.9,
    oldPrice: null,
    sizes: ["Único"],
    tag: "Exclusivo",
    image: null,
    images: [],
    stock: 18,
    featured: false,
    description:
      "Boné com aba curva, regulagem traseira e identidade minimalista para completar o visual street.",
  },
  {
    id: "acs-002",
    name: "Mochila Zenvra Transit",
    category: "Acessórios",
    price: 249.9,
    oldPrice: 299.9,
    sizes: ["Único"],
    tag: "Prático",
    image: null,
    images: [],
    stock: 8,
    featured: false,
    description:
      "Mochila com compartimento para notebook, bolsos estratégicos e tecido resistente à rotina urbana.",
  },
  {
    id: "acs-003",
    name: "Meia Zenvra Crew Pack",
    category: "Acessórios",
    price: 79.9,
    oldPrice: null,
    sizes: ["Único"],
    tag: "Kit 3 pares",
    image: null,
    images: [],
    stock: 30,
    featured: false,
    description:
      "Pack de meias cano médio com compressão suave e reforço nas áreas de maior atrito para conforto prolongado.",
  },
];

export async function initDB() {
  const db = await connectDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      oldPrice REAL,
      sizes TEXT NOT NULL,
      tag TEXT,
      image TEXT,
      images TEXT,
      stock INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      description TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      resetToken TEXT,
      resetTokenExpires TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const userColumns = await db.all("PRAGMA table_info(users)");
  if (!userColumNames.includes("mustChangePassword")) {
    await db.exec("ALTER TABLE users ADD COLUMN mustChangePassword INTEGER DEFAULT 0");
  }
  const userColumnNames = userColumns.map((column) => column.name);

  if (!userColumnNames.includes("resetToken")) {
    await db.exec("ALTER TABLE users ADD COLUMN resetToken TEXT");
  }

  if (!userColumnNames.includes("resetTokenExpires")) {
    await db.exec("ALTER TABLE users ADD COLUMN resetTokenExpires TEXT");
  }

  const columns = await db.all("PRAGMA table_info(products)");
  const columnNames = columns.map((column) => column.name);

  if (!columnNames.includes("createdAt")) {
    await db.exec("ALTER TABLE products ADD COLUMN createdAt TEXT");
  }

  if (!columnNames.includes("updatedAt")) {
    await db.exec("ALTER TABLE products ADD COLUMN updatedAt TEXT");
  }

  if (!columnNames.includes("createdAt") || !columnNames.includes("updatedAt")) {
    await db.run(
      `UPDATE products SET createdAt = COALESCE(createdAt, datetime('now')), updatedAt = COALESCE(updatedAt, datetime('now'))`,
    );
  }

  const count = await db.get("SELECT COUNT(*) as total FROM products");

  if (count.total === 0) {
    console.log("Populando banco de produtos...");

    for (const product of initialProducts) {
      await db.run(
        `
        INSERT INTO products (
          id, name, category, price, oldPrice, sizes, tag,
          image, images, stock, featured, description, createdAt, updatedAt
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          product.id,
          product.name,
          product.category,
          product.price,
          product.oldPrice,
          JSON.stringify(product.sizes),
          product.tag,
          product.image,
          JSON.stringify(product.images),
          product.stock,
          product.featured ? 1 : 0,
          product.description,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
      );
    }
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const existingAdmin = await db.get("SELECT id FROM users WHERE email = ?", [process.env.ADMIN_EMAIL]);

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await db.run(
        `INSERT INTO users (id, name, email, password_hash, role, mustChangePassword, createdAt, updatedAt) VALUES (?, ?, ?, ?, 'admin',0,datetime('now'),datetime('now'))`,
        [
          crypto.randomUUID(),
          "Admin",
          process.env.ADMIN_EMAIL,
          passwordHash,
        ],
      );
    }
  }

  return db;
}
