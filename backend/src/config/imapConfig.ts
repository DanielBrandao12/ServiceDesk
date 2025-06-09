import dotenv from 'dotenv';

dotenv.config();

interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tlsOptions: {
    rejectUnauthorized: boolean;
  };
  authTimeout: number;
}

const imapConfig: ImapConfig = {
  host: process.env.EMAIL_HOST || '',
  port: 993,
  secure: true, // 'secure' no lugar de 'tls' (ImapFlow usa 'secure')
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
  tlsOptions: { rejectUnauthorized: false },
  authTimeout: 60000,
};

export default imapConfig;
