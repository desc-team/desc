import indexController from '../IndexController';

const mockResponse = (): any => {
    const res: any = {};
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (): any => {
    const req: any = {};
    return req;
};

describe('IndexController unit tests', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        res = mockResponse();
        req = mockRequest();
    });

    it('homeRoute() calls res.json() with correct payload', () => {
        indexController.homeRoute(req, res);

        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                success: expect.any(Boolean),
                message: expect.any(String),
                url: expect.any(String)
            })
        );
    });

    it('apiRoute() calls res.json() with correct payload', () => {
        indexController.apiRoute(req, res);

        expect(res.json).toBeCalledWith(
            expect.objectContaining({
                success: expect.any(Boolean),
                name: expect.any(String),
                version: expect.any(String)
            })
        );
    });
});
