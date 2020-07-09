export * from './buyApi';
import { BuyApi } from './buyApi';
export * from './buyModelApi';
import { BuyModelApi } from './buyModelApi';
export * from './exportApi';
import { ExportApi } from './exportApi';
export * from './productApi';
import { ProductApi } from './productApi';
export * from './sellApi';
import { SellApi } from './sellApi';
export * from './userApi';
import { UserApi } from './userApi';
import * as fs from 'fs';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.ClientResponse, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;

export const APIS = [BuyApi, BuyModelApi, ExportApi, ProductApi, SellApi, UserApi];
