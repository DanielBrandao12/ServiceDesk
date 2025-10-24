// src/utils/getUserData.ts
import { Cookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  id: number;
  nome_usuario: string;
  nome_completo: string;
  exp?: number;
  iat?: number;
}

export const getUserData = (): UserData | null => {
  try {
    const cookies = new Cookies();
    const token = cookies.get('authToken');

    if (!token) return null;

    const decoded = jwtDecode<UserData>(token);
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};
