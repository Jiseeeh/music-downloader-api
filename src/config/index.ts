import { config } from "dotenv";
config({ path: ".env" });

export const { PORT, ORIGIN } = process.env;
