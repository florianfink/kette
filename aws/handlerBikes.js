module.exports.getBikes = async (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify(event)
    }
    callback(null, response);
}