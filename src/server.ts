import express, { Request, Response } from "express";
import cors from "cors"; // 🔹 Importar CORS se o front consumir essa API
import dotenv from "dotenv";
import { db } from "./database";

// Importando middleware e rotas
import { autenticarJWT } from "./middleware/auth"; // ✅ Middleware JWT
import authRoutes from "./routes/auth"; // ✅ Rota de login

import usuariosRoutes from "./routes/usuarios"; 
import salasRoutes from "./routes/salas";
import agendamentosRoutes from "./routes/agendamentos";
import disponibilidadesRoutes from "./routes/disponibilidades";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔓 Rotas públicas
app.use("/auth", authRoutes);       // Login
app.use("/usuarios", usuariosRoutes); 
app.use("/salas", salasRoutes);

// 🔒 Rotas privadas (precisam de JWT válido)
app.use("/agendamentos", autenticarJWT, agendamentosRoutes);
app.use("/disponibilidades", autenticarJWT, disponibilidadesRoutes);

// Rota teste para verificar conexão com o banco
app.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json({ status: "Conectado ao banco", tables: rows });
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
    res.status(500).json({ error: "Erro ao conectar ao banco" });
  }
});

// Porta configurada no .env ou padrão 3000
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
