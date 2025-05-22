import handlebars from "handlebars";
import {
  EmailDeliveryResponse,
  MailConfigContentTypes,
  MailConfiguration,
  MailOptions,
} from "./type";
import * as fs from "fs";
import * as nodemailer from "nodemailer";

export class HtmlMailSender {
  mailConfiguration: MailConfiguration;

  constructor(mailConfiguration: MailConfiguration) {
    this.mailConfiguration = mailConfiguration;
  }

  async sendMail(
    to: string,
    htmlFile: MailConfigContentTypes,
    mailRequest: Record<string, string>
  ): Promise<boolean> {
    let isSent = true;
    let html = "";
    try {
      html = fs.readFileSync(htmlFile.fileExtension, {
        encoding: "utf-8",
      });
    } catch (error) {
      isSent = false;
    }
    if (!isSent) {
      return isSent;
    }

    var template = handlebars.compile(html);

    const replacements: Record<string, string> = {};

    for (const key in mailRequest) {
      replacements[key] = mailRequest[key];
    }

    const htmlToSend: string = template(replacements);

    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      host: this.mailConfiguration.host,
      port: this.mailConfiguration.port,
      secure: this.mailConfiguration.secure,
      auth: {
        user: this.mailConfiguration.username,
        pass: this.mailConfiguration.password,
      },
    });

    const mailOptions: MailOptions = {
      from: ` ${this.mailConfiguration.name} <${this.mailConfiguration.username}>`,
      to: to,
      subject: htmlFile.getTitle(),
      html: htmlToSend,
    };

    transporter.sendMail(
      mailOptions,
      (error: Error | null, info: EmailDeliveryResponse) => {
        if (error) {
          isSent = false;
        }
        isSent = true;
      }
    );
    return isSent;
  }
}
