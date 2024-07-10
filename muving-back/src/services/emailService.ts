import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendVerificationEmail = async (
  address: string,
  code: number
): Promise<void> => {
  const mailOptions = {
    from: '"Muving Support" <support@muving.site>',
    to: address,
    subject: 'Muving email verification code',
    text: `Your verification code is ${code}. It will expire in 10 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
