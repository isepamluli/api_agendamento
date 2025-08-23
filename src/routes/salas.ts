import { Router } from "express";
import { db } from "../database";

const router = Router();

// Listar salas
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Sala");
  res.json(rows);
});

// Criar sala
router.post("/", async (req, res) => {
  const { nome, descricao, numero, capacidade, tipoSalaId } = req.body;
  await db.query(
    "INSERT INTO Sala (nome, descricao, numero, capacidade, tipoSalaId) VALUES (?, ?, ?, ?, ?)",
    [nome, descricao, numero, capacidade, tipoSalaId]
  );
  res.json({ message: "Sala criada!" });
});

// Atualizar sala
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, numero, capacidade, tipoSalaId } = req.body;
  await db.query(
    "UPDATE Sala SET nome=?, descricao=?, numero=?, capacidade=?, tipoSalaId=? WHERE id=?",
    [nome, descricao, numero, capacidade, tipoSalaId, id]
  );
  res.json({ message: "Sala atualizada!" });
});

// Deletar sala
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM Sala WHERE id=?", [id]);
  res.json({ message: "Sala deletada!" });
});

export default router;
