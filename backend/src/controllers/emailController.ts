import transporter from '../config/nodemailerConfig';
import { simpleParser } from 'mailparser';
import { conectarIMAP } from '../services/email/emailService';
import { criarChamadoPorEmail, getTicketPorCodigo } from './ticketsController';
import { createRespostaAuto } from './respostasController';
import { ticketCriadoTemplate } from '../services/email/templates/ticketCriado';
import { sendEmail } from '../services/email/sendEMail';
import { AnexosAttributes } from '../types/anexos';



export const enviarRespostaAutomatica = async (
  remetente: string,
  codigoTicket: string,
  mensagem: string,
  anexos?: any,
): Promise<void> => {
  try {
    if (!process.env.EMAIL_USER) {
      throw new Error("EMAIL_USER não está definido nas variáveis de ambiente.");
    }
    console.log(anexos)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: remetente,
      subject: `Atualização do chamado - ${codigoTicket}`,
      html: mensagem,//criar um template para respostas
       attachments: anexos?.map((anexo: { nome: any; arquivo: any; tipo: any; }) => ({
        filename: anexo.nome,
        content: anexo.arquivo,
        contentType: anexo.tipo,
      })),
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

        const mensagemLimpa = limparMensagemEmail(parsed.html || parsed.text);

        const chamado = {
          remetente: parsed.from?.text || parsed.from || "Desconhecido",
          assunto: parsed.subject || "Sem assunto",
          mensagem: mensagemLimpa || "Sem mensagem",
          anexos: parsed.attachments.map(att => ({
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
            connection.messageFlagsAdd(message.seq, ["\\Seen"]);
            continue;
          }
        }

        const ticketCriado = await criarChamadoPorEmail(chamado);

        await sendEmail({
          to: chamado.remetente,
          subject: `Chamado Criado - ${ticketCriado.ticketCriado?.codigo_ticket}`,
          html: ticketCriadoTemplate(ticketCriado.ticketCriado?.codigo_ticket),
          attachments: [
            {
              filename: "logo.png",
              path: "../backend/public/images/logo.png",
              cid: "logo",
            },
          ],
        });
       connection.messageFlagsAdd(message.seq, ["\\Seen"]);
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

const  limparMensagemEmail = (html: string | undefined) => {
    if (!html) return "";

  // Remove <head>, <style> e <script> — só lixo técnico
  html = html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");

  // Define padrões que marcam o início da mensagem anterior (vários provedores)
  const padroes = [
    /<div id=["']?divRplyFwdMsg["']?>/i, // Outlook
    /<div class=["']?gmail_quote["']?>/i, // Gmail
    /<blockquote class=["']?gmail_quote["']?>/i, // Gmail
    /-----Mensagem original-----/i, // Outlook PT-BR
    /On .*? wrote:/i, // Gmail/Apple Mail EN
    /Em .*? escreveu:/i, // Gmail PT-BR
    /<hr/i, // Outlook separador
    /<div class=["']?yahoo_quoted["']?>/i, // Yahoo
    /<div class=["']?replyContainer["']?>/i, // Apple Mail
    /<div class=["']?moz-cite-prefix["']?>/i, // Thunderbird
    /<blockquote/i, // fallback genérico
  ];

  // Corta o HTML na primeira correspondência de qualquer padrão
  let corte = html.length;
  for (const padrao of padroes) {
    const match = html.search(padrao);
    if (match !== -1 && match < corte) {
      corte = match;
    }
  }
  let atual = html.slice(0, corte);

  // Limpa tags vazias e espaços inúteis (mantendo a estrutura visual)
  atual = atual
    .replace(/<div[^>]*>\s*<\/div>/gi, "") // remove divs vazias
    .replace(/<p[^>]*>\s*<\/p>/gi, "") // remove parágrafos vazios
    .replace(/\s{2,}/g, " ") // normaliza espaços
    .trim();

  return atual;
}
