'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.setPromisesDependency(require('bluebird'));

module.exports.deleteProblem = async (event, context, callback) => {
    const { id } = event.pathParameters;
    const params = {
        TableName: process.env.PROBLEM_TABLE,
        Key: {
            ProblemId: id
        }
    };

    try {
        const problem = await getProblem(params);

        if (problem && Object.keys(problem).length === 0) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Problem ${id} not found`
                })
            });
        }

        await deleteProblem(params);

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully removed problem ${id}`
            })
        };

        callback(null, response);
    } catch (err) {
        console.error('ERROR ', err);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to delete problem`
            })
        });
    }
};

async function deleteProblem(params) {
    return dynamoDb.delete(params).promise();
}

async function getProblem(params) {
    return dynamoDb.get(params).promise();
}
