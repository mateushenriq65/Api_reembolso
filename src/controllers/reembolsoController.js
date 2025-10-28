const pool = require("../config/db.js");

const criarReembolso = async (req, res) => {
  const { usuario_id, descricao, valor, data_despesa, categoria, comprovante } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reembolsos (usuario_id, descricao, valor, data_despesa, categoria, comprovante)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [usuario_id, descricao, valor, data_despesa, categoria, comprovante]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
   console.error("Erro ao criar reembolso:", err);
   res.status(500).json({ erro: err.message });
}

};

const listarReembolsos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.nome AS nome_usuario
      FROM reembolsos r
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.data_solicitacao DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reembolsos SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ erro: "Reembolso não encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

const deletarReembolso = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM reembolsos WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ erro: "Reembolso não encontrado" });

    res.json({ mensagem: "Reembolso deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

module.exports = { criarReembolso, listarReembolsos, atualizarStatus, deletarReembolso };
