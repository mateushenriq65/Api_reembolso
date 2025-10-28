const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./src/routes/usuarioRoutes.js");
const reembolsoRoutes = require("./src/routes/reembolsoRoutes.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/reembolsos", reembolsoRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
