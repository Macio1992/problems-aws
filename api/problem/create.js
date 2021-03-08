'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { validate } = require('../../helpers/validate');

AWS.config.setPromisesDependency(require('bluebird'));

module.exports.createProblem = async (event, context, callback) => {
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

    const problemToSubmit = {
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
        const res = await submitProblem(problemToSubmit)
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Sucessfully submitted problem`,
                ProblemId: res.ProblemId
            })
        });
    } catch (err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to submit problem`
            })
        });
    }
};

async function submitProblem(candidate){
    const candidateInfo = {
        TableName: process.env.PROBLEM_TABLE,
        Item: candidate,
    };

    return dynamoDb.put(candidateInfo).promise();
}
