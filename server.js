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
  try {
    const { username, password } = req.body;
    
    // Obtener la lista de usuarios actual del Gist
    let users = await fetchData(USERS_URL);
    
    // Verificar si el usuario ya existe
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: 'Este nombre de usuario ya está registrado.' });
    }
    
    // Agregar el nuevo usuario a la lista (solo en memoria)
    users.push({ username, password, userType: 'cliente' });
    
    // IMPORTANTE:
    // Esta parte del código demuestra la lógica, pero NO guarda los datos en el Gist.
    // Gists públicos no se pueden editar con peticiones POST/PATCH.
    // Se necesita una base de datos real (como MongoDB Atlas, Supabase, etc.) para guardar los datos de forma permanente.
    
    res.status(201).json({ message: 'Registro exitoso.', user: { username, userType: 'cliente' } });
  } catch (error) {
    console.error('Error in /api/register:', error);
    res.status(500).json({ message: 'Ocurrió un error en el servidor.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Obtener la lista de usuarios del Gist
    const users = await fetchData(USERS_URL);
    
    // Buscar al usuario
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      res.status(200).json({ message: 'Inicio de sesión exitoso.', user });
    } else {
      res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos.' });
    }
  } catch (error) {
    console.error('Error in /api/login:', error);
    res.status(500).json({ message: 'Ocurrió un error en el servidor.' });
  }
});

// Endpoints de tipo POST que no funcionan con Gist
app.post('/api/toppers', (req, res) => {
  res.status(501).json({ message: 'No se puede agregar toppers. La funcionalidad no está disponible con Gist.' });
});

app.post('/api/cupcakes', (req, res) => {
  res.status(501).json({ message: 'No se puede agregar cupcakes. La funcionalidad no está disponible con Gist.' });
});

module.exports = app;
