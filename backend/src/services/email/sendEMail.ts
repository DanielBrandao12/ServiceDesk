import transporter from '../../config/nodemailerConfig';

interface SendEmailParams {
  to: string | any;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    path: string;
    cid?: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  html,
  attachments,
}: SendEmailParams): Promise<void> => {
  if (!to) throw new Error("Destinatário de e-mail não informado.");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    attachments,
  });
};
