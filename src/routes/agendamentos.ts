import { Router } from "express";
import { db } from "../database";

const router = Router();

// --------------------
// Listar agendamentos
// --------------------
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Agendamento");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    res.status(500).json({ error: "Erro ao listar agendamentos" });
  }
});

// --------------------
// Criar agendamento
// --------------------
router.post("/", async (req, res) => {
  try {
    const { evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId } = req.body;

    // Validação rápida
    if (!evento || !segmento || !data || !quantidadePessoas || !disponibilidadeId || !funcionarioId) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    const [result]: any = await db.query(
      `INSERT INTO Agendamento 
        (evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [evento, segmento, data, quantidadePessoas, disponibilidadeId, funcionarioId]
    );

    res.status(201).json({
      id: result.insertId,
      evento,
      segmento,
      data,
      quantidadePessoas,
      disponibilidadeId,
      funcionarioId,
      status: "PENDENTE", // sempre inicia assim
      message: "Agendamento criado com sucesso!"
    });

  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Essa disponibilidade já está ocupada." });
    }

    res.status(500).json({ error: "Erro ao criar agendamento" });
  }
});

// --------------------
// Atualizar agendamento
// --------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { evento, segmento, data, quantidadePessoas, status } = req.body;

    const [result]: any = await db.query(
      `UPDATE Agendamento 
       SET evento=?, segmento=?, data=?, quantidadePessoas=?, status=? 
       WHERE id=?`,
      [evento, segmento, data, quantidadePessoas, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    res.json({ message: "Agendamento atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({ error: "Erro ao atualizar agendamento" });
  }
});

// --------------------
// Deletar agendamento
// --------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result]: any = await db.query("DELETE FROM Agendamento WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    res.json({ message: "Agendamento deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar agendamento:", error);
    res.status(500).json({ error: "Erro ao deletar agendamento" });
  }
});

export default router;
