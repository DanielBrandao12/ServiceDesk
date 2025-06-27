import transporter from '../config/nodemailerConfig';
import { simpleParser } from 'mailparser';
import { conectarIMAP } from '../services/email/emailService';
import { criarChamadoPorEmail, getTicketPorCodigo } from './ticketsController';
import { createRespostaAuto } from './respostasController';
import { ticketCriadoTemplate } from '../services/email/templates/ticketCriado';
import { sendEmail } from '../services/email/sendEMail';


export const enviarRespostaAutomatica = async (
  remetente: string,
  codigoTicket: string,
  mensagem: string
): Promise<void> => {
  try {
    if (!process.env.EMAIL_USER) {
      throw new Error("EMAIL_USER não está definido nas variáveis de ambiente.");
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: remetente,
      subject: `Atualização do chamado - ${codigoTicket}`,
      html: mensagem ,//criar um template para respostas
    });

    console.log(`Resposta automática enviada para: ${remetente}`);
  } catch (mailError) {
    console.error(
      `Erro ao enviar resposta automática para ${remetente}:`,
      mailError
    );
  }
};


export const checkEmails = async () => {
  let connection;
  try {
    console.log("Iniciando a conexão IMAP...");
    connection = await conectarIMAP();
    console.log("Conexão estabelecida com sucesso!");

    await connection.mailboxOpen("INBOX");

    const uids = await connection.search({ seen: false });
    console.log(`Encontrados ${uids.length} e-mails não lidos.`);

    if (uids.length === 0) {
      console.log("Nenhum e-mail novo para processar.");
      return;
    }

    for await (const message of connection.fetch(uids, { source: true })) {
      try {
        const parsed = await simpleParser(message.source);

        const chamado = {
          remetente: parsed.from?.text || parsed.from || "Desconhecido",
          assunto: parsed.subject || "Sem assunto",
          mensagem: parsed.html || parsed.text || "Sem mensagem",
          anexos: parsed.attachments.map((att) => ({
            nome: att.filename,
            tipo: att.contentType,
            tamanho: att.size,
            arquivo: att.content,
          })),
        };

        const codigoTicket = extrairCodigoTicket(chamado.assunto);

        if (codigoTicket) {
          const ticketExistente = await getTicketPorCodigo(codigoTicket);
          if (ticketExistente && ticketExistente.id_status !== 4) {
            const mensagem = chamado.mensagem; //getCorpoEmailLimpo(chamado.mensagem)
            await createRespostaAuto(
              ticketExistente.dataValues.id_ticket,
              mensagem,
              chamado.anexos
            );
             connection.messageFlagsAdd(message.uid, ['\\Seen']);
            continue;
          }
        }

        const ticketCriado = await criarChamadoPorEmail(chamado);
    
           await sendEmail({
              to: chamado.remetente,
              subject: `Chamado Criado - ${ticketCriado.ticketCriado?.codigo_ticket}`,
              html: ticketCriadoTemplate(ticketCriado.ticketCriado?.codigo_ticket ),
              attachments: [
                {
                  filename: "logo.png",
                  path: "../backend/public/images/logo.png",
                  cid: "logo",
                },
              ],
            });
         connection.messageFlagsAdd(message.uid, ['\\Seen']);
      } catch (error) {
        console.error(`Erro ao processar o e-mail:`, error);
      }
    }
  } catch (error) {
    console.error("Erro ao verificar e-mails:", error);
  } finally {
    if (connection) {
      await connection.logout();
      console.log("Conexão IMAP encerrada com sucesso!");
    }
  }
};

const extrairCodigoTicket = (assunto: string) => {
  const regex = /(\d{11})/; // Expressão regular para extrair o código do ticket
  const match = assunto.match(regex);
  return match ? match[1] : null; // Retorna o código se encontrado, caso contrário retorna null
};