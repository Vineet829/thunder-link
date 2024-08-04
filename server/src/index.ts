import * as dotenv from "dotenv";
import { initServer } from "./app";

dotenv.config();

async function init() {
  const app = await initServer();
}


init();
