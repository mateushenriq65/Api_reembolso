const express = require("express");
const {criarReembolso,listarReembolsos,atualizarStatus,deletarReembolso,} = require("../controllers/reembolsoController.js");

const router = express.Router();

router.post("/", criarReembolso);
router.get("/", listarReembolsos);
router.put("/:id/status", atualizarStatus);
router.delete("/:id", deletarReembolso);

module.exports = router;
