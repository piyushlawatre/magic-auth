import { createTransport } from "nodemailer";

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `piyushlawatre@gmail.com`;
  }

  transport() {
    return createTransport({
      host: process.env.SMTP_HOST,
      post: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(message, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message,
    };

    await this.transport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.sendEmail(
      `Hi ${this.firstName}, welcome to Magic Pic! Your account has been created. Please log in here: ${this.url}`,
      "Welcome to Magic Auth"
    );
  }

  async sendMagicLinkForSignUp() {
    const message = `Hello ${this.firstName}, here is your magic link to log in: ${this.url}. Please proceed to log in.`;
    await this.sendEmail(message, "Magic Link for Sign Up");
  }
}

export default Email;
