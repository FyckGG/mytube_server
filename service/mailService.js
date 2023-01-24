const nodemMailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Activation on ${process.env.API_URL}`,
      text: "",
      html: `<div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a>
            </div>`,
    });
  }

  async sendResetPasswordMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `implementation of password on ${process.env.API_URL}`,
      text: "",
      html: `<div>
      <h1>Для смены пароля перейдите по ссылке:</h1>
      <a href="${link}">${link}</a>
      </div>`,
    });
  }

  async sendMessageSuccessPasswordReset(to) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Succes implementation of password on ${process.env.API_URL}`,
      text: "",
      html: `<div>
      <h1>Пароль был успешно изменен</h1>
      </div>`,
    });
  }
}

module.exports = new MailService();
