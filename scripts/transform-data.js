#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read source files
const aperitivos = JSON.parse(fs.readFileSync('api/categories/aperitivos.json', 'utf8'));
const cereales = JSON.parse(fs.readFileSync('api/categories/cereales.json', 'utf8'));
const frutaYVerdura = JSON.parse(fs.readFileSync('api/categories/fruta-y-verdura.json', 'utf8'));

// Helper to generate nutriscore randomly
const nutriscores = ['A', 'B', 'C', 'D'];
function getRandomNutriscore() {
  return nutriscores[Math.floor(Math.random() * nutriscores.length)];
}

// Helper to slugify
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Transform category
function transformCategory(sourceData) {
  return {
    id: sourceData.categories[0]?.categories?.[0]?.id || sourceData.categories[0]?.id || sourceData.id,
    displayName: sourceData.name,
    slug: slugify(sourceData.name)
  };
}

// Transform product - returns both transformed product and original thumbnail URLs
function transformProduct(product, sourceCategoryId) {
  const productId = parseInt(product.id);
  const imageFilename = `${product.slug}-${productId}.jpg`;
  const thumbnailFilename = `${product.slug}-${productId}_thumb.jpg`;

  return {
    transformed: {
      id: productId,
      slug: product.slug,
      displayName: product.display_name,
      nutriscore: getRandomNutriscore(),
      image: `/images/${imageFilename}`,
      thumbnail: `/images/${thumbnailFilename}`,
      price: parseFloat(product.price_instructions.unit_price),
      referenceFormat: product.price_instructions.reference_format,
      categoryId: product.categories[0]?.id || sourceCategoryId
    },
    downloadInfo: {
      imageUrl: product.thumbnail.replace('?fit=crop&h=300&w=300', '?fit=crop&h=600&w=600'),
      thumbnailUrl: product.thumbnail,
      imageFilename,
      thumbnailFilename
    }
  };
}

// Collect all products from all subcategories
function collectProducts(sourceData) {
  const products = [];
  const downloadQueue = [];

  if (sourceData.categories) {
    sourceData.categories.forEach(subCategory => {
      if (subCategory.products) {
        subCategory.products.forEach(product => {
          const result = transformProduct(product, sourceData.id);
          products.push(result.transformed);
          downloadQueue.push(result.downloadInfo);
        });
      }
    });
  }

  return { products, downloadQueue };
}

// Transform all data
const categories = [
  transformCategory(aperitivos),
  transformCategory(cereales),
  transformCategory(frutaYVerdura)
];

const aperitivosResult = collectProducts(aperitivos);
const cerealesResult = collectProducts(cereales);
const frutaResult = collectProducts(frutaYVerdura);

const products = [
  ...aperitivosResult.products,
  ...cerealesResult.products,
  ...frutaResult.products
];

const downloadQueue = [
  ...aperitivosResult.downloadQueue,
  ...cerealesResult.downloadQueue,
  ...frutaResult.downloadQueue
];

// Write output files
const srcMocksDir = path.join(__dirname, '..', 'src', 'mocks');
if (!fs.existsSync(srcMocksDir)) {
  fs.mkdirSync(srcMocksDir, { recursive: true });
}

fs.writeFileSync(
  path.join(srcMocksDir, 'categories-fixtures.json'),
  JSON.stringify(categories, null, 2)
);

fs.writeFileSync(
  path.join(srcMocksDir, 'products-fixtures.json'),
  JSON.stringify(products, null, 2)
);

console.log(`✅ Created categories fixture: ${categories.length} categories`);
console.log(`✅ Created products fixture: ${products.length} products`);

// Download images
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

console.log('\n📥 Downloading images...\n');

let downloaded = 0;
let failed = 0;
let skipped = 0;

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    // Skip if file already exists and is not empty
    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      if (stats.size > 0) {
        skipped++;
        resolve(true);
        return;
      }
    }

    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          downloaded++;
          console.log(`✅ Downloaded: ${path.basename(dest)}`);
          resolve(true);
        });
      } else {
        failed++;
        console.log(`❌ Failed (${response.statusCode}): ${path.basename(dest)}`);
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        resolve(false);
      }
    }).on('error', (err) => {
      failed++;
      console.log(`❌ Error downloading ${path.basename(dest)}: ${err.message}`);
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      resolve(false);
    });
  });
}

// Download images in batches
async function downloadAllImages() {
  const tasks = [];

  downloadQueue.forEach(info => {
    tasks.push({
      url: info.imageUrl,
      dest: path.join(publicImagesDir, info.imageFilename)
    });
    tasks.push({
      url: info.thumbnailUrl,
      dest: path.join(publicImagesDir, info.thumbnailFilename)
    });
  });

  const batchSize = 5;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.all(batch.map(item => downloadImage(item.url, item.dest)));
  }

  console.log(`\n📊 Download summary:`);
  console.log(`   ✅ Downloaded: ${downloaded}`);
  console.log(`   ⏭️  Skipped (already exist): ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📁 Total: ${tasks.length}`);

  if (failed > 0) {
    console.log('\n⚠️  Some images failed to download.');
  }
}

downloadAllImages().catch(console.error);