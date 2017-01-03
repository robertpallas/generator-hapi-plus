const _ = require('lodash');

module.exports = (request, reply, next) => {
    request.log(['debug', 'input'], _.pick(request, ['id', 'params', 'headers', 'info']));
    next(null, true);
};
