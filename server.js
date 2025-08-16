const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// URLs 'Raw' de tus Gists. ¡Ya están listas!
const TOPPERS_URL = 'https://gist.githubusercontent.com/helennmorales/b196b0fff51e71faf7d6b7dbbec69d03/raw/29b4bfb46a007f41437bc119230dc92c2351b00a/toppers.json';
const CUPCAKES_URL = 'https://gist.githubusercontent.com/helennmorales/55fce4911fb8ba90c24ba554304cc3c6/raw/33ba438b1d7b0243dbf5088d8c9e481472e76d16/cupcakes.json';

async function fetchData(url) {
  const response = await axios.get(url);
  return response.data;
}

app.get('/api/toppers', async (req, res) => {
  try {
    const toppers = await fetchData(TOPPERS_URL);
    res.json(toppers);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar los toppers.' });
  }
});

app.post('/api/toppers', (req, res) => {
  res.status(501).json({ message: 'No se puede agregar toppers. La funcionalidad de agregar no está disponible con Gist.' });
});

app.get('/api/cupcakes', async (req, res) => {
  try {
    const cupcakes = await fetchData(CUPCAKES_URL);
    res.json(cupcakes);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar los cupcakes.' });
  }
});

app.post('/api/cupcakes', (req, res) => {
  res.status(501).json({ message: 'No se puede agregar cupcakes. La funcionalidad de agregar no está disponible con Gist.' });
});

module.exports = app;
