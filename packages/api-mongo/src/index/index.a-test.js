import { expect } from 'chai';
import request from 'supertest';

import config from '../config/config';
import app from '../config/app';

describe('Index acceptance tests', () => {
    context('GET /', () => {
        let response;
        before(() => {
            return request(app)
                .get('/')
                .expect(200)
                .then(res => {
                    response = res;
                });
        });

        it('renders the base html page', () => {
            expect(response.text.includes('<!DOCTYPE html>')).to.be.true;
        });

        it('response header includes text/html as the content-type', () => {
            expect(response.headers['content-type'].includes('text/html')).to.be.true;
        });
    });

    context('GET /api', () => {
        let json;
        before(() => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(res => {
                    json = res.body;
                });
        });

        it('returns basic api information', () => {
            expect(json).to.be.an('Object');
            expect(json).to.have.property('name');
            expect(json).to.have.property('version');
        });

        it('returns the correct version of the api', () => {
            expect(json.version).to.equal(config.version);
        });

        it('returns the correct name of the api', () => {
            expect(json.name).to.equal(config.name);
        });
    });
});
