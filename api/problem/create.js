'use strict';

const uuid = require('uuid');
const { validateProblem } = require('../../helpers/validate');
const { putOne } = require('../../helpers/dynamo');

module.exports.createProblem = async (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const {
        ProblemContent,
        ProblemSolution,
        ProblemType,
        ProblemCategory,
        ProblemSubCategory } = requestBody;

    try {
        validateProblem(requestBody);
    } catch (err) {
        callback(null, err);
        return;
    }

    const problem = {
        ProblemId: uuid.v1(),
        ProblemContent,
        ProblemSolution,
        ProblemType,
        ProblemCategory,
        ProblemSubCategory,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: null
    };

    try {
        const response = await putOne({
            TableName: process.env.PROBLEM_TABLE,
            Item: problem
        });
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully created new problem`,
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
