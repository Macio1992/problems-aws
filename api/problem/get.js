'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.setPromisesDependency(require('bluebird'));

module.exports.getProblem = async (event, context, callback) => {
    const { id } = event.pathParameters;
    const params = {
        TableName: process.env.PROBLEM_TABLE,
        Key: {
            ProblemId: id
        }
    };

    try {
        const problem = await getProblem(params);
        const response = {
            statusCode: 200,
            body: JSON.stringify(problem.Item),
        };
        callback(null, response);
    } catch (err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to get problem table`
            })
        });
    }
};

async function getProblem(params) {
    return dynamoDb.get(params).promise();
}
