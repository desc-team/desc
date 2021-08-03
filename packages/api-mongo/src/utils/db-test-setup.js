import debug from 'debug';
import config from '../config/config';
import { dbConnection } from './db-test-utils';

const log = debug('test');

before(() => {
    log(`Running in ${config.env} mode`);
});

after(() => {
    dbConnection.close();
});
