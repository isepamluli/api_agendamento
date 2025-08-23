import express from "express";
import { db } from "./database";
import usuariosRoutes from "./routes/usuarios";
import salasRoutes from "./routes/salas";
import agendamentosRoutes from "./routes/agendamentos";

const app = express();
app.use(express.json());

// Rotas
app.use("/usuarios", usuariosRoutes);
app.use("/salas", salasRoutes);
app.use("/agendamentos", agendamentosRoutes);

// Teste de conexão
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SHOW TABLES");
    res.json({ status: "OK", tables: rows });
  } catch (err) {
    res.status(500).json({ error: "Erro ao conectar ao banco" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
