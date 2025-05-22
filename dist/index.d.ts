import { MailConfigContentTypes, MailConfiguration } from "./type";
export declare class HtmlMailSender {
    mailConfiguration: MailConfiguration;
    constructor(mailConfiguration: MailConfiguration);
    sendMail(to: string, htmlFile: MailConfigContentTypes, mailRequest: Record<string, string>): Promise<boolean>;
}
