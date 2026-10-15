import * as dotenv from "dotenv";
import { initServer } from "./app";

dotenv.config();

// The JWT signing secret has no default: refuse to start without one rather
// than fail at the first sign-in.
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Add it to server/.env before starting.");
  process.exit(1);
}

async function init() {
  const app = await initServer();
  app.listen(8000, () => console.log(`Server Started at PORT:8000`));
}

init();

