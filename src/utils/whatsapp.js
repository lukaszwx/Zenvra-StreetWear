import { formatBRL } from "./format";

const cleanNumber = (number) => String(number).replace(/\D/g, "");

export const createGenericWhatsappLink = (
  number,
  message = "Olá! Quero conhecer os produtos da Zenvra.",
) => `https://wa.me/${cleanNumber(number)}?text=${encodeURIComponent(message)}`;

export const createProductWhatsappLink = (number, productName, price, size) => {
  const message = [
    "Olá! Quero comprar este produto da Zenvra:",
    `Produto: ${productName}`,
    `Preço: ${formatBRL(price)}`,
    `Tamanho: ${size}`,
  ].join("\n");

  return `https://wa.me/${cleanNumber(number)}?text=${encodeURIComponent(message)}`;
};
