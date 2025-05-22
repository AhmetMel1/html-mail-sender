export interface MailConfigContentTypes {
    fileExtension: string;
    getTitle: (options?: {
        customTitle?: string;
    }) => string;
}
export interface MailConfigTypes {
    [key: string]: MailConfigContentTypes;
}
export type MailConfiguration = {
    username: string;
    password: string;
    name: string;
    host: string;
    port: number;
    secure: boolean;
};
export type MailOptions = {
    from: string;
    to: string;
    subject: string;
    html: string;
};
export type EmailDeliveryResponse = {
    accepted: string[];
    rejected: string[];
    ehlo: string[];
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: {
        from: string;
        to: string[];
    };
    messageId: string;
};
