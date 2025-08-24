import { Router } from "express";
import { db } from "../database";
import bcrypt from "bcrypt";

const router = Router();

// ✅ Listar usuários
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Funcionario");
    res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao buscar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// ✅ Criar usuário
router.post("/", async (req, res) => {
  try {
    console.log("📥 Dados recebidos:", req.body);

    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Campos obrigatórios faltando!" });
    }

    // 🔐 Gerar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      "INSERT INTO Funcionario (nome, email, telefone, senhaHash) VALUES (?, ?, ?, ?)",
      [nome, email, telefone || null, senhaHash]
    );

    res.json({ message: "Usuário criado com sucesso!" });
  } catch (err: any) {
    console.error("❌ Erro ao criar usuário:", err);

    // Erro de e-mail duplicado (chave única no MySQL)
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "E-mail já cadastrado!" });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// ✅ Atualizar usuário
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    await db.query(
      "UPDATE Funcionario SET nome=?, email=?, telefone=? WHERE id=?",
      [nome, email, telefone, id]
    );

    res.json({ message: "Usuário atualizado!" });
  } catch (err) {
    console.error("❌ Erro ao atualizar usuário:", err);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// ✅ Deletar usuário
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM Funcionario WHERE id=?", [id]);
    res.json({ message: "Usuário deletado!" });
  } catch (err) {
    console.error("❌ Erro ao deletar usuário:", err);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

export default router;
