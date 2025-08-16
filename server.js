const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const toppersFile = path.join(__dirname, 'toppers.json');
const cupcakesFile = path.join(__dirname, 'cupcakes.json');

// Función para inicializar archivos JSON si no existen
function initializeJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
}

// Inicializar archivos al inicio
initializeJsonFile(toppersFile);
initializeJsonFile(cupcakesFile);

app.get('/api/toppers', (req, res) => {
  const toppers = JSON.parse(fs.readFileSync(toppersFile));
  res.json(toppers);
});

app.post('/api/toppers', (req, res) => {
  const toppers = JSON.parse(fs.readFileSync(toppersFile));
  const newTopper = req.body;
  toppers.push(newTopper);
  fs.writeFileSync(toppersFile, JSON.stringify(toppers, null, 2));
  res.json({ message: 'Topper agregado exitosamente' });
});

app.get('/api/cupcakes', (req, res) => {
  const cupcakes = JSON.parse(fs.readFileSync(cupcakesFile));
  res.json(cupcakes);
});

app.post('/api/cupcakes', (req, res) => {
  const cupcakes = JSON.parse(fs.readFileSync(cupcakesFile));
  const newCupcake = req.body;
  cupcakes.push(newCupcake);
  fs.writeFileSync(cupcakesFile, JSON.stringify(cupcakes, null, 2));
  res.json({ message: 'Cupcake agregado exitosamente' });
});

module.exports = app;
