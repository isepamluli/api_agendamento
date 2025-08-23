import { Router } from "express";
import { db } from "../database";

const router = Router();

// Listar agendamentos
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Agendamento");
  res.json(rows);
});

// Criar agendamento
router.post("/", async (req, res) => {
  const { evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId } = req.body;
  await db.query(
    "INSERT INTO Agendamento (evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId) VALUES (?, ?, ?, ?, ?, ?)",
    [evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId]
  );
  res.json({ message: "Agendamento criado!" });
});

// Atualizar agendamento
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { evento, segmento, data, quantidadePessoas, status } = req.body;
  await db.query(
    "UPDATE Agendamento SET evento=?, segmento=?, data=?, quantidadePessoas=?, status=? WHERE id=?",
    [evento, segmento, data, quantidadePessoas, status, id]
  );
  res.json({ message: "Agendamento atualizado!" });
});

// Deletar agendamento
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM Agendamento WHERE id=?", [id]);
  res.json({ message: "Agendamento deletado!" });
});

export default router;
