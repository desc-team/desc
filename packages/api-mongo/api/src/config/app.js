import express from 'express';
import passport from 'passport';
import debug from 'debug';

import config from './config';
import passportConfig from './passport';
import applyMiddleware from './apply-middleware';
import attachRouters from './attach-routers';

const log = debug('app');
const app = express();
log(`app starting up in ${config.env} mode`);

app.set('view engine', 'ejs');

passportConfig(passport);
applyMiddleware(app, passport);
attachRouters(app, passport);

export default app;
