'use strict';

const { scan } = require('../../helpers/dynamo');

module.exports.listProblems = async (event, context, callback) => {
    try {
        const { Items: response } = await scan({
            TableName: process.env.PROBLEM_TABLE,
            ProjectionExpression: "ProblemId, ProblemContent, ProblemSolution, ProblemType, ProblemCategory, ProblemSubCategory, CreatedAt, UpdatedAt"
        });
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
