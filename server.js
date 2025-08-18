require("dotenv").config(); // arriba del todo
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "clave-secreta";

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error MongoDB:", err.message));

app.use(cors());
app.use(express.json());

// ====== Esquemas de MongoDB ======
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  userType: { type: String, enum: ["cliente", "vendedor"], default: "cliente" }
});

const productSchema = new mongoose.Schema({
  imageUrl: String,
  price: Number,
  category: { type: String, enum: ["toppers", "cupcakes"] }
});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

// ====== Middleware auth ======
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autenticado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

// ====== Rutas de usuarios ======
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, userType });
    await newUser.save();

    res.json({ user: { username, userType } });
  } catch (error) {
    res.status(400).json({ message: "Error al registrar usuario: " + error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id, username: user.username, userType: user.userType }, JWT_SECRET, { expiresIn: "2h" });

  res.json({ token, user: { username: user.username, userType: user.userType } });
});

// ====== Rutas de productos ======
app.get("/api/toppers", async (req, res) => {
  const toppers = await Product.find({ category: "toppers" });
  res.json(toppers);
});

app.get("/api/cupcakes", async (req, res) => {
  const cupcakes = await Product.find({ category: "cupcakes" });
  res.json(cupcakes);
});

// Solo vendedor puede agregar productos
app.post("/api/products", authMiddleware, async (req, res) => {
  if (req.user.userType !== "vendedor") {
    return res.status(403).json({ message: "Solo vendedores pueden agregar productos" });
  }

  const { imageUrl, price, category } = req.body;
  const newProduct = new Product({ imageUrl, price, category });
  await newProduct.save();

  res.json({ message: "Producto agregado", product: newProduct });
});

// ====== Proxy para imágenes (Imgur) ======
app.get("/api/image-proxy", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send("Falta la URL de la imagen.");

  try {
    const response = await axios.get(imageUrl, { responseType: "stream" });
    response.data.pipe(res);
  } catch (error) {
    console.error("Error con proxy de imagen:", error.message);
    res.status(500).send("Error al cargar la imagen.");
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});

module.exports = app;
