import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always load backend/.env (works even if backend is started from repo root)
dotenv.config({ path: path.resolve(__dirname, "../.env") });
