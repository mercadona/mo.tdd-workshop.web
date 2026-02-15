#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read products
const products = JSON.parse(fs.readFileSync('src/mocks/products-fixtures.json', 'utf8'));

// Group by category
const byCategory = products.reduce((acc, product) => {
  if (!acc[product.categoryId]) acc[product.categoryId] = [];
  acc[product.categoryId].push(product);
  return acc;
}, {});

// Selected products - 8 per category, chosen for variety and interest
const selectedProducts = [
  // Category 15 - Aperitivos (snacks/appetizers)
  22910, // Aceitunas verdes rellenas de anchoa (pack 3) - 3.00€
  33053, // Aceitunas verdes sin hueso (tarro) - 2.80€
  33168, // Aceitunas Chupadedos partidas aliñadas - 3.40€
  52734, // Aceitunas negras sin hueso (bote) - 1.05€
  33235, // Banderillas picantes - 1.70€
  73331, // Mix de encurtidos - 2.65€
  29540, // Pepinillos pequeños - 1.55€
  33136, // Altramuces - 1.75€

  // Category 7 - Cereales
  9264,  // Cereales rellenos de leche Hacendado - 2.40€
  9377,  // Cereales rellenos de chocolate y avellana - 2.10€
  22966, // Corn Flakes 0% azúcares - 1.50€
  9210,  // Corn Flakes Kellogg's - 3.00€
  86368, // Copos de avena sin gluten - 2.10€
  9355,  // Muesli Crunchy con chocolate - 2.35€
  9350,  // Barritas cereales chocolate con leche - 1.55€
  35987, // Choco Krispies Kellogg's - 3.65€

  // Category 1 - Fruta y verdura
  3819,  // Plátano de Canarias IGP - 0.37€
  3824,  // Banana - 0.28€
  3313,  // Uva blanca sin semillas - 3.30€
  3028,  // Manzana Golden - 0.46€
  3119,  // Pera Conferencia - 0.42€
  3820,  // Kiwi verde - 0.39€
  3830,  // Aguacate - 1.20€
  3236   // Limones (malla) - 2.20€
];

// Filter products
const filteredProducts = products.filter(p => selectedProducts.includes(p.id));

console.log(`Selected ${filteredProducts.length} products from ${products.length} total`);
console.log(`\nProducts per category:`);

const selectedByCategory = filteredProducts.reduce((acc, p) => {
  acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
  return acc;
}, {});

Object.entries(selectedByCategory).forEach(([catId, count]) => {
  console.log(`  Category ${catId}: ${count} products`);
});

// Save filtered products
fs.writeFileSync(
  'src/mocks/products-fixtures.json',
  JSON.stringify(filteredProducts, null, 2)
);

console.log(`\n✅ Updated products-fixtures.json`);

// Get list of images to keep
const imagesToKeep = new Set();
filteredProducts.forEach(p => {
  // Extract filename from path (remove /images/ prefix)
  const imageFile = p.image.replace('/images/', '');
  const thumbFile = p.thumbnail.replace('/images/', '');
  imagesToKeep.add(imageFile);
  imagesToKeep.add(thumbFile);
});

// Get all images in public/images
const imagesDir = path.join(__dirname, '..', 'public', 'images');
const allImages = fs.readdirSync(imagesDir);

// Delete images not in the keep list
let deleted = 0;
allImages.forEach(filename => {
  if (!imagesToKeep.has(filename)) {
    fs.unlinkSync(path.join(imagesDir, filename));
    deleted++;
  }
});

console.log(`\n🗑️  Deleted ${deleted} unused images`);
console.log(`📁 Kept ${imagesToKeep.size} images`);

// Calculate total size
let totalSize = 0;
imagesToKeep.forEach(filename => {
  const stats = fs.statSync(path.join(imagesDir, filename));
  totalSize += stats.size;
});

console.log(`💾 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);