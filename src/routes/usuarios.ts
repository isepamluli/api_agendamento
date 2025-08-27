import { Router, Request, Response } from "express";
import { db } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * ✅ Listar todos os funcionários (sem expor senha)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.query(
      "SELECT id, nome, email, telefone FROM Funcionario"
    );
    res.json({ message: "Funcionários listados com sucesso", data: rows });
  } catch (err) {
    console.error("❌ Erro ao buscar funcionários:", err);
    res.status(500).json({ error: "Erro ao buscar funcionários" });
  }
});

/**
 * ✅ Buscar funcionário por ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await db.query(
      "SELECT id, nome, email, telefone FROM Funcionario WHERE id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Funcionário não encontrado" });
    }

    res.json({ message: "Funcionário encontrado", data: rows[0] });
  } catch (err) {
    console.error("❌ Erro ao buscar funcionário:", err);
    res.status(500).json({ error: "Erro ao buscar funcionário" });
  }
});

/**
 * ✅ Criar funcionário (com hash de senha)
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("📥 Dados recebidos:", req.body);

    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios!" });
    }

    // 🔐 Gerar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    await db.query(
      "INSERT INTO Funcionario (nome, email, telefone, senhaHash) VALUES (?, ?, ?, ?)",
      [nome, email, telefone || null, senhaHash]
    );

    res.status(201).json({ message: "Funcionário criado com sucesso!" });
  } catch (err: any) {
    console.error("❌ Erro ao criar funcionário:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "E-mail já cadastrado!" });
    }

    res.status(500).json({ error: "Erro ao criar funcionário" });
  }
});

/**
 * ✅ Atualizar funcionário (sem alterar senha aqui)
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    const [result]: any = await db.query(
      "UPDATE Funcionario SET nome=?, email=?, telefone=? WHERE id=?",
      [nome, email, telefone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Funcionário não encontrado!" });
    }

    res.json({ message: "Funcionário atualizado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao atualizar funcionário:", err);
    res.status(500).json({ error: "Erro ao atualizar funcionário" });
  }
});

/**
 * ✅ Deletar funcionário
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result]: any = await db.query(
      "DELETE FROM Funcionario WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Funcionário não encontrado!" });
    }

    res.json({ message: "Funcionário deletado com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao deletar funcionário:", err);
    res.status(500).json({ error: "Erro ao deletar funcionário" });
  }
});

/**
 * 🔑 Login do funcionário
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: "E-mail e senha são obrigatórios!" });
    }

    // 🔍 Buscar funcionário
    const [rows]: any = await db.query(
      "SELECT * FROM Funcionario WHERE email = ? LIMIT 1",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas!" });
    }

    const funcionario = rows[0];

    // 🔐 Comparar senha
    const senhaValida = await bcrypt.compare(senha, funcionario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas!" });
    }

    // 🔑 Gerar token JWT
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
    res.status(500).json({ error: "Erro ao realizar login" });
  }
});

export default router;
