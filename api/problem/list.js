'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.setPromisesDependency(require('bluebird'));

module.exports.listProblems = async (event, context, callback) => {
    try {
        const data = await scanProblemTable();
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                problems: data.Items
            })
        });
    } catch (err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to list problems table`
            })
        });
    }
};

async function scanProblemTable(){
    const params = {
        TableName: process.env.PROBLEM_TABLE,
        ProjectionExpression: "ProblemId, ProblemContent, ProblemSolution, ProblemType, ProblemCategory, ProblemSubCategory, CreatedAt, UpdatedAt"
    };

    return dynamoDb.scan(params).promise();
}
