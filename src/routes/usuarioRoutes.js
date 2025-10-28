const express = require("express");
const {registrarUsuario,loginUsuario,listarUsuarios,} = require("../controllers/usuarioController.js");

const router = express.Router();

router.post("/registrar", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/", listarUsuarios);

module.exports = router;
