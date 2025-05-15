export interface TwoFaSource {
    id: number;
    name: string;
    host: string;
    port: number;
    ssl: boolean;
    disabled: boolean;
    type: 'linotp';
    realm: string;
}