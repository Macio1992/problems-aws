'use strict';

const { scan } = require('../../helpers/dynamo');

module.exports.listCategories = async (event, context, callback) => {
    try {
        const { Items: response } = await scan({
            TableName: process.env.CATEGORY_TABLE,
            ProjectionExpression: "CategoryId, CategoryName, IsRootCategory, CategoryParentId, CreatedAt, UpdatedAt"
        });

        if (!response.length) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Categories have not been found`
                })
            });
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully retrieved categories`,
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
