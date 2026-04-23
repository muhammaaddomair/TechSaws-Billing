import net from "node:net";
import tls from "node:tls";

type MailAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
};

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  attachments?: MailAttachment[];
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  fromName: string;
};

function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass || !from) {
    throw new Error("SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM must be configured before sending email.");
  }

  return {
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user,
    pass,
    from,
    fromName: process.env.SMTP_FROM_NAME || "TechSaws Billing"
  };
}

function encodeHeader(value: string) {
  return /[^\x20-\x7E]/.test(value) ? `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=` : value;
}

function formatAddress(email: string, name?: string) {
  return name ? `${encodeHeader(name)} <${email}>` : email;
}

function escapeLineStart(value: string) {
  return value.replace(/^\./gm, "..");
}

function buildMimeMessage(config: SmtpConfig, input: SendMailInput) {
  const boundary = `techsaws-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const headers = [
    `From: ${formatAddress(config.from, config.fromName)}`,
    `To: ${input.to}`,
    `Subject: ${encodeHeader(input.subject)}`,
    "MIME-Version: 1.0",
    `Date: ${new Date().toUTCString()}`
  ];

  if (!input.attachments?.length) {
    return [...headers, 'Content-Type: text/plain; charset="UTF-8"', "Content-Transfer-Encoding: 7bit", "", input.text].join("\r\n");
  }

  const parts = [
    ...headers,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
    "",
    input.text
  ];

  for (const attachment of input.attachments) {
    parts.push(
      `--${boundary}`,
      `Content-Type: ${attachment.contentType}; name="${attachment.filename}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      "",
      attachment.content.toString("base64").replace(/.{1,76}/g, "$&\r\n").trimEnd()
    );
  }

  parts.push(`--${boundary}--`, "");
  return parts.join("\r\n");
}

class SmtpClient {
  private socket: net.Socket | tls.TLSSocket | null = null;
  private buffer = "";

  constructor(private readonly config: SmtpConfig) {}

  async send(input: SendMailInput) {
    await this.connect();
    await this.expect([220]);
    await this.command(`EHLO ${this.localhost()}`, [250]);

    if (!this.config.secure) {
      await this.command("STARTTLS", [220]);
      this.socket = tls.connect({ socket: this.socket as net.Socket, servername: this.config.host });
      this.attachSocketHandlers();
      await this.waitForSecureConnect();
      this.buffer = "";
      await this.command(`EHLO ${this.localhost()}`, [250]);
    }

    await this.command("AUTH LOGIN", [334]);
    await this.command(Buffer.from(this.config.user).toString("base64"), [334]);
    await this.command(Buffer.from(this.config.pass).toString("base64"), [235]);
    await this.command(`MAIL FROM:<${this.config.from}>`, [250]);
    await this.command(`RCPT TO:<${input.to}>`, [250, 251]);
    await this.command("DATA", [354]);
    await this.command(`${escapeLineStart(buildMimeMessage(this.config, input))}\r\n.`, [250]);
    await this.command("QUIT", [221]).catch(() => undefined);
    this.socket?.end();
  }

  private async connect() {
    this.socket = this.config.secure
      ? tls.connect({ host: this.config.host, port: this.config.port, servername: this.config.host })
      : net.connect({ host: this.config.host, port: this.config.port });
    this.attachSocketHandlers();
  }

  private attachSocketHandlers() {
    if (!this.socket) return;
    this.socket.setEncoding("utf8");
    this.socket.on("data", (chunk) => {
      this.buffer += chunk;
    });
    this.socket.on("error", () => undefined);
  }

  private localhost() {
    return process.env.SMTP_HELO_DOMAIN || "localhost";
  }

  private waitForSecureConnect() {
    return new Promise<void>((resolve, reject) => {
      const socket = this.socket as tls.TLSSocket;
      socket.once("secureConnect", () => resolve());
      socket.once("error", reject);
    });
  }

  private command(command: string, expected: number[]) {
    this.socket?.write(`${command}\r\n`);
    return this.expect(expected);
  }

  private expect(expected: number[]) {
    return new Promise<string>((resolve, reject) => {
      const startedAt = Date.now();
      const timer = setInterval(() => {
        const response = this.readCompleteResponse();
        if (!response) {
          if (Date.now() - startedAt > 30_000) {
            clearInterval(timer);
            reject(new Error("SMTP server did not respond in time."));
          }
          return;
        }

        clearInterval(timer);
        const code = Number(response.slice(0, 3));
        if (expected.includes(code)) {
          resolve(response);
        } else {
          reject(new Error(`SMTP error: ${response.replace(/\s+/g, " ").trim()}`));
        }
      }, 25);
    });
  }

  private readCompleteResponse() {
    const lines = this.buffer.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return null;
    const last = lines[lines.length - 1];
    if (!/^\d{3} /.test(last)) return null;

    const response = lines.join("\n");
    this.buffer = "";
    return response;
  }
}

export async function sendMail(input: SendMailInput) {
  const client = new SmtpClient(getSmtpConfig());
  await client.send(input);
}
