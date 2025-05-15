export interface LdapServer {
    id: number;
    name: string;
    server_type?: "ad" | "ldap";
    description?: string;
    ssl: boolean;
    bind_user_dn?: string;
    bind_password?: string;
    base_dn?: string;
    host: string;
    port: number;
  }
