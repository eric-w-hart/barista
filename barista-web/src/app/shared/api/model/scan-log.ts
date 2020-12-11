import { Scan } from './scan';


export interface ScanLog {
    createdAt: object;
    id: number;
    metaData: object;
    tag: string;
    updatedAt: object;
    log: string;
    scan: Scan;

}

