export interface Application {
    id: number;
    name: string;
    path: string[];
    image?: string;
    hash: string[];
    check_hash: boolean;
    multiple_processes: boolean;
    allow_request_access: boolean
    disabled: boolean;
}
