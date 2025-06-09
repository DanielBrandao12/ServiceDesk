import { Session, SessionData } from "express-session";
import { UsuariosAttributes } from "./usuarios";


declare module "express-session" {
  interface SessionData {
    userLogged?:  Pick<
      UsuariosAttributes,
      "id_usuario" | "nome_usuario" | "nome_completo"
    >;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    session: Session & SessionData;
  }
}