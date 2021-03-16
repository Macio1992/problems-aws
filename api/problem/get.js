'use strict';

const { getOne } = require('../../helpers/dynamo');

module.exports.getProblem = async (event, context, callback) => {
    const { id } = event.pathParameters;

    try {
        const { Item: response } = await getOne({
            TableName: process.env.PROBLEM_TABLE,
            Key: {
                ProblemId: id
            }
        });

        if (!response) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Problem with id: ${id} has not been found`
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
