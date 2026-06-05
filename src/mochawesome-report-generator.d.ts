declare module 'mochawesome-report-generator' {
    export function create(data: any, opts: any): Promise<void>;
    export function createSync(data: any, opts: any): void;
}

