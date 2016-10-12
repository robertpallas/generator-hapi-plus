module.exports = (decoded, request, callback) => {
    if(!decoded.id) {
        callback(null, false);
    } else {
        callback(null, true);
    }
};
