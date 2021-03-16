'use strict';

const { scan } = require('../../helpers/dynamo');

module.exports.listProblems = async (event, context, callback) => {
    try {
        const { Items: response } = await scan({
            TableName: process.env.PROBLEM_TABLE,
            ProjectionExpression: "ProblemId, ProblemContent, ProblemSolution, ProblemType, ProblemCategory, ProblemSubCategory, CreatedAt, UpdatedAt"
        });

        if (!response.length) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Problems have not been found`
                })
            });
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully retrieved problems`,
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
