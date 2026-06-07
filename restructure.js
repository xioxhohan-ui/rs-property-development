const fs = require('fs-extra');
const path = require('path');

async function restructure() {
  const adminDir = path.join(__dirname, 'src', 'app', 'admin', '(dashboard)');
  const propertiesDir = path.join(adminDir, 'properties');
  const manageDir = path.join(adminDir, 'manage');
  const collectionDir = path.join(manageDir, '[collection]');

  if (!fs.existsSync(manageDir)) fs.mkdirSync(manageDir);
  if (!fs.existsSync(collectionDir)) fs.mkdirSync(collectionDir);

  // Move everything from properties to manage/[collection]
  if (fs.existsSync(propertiesDir)) {
    const items = fs.readdirSync(propertiesDir);
    for (const item of items) {
      fs.moveSync(path.join(propertiesDir, item), path.join(collectionDir, item), { overwrite: true });
    }
    fs.rmdirSync(propertiesDir);
    console.log('Restructure successful');
  } else {
    console.log('properties dir not found');
  }
}

restructure().catch(console.error);
