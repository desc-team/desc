import config from '../config/config';

export const getRootAPIRoute = (req, res) => {
    res.json({
        name: config.name,
        version: config.version
    });
};

export const renderIndexPage = (req, res) => {
    res.render('index');
};
