import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./database";

// Importando middleware e rotas
import { autenticarJWT } from "./middleware/auth"; 
import authRoutes from "./routes/auth"; 
import usuariosRoutes from "./routes/usuarios"; 
import salasRoutes from "./routes/salas";
import agendamentosRoutes from "./routes/agendamentos";
import disponibilidadesRoutes from "./routes/disponibilidades";

dotenv.config();

const app = express();

// ✅ Middlewares globais
app.use(cors()); // habilitar CORS para consumo pelo front
app.use(express.json()); // receber JSON

// 🔓 Rotas públicas
app.use("/auth", authRoutes);          // rota de login
app.use("/usuarios", usuariosRoutes);  // cadastro/listagem de usuários
app.use("/salas", salasRoutes);        // salas (livre acesso?)

// 🔒 Rotas privadas (precisam de JWT válido)
app.use("/agendamentos", autenticarJWT, agendamentosRoutes);
app.use("/disponibilidades", autenticarJWT, disponibilidadesRoutes);

// Rota teste para verificar conexão com o banco
app.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json({ status: "✅ Conectado ao banco!", tables: rows });
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
    res.status(500).json({ error: "Erro ao conectar ao banco" });
  }
});

// Porta configurada no .env ou padrão 3000
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
