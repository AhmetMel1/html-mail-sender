import handlebars from "handlebars";
import {
  EmailDeliveryResponse,
  MailConfigContentTypes,
  MailConfiguration,
  MailOptions,
  SendMailResult,
} from "./type";
import * as fs from "fs";
import * as nodemailer from "nodemailer";
import SMTPPool from "nodemailer/lib/smtp-pool";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class HtmlMailSender {
  mailConfiguration: MailConfiguration;
  private transporter: nodemailer.Transporter;

  constructor(mailConfiguration: MailConfiguration) {
    this.mailConfiguration = mailConfiguration;
    const transportOptions: SMTPTransport.Options = {
      host: this.mailConfiguration.host,
      port: this.mailConfiguration.port,
      secure: this.mailConfiguration.secure,
      auth: {
        user: this.mailConfiguration.username,
        pass: this.mailConfiguration.password,
      },
    };

    if (this.mailConfiguration.pool) {
      const poolTransportOptions: SMTPPool.Options = {
        ...transportOptions,
        pool: true,
        maxConnections: this.mailConfiguration.maxConnections,
        maxMessages: this.mailConfiguration.maxMessages,
        rateDelta: this.mailConfiguration.rateDelta,
        rateLimit: this.mailConfiguration.rateLimit,
      };

      this.transporter = nodemailer.createTransport(poolTransportOptions);
    } else {
      this.transporter = nodemailer.createTransport(transportOptions);
    }
  }

  async sendMail(
    to: string,
    htmlFile: MailConfigContentTypes,
    mailRequest: Record<string, string>,
  ): Promise<boolean> {
    try {
      const result = await this.sendMailDetailed(to, htmlFile, mailRequest);

      return result.success;
    } catch (error) {
      return false;
    }
  }

  async sendMailDetailed(
    to: string,
    htmlFile: MailConfigContentTypes,
    mailRequest: Record<string, string>,
  ): Promise<SendMailResult> {
    const html = fs.readFileSync(htmlFile.fileExtension, {
      encoding: "utf-8",
    });

    const template = handlebars.compile(html);
    const replacements: Record<string, string> = {};
    for (const key in mailRequest) {
      replacements[key] = mailRequest[key];
    }

    const htmlToSend: string = template(replacements);
    const mailOptions: MailOptions = {
      from: ` ${this.mailConfiguration.name} <${this.mailConfiguration.username}>`,
      to: to,
      subject: htmlFile.getTitle({ customTitle: mailRequest.customTitle }),
      html: htmlToSend,
    };

    const info = (await this.transporter.sendMail(
      mailOptions,
    )) as EmailDeliveryResponse;
    const accepted = info.accepted || [];
    const rejected = info.rejected || [];

    return {
      success: accepted.length > 0 && rejected.length === 0,
      messageId: info.messageId,
      accepted,
      rejected,
      response: info.response,
    };
  }
}
