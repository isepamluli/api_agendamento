import { Router } from "express";
import pool from "../database";

const router = Router();

// GET /tiposala
router.get("/", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM TipoSala ORDER BY id");
  res.json(rows);
});

// POST /tiposala
router.post("/", async (req, res) => {
  const { descricao, recursos } = req.body;
  if (!descricao) return res.status(400).json({ error: "descricao é obrigatória" });
  await pool.query("INSERT INTO TipoSala (descricao, recursos) VALUES (?, ?)", [descricao, recursos || null]);
  res.json({ message: "Tipo de sala criado" });
});

export default router;
