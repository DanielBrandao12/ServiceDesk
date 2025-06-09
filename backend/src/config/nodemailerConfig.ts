import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error("Variáveis de ambiente do email não configuradas corretamente.");
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter;
