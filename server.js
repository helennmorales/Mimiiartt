const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Rutas a los archivos de datos
const toppersFilePath = path.join(__dirname, 'toppers.json');
const cupcakesFilePath = path.join(__dirname, 'cupcakes.json');

// Inicializar archivos de datos con Imgur links
function initializeDataFile(filePath, defaultData) {
    if (!fs.existsSync(filePath)) {
        console.log(`Creando el archivo de datos: ${path.basename(filePath)}`);
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

// Datos iniciales para la primera carga
const initialToppers = [
    { name: "Topper 1", img: "https://i.imgur.com/6rDSk35.jpeg" },
    { name: "Topper 2", img: "https://i.imgur.com/wfp4Izk.jpeg" },
    { name: "Topper 3", "img": "https://i.imgur.com/YDZGOPg.jpeg" },
    { name: "Topper 4", "img": "https://i.imgur.com/SiYrc0N.jpeg" },
    { name: "Topper 5", "img": "https://i.imgur.com/toOZJo2.jpeg" },
    { name: "Topper 6", "img": "https://i.imgur.com/UKsxpfi.jpeg" },
    { name: "Topper 7", "img": "https://i.imgur.com/kgUveEJ.jpeg" },
    { name: "Topper 8", "img": "https://i.imgur.com/iSSccvI.jpeg" }
];

const initialCupcakes = [
    { name: "Cupcake 1", img: "https://i.imgur.com/eD3c7Vf.jpeg" },
    { name: "Cupcake 2", img: "https://i.imgur.com/9Cq7z3j.jpeg" }
];

initializeDataFile(toppersFilePath, initialToppers);
initializeDataFile(cupcakesFilePath, initialCupcakes);

// Función para leer datos de la "base de datos" (archivos JSON)
function readData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo ${filePath}:`, error);
        return [];
    }
}

// Función para escribir datos en la "base de datos" (archivos JSON)
function writeData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error al escribir en el archivo ${filePath}:`, error);
    }
}

// Endpoint para obtener todos los toppers
app.get('/api/toppers', (req, res) => {
    const toppers = readData(toppersFilePath);
    res.json(toppers);
});

// Endpoint para agregar un nuevo topper
app.post('/api/toppers', (req, res) => {
    const newTopper = req.body;
    if (!newTopper.name || !newTopper.img) {
        return res.status(400).send('Faltan el nombre o la URL de la imagen.');
    }
    const toppers = readData(toppersFilePath);
    toppers.push(newTopper);
    writeData(toppersFilePath, toppers);
    res.status(201).json(newTopper);
});

// Endpoint para obtener todos los cupcakes
app.get('/api/cupcakes', (req, res) => {
    const cupcakes = readData(cupcakesFilePath);
    res.json(cupcakes);
});

// Endpoint para agregar un nuevo cupcake
app.post('/api/cupcakes', (req, res) => {
    const newCupcake = req.body;
    if (!newCupcake.name || !newCupcake.img) {
        return res.status(400).send('Faltan el nombre o la URL de la imagen.');
    }
    const cupcakes = readData(cupcakesFilePath);
    cupcakes.push(newCupcake);
    writeData(cupcakesFilePath, cupcakes);
    res.status(201).json(newCupcake);
});

// Mensaje de inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor de Mimi Art escuchando en http://localhost:${PORT}`);
});