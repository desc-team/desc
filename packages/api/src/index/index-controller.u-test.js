import { expect } from 'chai';
import sinon from 'sinon';

import * as Controller from './index-controller';

describe('Index controller unit tests', () => {
    let req;

    beforeEach(() => {
        req = {};
    });

    it('getRootAPIRoute() calls res.json()', () => {
        const res = {
            json: sinon.spy()
        };
        Controller.getRootAPIRoute(req, res);
        expect(res.json.calledOnce).to.be.true;
    });

    it('renderIndexPage() calls res.render() with "index"', () => {
        const res = {
            render: sinon.spy()
        };
        Controller.renderIndexPage(req, res);
        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('index')).to.be.true;
    });
});
