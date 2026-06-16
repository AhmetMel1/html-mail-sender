import { MailConfigContentTypes, MailConfiguration, SendMailResult } from "./type";
export declare class HtmlMailSender {
    mailConfiguration: MailConfiguration;
    private transporter;
    constructor(mailConfiguration: MailConfiguration);
    sendMail(to: string, htmlFile: MailConfigContentTypes, mailRequest: Record<string, string>): Promise<boolean>;
    sendMailDetailed(to: string, htmlFile: MailConfigContentTypes, mailRequest: Record<string, string>): Promise<SendMailResult>;
}
