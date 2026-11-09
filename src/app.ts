import { app } from "./server.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

try {
  if (!env.jwt.secret) {
    throw new Error("La variable JWT_SECRET est obligatoire.");
  }

  await connectDatabase();

  app.listen(env.port, '127.0.0.1', () => {
    console.log(`Serveur démarré sur le port ${env.port}.`);
  });
} catch (error) {
  console.error('Impossible de démarrer le serveur ou de préparer la base de données :', error);
  process.exitCode = 1;
}
