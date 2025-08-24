import { Router, Request, Response } from "express";
import { db } from "../database";

const router = Router();

// Listar disponibilidades
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query("SELECT * FROM Disponibilidade");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar disponibilidades" });
  }
});

// Criar disponibilidade
router.post("/", async (req: Request, res: Response) => {
  try {
    const { data, horarioInicio, horarioFim } = req.body;
    await db.query(
      "INSERT INTO Disponibilidade (data, horarioInicio, horarioFim) VALUES (?, ?, ?)",
      [data, horarioInicio, horarioFim]
    );
    res.json({ message: "Disponibilidade criada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar disponibilidade" });
  }
});

// Atualizar disponibilidade
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, horarioInicio, horarioFim } = req.body;
    await db.query(
      "UPDATE Disponibilidade SET data=?, horarioInicio=?, horarioFim=? WHERE id=?",
      [data, horarioInicio, horarioFim, id]
    );
    res.json({ message: "Disponibilidade atualizada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar disponibilidade" });
  }
});

// Deletar disponibilidade
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Disponibilidade WHERE id=?", [id]);
    res.json({ message: "Disponibilidade deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar disponibilidade" });
  }
});

export default router;
