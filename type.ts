export interface MailConfigContentTypes {
  fileExtension: string;
  getTitle: (options?: { customTitle?: string }) => string;
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
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
  rateDelta?: number;
  rateLimit?: number;
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

export type SendMailResult = {
  success: boolean;
  messageId?: string;
  accepted: string[];
  rejected: string[];
  response?: string;
};
