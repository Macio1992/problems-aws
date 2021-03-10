'use strict';

const { updateOne } = require('../../helpers/dynamo');
const { validateProblem } = require('../../helpers/validate');

module.exports.updateProblem = async (event, context, callback) => {
    const { id } = event.pathParameters;
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

    try {
        const response = await updateOne({
            TableName: process.env.PROBLEM_TABLE,
            Key: {
                ProblemId: id
            },
            UpdateExpression: "set #ProblemContent = :ProblemContent, #ProblemSolution = :ProblemSolution, #ProblemType = :ProblemType, #ProblemCategory = :ProblemCategory, #ProblemSubCategory = :ProblemSubCategory, #UpdatedAt = :UpdatedAt",
            ExpressionAttributeValues: {
                ":ProblemContent": ProblemContent,
                ":ProblemSolution": ProblemSolution,
                ":ProblemType": ProblemType,
                ":ProblemCategory": ProblemCategory,
                ":ProblemSubCategory": ProblemSubCategory,
                ":UpdatedAt": new Date().toISOString()
            },
            ExpressionAttributeNames: {
                '#ProblemContent': 'ProblemContent',
                '#ProblemSolution': 'ProblemSolution',
                '#ProblemType': 'ProblemType',
                '#ProblemCategory': 'ProblemCategory',
                '#ProblemSubCategory': 'ProblemSubCategory',
                '#UpdatedAt': 'UpdatedAt'
            },
            ReturnValues: 'ALL_NEW'
        });
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Sucessfully updated problem`,
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
