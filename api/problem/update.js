'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { validate } = require('../../helpers/validate');

AWS.config.setPromisesDependency(require('bluebird'));

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
        validate(requestBody);
    } catch (err) {
        callback(null, err);
    }

    const problemToUpdate = {
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
    };

    try {
        const res = await updateProblem(problemToUpdate);
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Sucessfully updated problem`,
                response: res
            })
        });
    } catch (err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to update problem`
            })
        });
    }
};

async function updateProblem(params) {
    return dynamoDb.update(params).promise();
}
