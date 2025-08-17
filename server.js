const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// URLs 'Raw' de tus Gists. ¡Ya están todas listas!
const TOPPERS_URL = 'https://gist.githubusercontent.com/helennmorales/b196b0fff51e71faf7d6b7dbbec69d03/raw/29b4bfb46a007f41437bc119230dc92c2351b00a/toppers.json';
const CUPCAKES_URL = 'https://gist.githubusercontent.com/helennmorales/55fce4911fb8ba90c24ba554304cc3c6/raw/33ba438b1d7b0243dbf5088d8c9e481472e76d16/cupcakes.json';
const USERS_URL = 'https://gist.githubusercontent.com/helennmorales/cf84761a6db17fe0ddafb488820b4e61/raw/65426b5ec9f8b1c0484e55609b08c512701e68c3/users.json';

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    throw new Error('Error al conectar con la base de datos.');
  }
}

// NUEVO ENDPOINT PARA LAS IMÁGENES
app.get('/api/image-proxy', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send('Falta la URL de la imagen.');
  }

  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    response.data.pipe(res);
  } catch (error) {
    console.error('Error with image proxy:', error.message);
    res.status(500).send('Error al cargar la imagen.');
  }
});

// ENDPOINTS para productos
app.get('/api/toppers', async (req, res) => {
  try {
    const toppers = await fetchData(TOPPERS_URL);
    res.json(toppers);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar los toppers.' });
  }
});

app.get('/api/cupcakes', async (req, res) => {
  try {
    const cupcakes = await fetchData(CUPCAKES_URL);
    res.json(cupcakes);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar los cupcakes.' });
  }
});

// ENDPOINTS para usuarios
app.post('/api/register', async (req, res) => {
  // ... (código de registro, sin cambios)
});

app.post('/api/login', async (req, res) => {
  // ... (código de inicio de sesión, sin cambios)
});

// Endpoints de tipo POST que no funcionan con Gist
app.post('/api/toppers', (req, res) => {
  res.status(501).json({ message: 'No se puede agregar toppers. La funcionalidad no está disponible con Gist.' });
});

app.post('/api/cupcakes', (req, res) => {
  res.status(501).json({ message: 'No se puede agregar cupcakes. La funcionalidad no está disponible con Gist.' });
});

module.exports = app;
