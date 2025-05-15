export interface SyslogServer {
    id: number;
    name?: string;
    host: string;
    port: number;
    protocol: "udp" | "tcp";
    disabled: boolean;

}
