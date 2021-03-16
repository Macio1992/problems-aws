'use strict';

const { getOne } = require('../../helpers/dynamo');

module.exports.getCategory = async (event, context, callback) => {
    const { id } = event.pathParameters;

    try {
        const { Item: response } = await getOne({
            TableName: process.env.CATEGORY_TABLE,
            Key: {
                CategoryId: id
            }
        });

        if (!response) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Category with id: ${id} has not been found`
                })
            });
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully retrieved category`,
                response
            })
        });
    } catch (err) {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify(err)
        });
    }
};

