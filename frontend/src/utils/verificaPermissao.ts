import { permissoes } from "./permissoes";

type Perfil = keyof typeof permissoes;
type Permissao = keyof typeof permissoes["admin"];

export function temPermissao(
  usuario: { perfil: Perfil },
  permissao: Permissao
) {
  return permissoes[usuario.perfil]?.[permissao] ?? false;
}