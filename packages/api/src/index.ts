import app from './config/app';
import config from './config/config';
import { createPostgresConnection } from './config/database';

process.env.TZ = 'UTC';

const startApp = async (): Promise<void> => {
    try {
        await createPostgresConnection();
    } catch (e) {
        console.log(e);
    }
    app.listen(config.port, () => {
        console.log(`express server running at ${config.baseUrl}:${config.port}`);
    });
};

startApp();
