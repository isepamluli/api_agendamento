import express, { Request, Response } from "express";
import { db } from "./database";

// Importando rotas
import usuariosRoutes from "./routes/usuarios";
import salasRoutes from "./routes/salas";
import agendamentosRoutes from "./routes/agendamentos";
import disponibilidadesRoutes from "./routes/disponibilidades";

const app = express();
app.use(express.json());

// Rotas principais
app.use("/usuarios", usuariosRoutes);
app.use("/salas", salasRoutes);
app.use("/agendamentos", agendamentosRoutes);
app.use("/disponibilidades", disponibilidadesRoutes);

// Rota teste para verificar conexão com o banco
app.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json({ status: "Conectado ao banco", tables: rows });
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
    res.status(500).json({ error: "Erro ao conectar ao banco" });
  }
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});
