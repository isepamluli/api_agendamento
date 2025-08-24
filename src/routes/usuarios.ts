import { Router } from "express";
import { db } from "../database";

const router = Router();

// Listar usuários
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Funcionario");
  res.json(rows);
});

// Criar sala
router.post("/", async (req, res) => {
  try {
    const { nome, descricao, numero, capacidade, tipoSalaId } = req.body;
    const [result]: any = await db.query(
      "INSERT INTO Sala (nome, descricao, numero, capacidade, tipoSalaId) VALUES (?, ?, ?, ?, ?)",
      [nome, descricao, numero, capacidade, tipoSalaId]
    );
    res.json({ id: result.insertId, nome, descricao });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar sala" });
  }
});

// Atualizar usuário
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;
  await db.query(
    "UPDATE Funcionario SET nome=?, email=?, telefone=? WHERE id=?",
    [nome, email, telefone, id]
  );
  res.json({ message: "Usuário atualizado!" });
});

// Deletar usuário
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM Funcionario WHERE id=?", [id]);
  res.json({ message: "Usuário deletado!" });
});

export default router;
