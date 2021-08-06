import 'reflect-metadata';
import { Connection, createConnection, getConnection } from 'typeorm';
import config from './config';

const envDbNameMap: Map<string, string> = new Map();
envDbNameMap.set('development', 'desc-dev');
envDbNameMap.set('testing', 'desc-test');
envDbNameMap.set('testingE2E', 'desc-test');

const connectionName: string = envDbNameMap.get(config.env) as string;

export async function createPostgresConnection(): Promise<void> {
    try {
        if (config.env != 'production') {
            await createConnection(connectionName);
        }
        // else connect to heroku hosted postres
        // instance assigned to env var DATABASE_URL
    } catch (e) {
        console.error(e);
    }
}

export function closeConnection(): Promise<void> {
    return getConnection(connectionName).close();
}

export function getDbConnection(): Connection {
    return getConnection(connectionName);
}
