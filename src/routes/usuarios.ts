import { Router } from "express";
import { db } from "../database";

const router = Router();

// Listar usuários
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Funcionario");
  res.json(rows);
});

// Criar usuário
router.post("/", async (req, res) => {
  const { nome, email, telefone, senhaHash } = req.body;
  await db.query(
    "INSERT INTO Funcionario (nome, email, telefone, senhaHash) VALUES (?, ?, ?, ?)",
    [nome, email, telefone, senhaHash]
  );
  res.json({ message: "Usuário criado com sucesso!" });
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
