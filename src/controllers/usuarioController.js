const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db.js");

const registrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const check = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (check.rowCount > 0) {
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    }

    const hashed = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, tipo`,
      [nome, email, hashed, tipo]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rowCount === 0)
      return res.status(404).json({ erro: "Usuário não encontrado" });

    const user = result.rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ erro: "Senha incorreta" });

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      "chave_super_secreta",
      { expiresIn: "8h" }
    );

    res.json({ token, usuario: { id: user.id, nome: user.nome, tipo: user.tipo } });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nome, email, tipo FROM usuarios ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { registrarUsuario, loginUsuario, listarUsuarios };

