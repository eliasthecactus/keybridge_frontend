export interface SmtpServer {
    id: number;
    name?: string;
    security: string;
    host: string;
    username: string;
    password?: string;
    port: number;
    from_email: string;
}
