import { ImapFlow } from 'imapflow';
import imapConfig from '../../config/imapConfig';

export const conectarIMAP = async (): Promise<ImapFlow> => {
  const client = new ImapFlow(imapConfig);

  client.on('error', (err: any) => {
    console.error('Erro na conexão IMAP:', err);
  });

  client.on('close', () => {
    console.log('Conexão IMAP encerrada');
  });

  try {
    await client.connect();
    console.log('Conectado ao IMAP com sucesso!');
    return client;
  } catch (error) {
    console.error('Erro ao conectar ao IMAP:', error);
    console.log('Tentando reconectar em 5 segundos...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return conectarIMAP(); // recursivamente tenta conectar de novo
  }
};
