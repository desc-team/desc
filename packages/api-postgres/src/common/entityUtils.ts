import { EntityManager } from 'typeorm';
import { getDbConnection } from '../config/database';

export function getEntityManager(): EntityManager {
    return getDbConnection().manager;
}
