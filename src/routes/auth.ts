// routes/auth.ts
import { Router, Request, Response } from "express";
import { db } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// 🔑 Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios!" });
    }

    // 🔍 Buscar funcionário
    const [rows]: any = await db.query(
      "SELECT * FROM Funcionario WHERE email = ? LIMIT 1",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const funcionario = rows[0];

    // ✅ Verificar senha (senha fornecida x senha hashada no banco)
    const senhaCorreta = await bcrypt.compare(senha, funcionario.senhaHash);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // ✅ Gerar token JWT
    if (!process.env.JWT_SECRET) {
      console.error("⚠️ JWT_SECRET não configurado!");
      return res.status(500).json({ error: "Erro interno de configuração" });
    }

    const token = jwt.sign(
      { id: funcionario.id, email: funcionario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login realizado com sucesso!",
      token,
      funcionario: {
        id: funcionario.id,
        nome: funcionario.nome,
        email: funcionario.email,
      },
    });
  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ error: "Erro no login" });
  }
});

export default router;
