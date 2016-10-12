const errorResponse = (request, reply, next) => {
    if(request.response && request.response.isBoom && request.response.output
        && request.response.output.payload && request.response.data) {
        // error message Boom object with additional data sent
        // this is the second [data] param sent to Boom now sent to client in payload
        // can be string or object
        // reply(Boom.locked('No access', {thisIsData: true}));
        request.response.output.payload.data = request.response.data;
    }

    next(null, true);
};

errorResponse.applyPoint = 'onPreResponse';

module.exports = errorResponse;
