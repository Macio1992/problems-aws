'use strict';

const { getOne, deleteOne } = require('../../helpers/dynamo');

module.exports.deleteCategory = async (event, context, callback) => {
    const { id } = event.pathParameters;

    try {
        const category = await getOne({
            TableName: process.env.CATEGORY_TABLE,
            Key: {
                CategoryId: id
            }
        });

        if (category && Object.keys(category).length === 0) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Category ${id} has not been found`
                })
            });
        }

        const response = await deleteOne({
            TableName: process.env.CATEGORY_TABLE,
            Key: {
                CategoryId: id
            }
        });

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully removed category ${id}`,
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
