const express = require("express");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require('./swagger');


const usuarioRoutes = require("./src/routes/usuarioRoutes.js");
const reembolsoRoutes = require("./src/routes/reembolsoRoutes.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/reembolsos", reembolsoRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: "API Reembolsos - Documentação"
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
