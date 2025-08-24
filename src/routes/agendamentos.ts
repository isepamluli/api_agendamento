import { Router } from "express";
import { db } from "../database";

const router = Router();

// Listar agendamentos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Agendamento");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar agendamentos" });
  }
});

// Criar agendamento
router.post("/", async (req, res) => {
  try {
    const { evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId } = req.body;

    const [result]: any = await db.query(
      "INSERT INTO Agendamento (evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId) VALUES (?, ?, ?, ?, ?, ?)",
      [evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId]
    );

    res.json({
      id: result.insertId,
      evento,
      segmento,
      data,
      quantidadePessoas,
      disponibilidadeId,
      funcionarioId,
      message: "Agendamento criado com sucesso!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

// Atualizar agendamento
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { evento, segmento, data, quantidadePessoas, status } = req.body;

    await db.query(
      "UPDATE Agendamento SET evento=?, segmento=?, data=?, quantidadePessoas=?, status=? WHERE id=?",
      [evento, segmento, data, quantidadePessoas, status, id]
    );

    res.json({ message: "Agendamento atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar agendamento" });
  }
});

// Deletar agendamento
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Agendamento WHERE id=?", [id]);
    res.json({ message: "Agendamento deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar agendamento" });
  }
});

export default router;
