const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');

function getAllImages(dir) {
  const results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllImages(fullPath));
    } else if (/\.(png|jpg|jpeg)$/i.test(item)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function compress() {
  const images = getAllImages(imagesDir);
  console.log(`\nFound ${images.length} images to compress\n`);
  let totalSaved = 0;

  for (const imgPath of images) {
    const before = fs.statSync(imgPath).size;
    const tmp = imgPath + '.tmp.webp';

    try {
      await sharp(imgPath)
        .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(tmp);

      const after = fs.statSync(tmp).size;
      const saved = before - after;
      totalSaved += saved;

      // Replace original with compressed webp, keeping .png extension
      fs.unlinkSync(imgPath);
      fs.renameSync(tmp, imgPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'));

      console.log(
        `  ✓ ${path.relative(imagesDir, imgPath).padEnd(55)} ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB  (-${Math.round(saved / 1024)}KB)`
      );
    } catch (err) {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      console.error(`  ✗ ${imgPath}: ${err.message}`);
    }
  }

  console.log(`\nTotal saved: ${Math.round(totalSaved / 1024)}KB (${Math.round(totalSaved / 1024 / 1024 * 10) / 10}MB)\n`);
}

compress().catch(console.error);
