'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createProblem = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const {
    ProblemContent,
    ProblemSolution,
    ProblemType,
    ProblemCategory,
    ProblemSubCategory } = requestBody;

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

module.exports.list = async (event, context, callback) => {
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

module.exports.get = async (event, context, callback) => {
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
        message: `Unable to list problems table`
      })
    });
  }
};

const submitProblem = async candidate => {
  const candidateInfo = {
    TableName: process.env.PROBLEM_TABLE,
    Item: candidate,
  };

  return dynamoDb.put(candidateInfo).promise();
};

const scanProblemTable = async () => {
  const params = {
    TableName: process.env.PROBLEM_TABLE,
    ProjectionExpression: "ProblemId, ProblemContent, ProblemCategory"
  };

  return dynamoDb.scan(params).promise();
}

const getProblem = async params => {
  return dynamoDb.get(params).promise();
}