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
        message: `Unable to get problem table`
      })
    });
  }
};

module.exports.delete = async (event, context, callback) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: process.env.PROBLEM_TABLE,
    Key: {
      ProblemId: id
    }
  };

  try {
    const problem = await getProblem(params);

    console.log('PROBLEM ', problem);

    if (problem && Object.keys(problem).length === 0) {
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          message: `Problem ${id} not found`
        })
      });
    }

    const x = await deleteProblem(params);
    console.log('XXXX ', x);

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

module.exports.update = async (event, context, callback) => {
  const { id } = event.pathParameters;
  const requestBody = JSON.parse(event.body);

  const {
    ProblemContent,
    ProblemSolution,
    ProblemType,
    ProblemCategory,
    ProblemSubCategory } = requestBody;

  console.log('RB ', requestBody);

  // const problemToUpdate = {
  //   ProblemId: id,
  //   ProblemContent,
  //   ProblemSolution,
  //   ProblemType,
  //   ProblemCategory,
  //   ProblemSubCategory,
  //   UpdatedAt: new Date().toISOString()
  // };

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

async function deleteProblem(params) {
  return dynamoDb.delete(params).promise();
}

async function updateProblem(params) {
  return dynamoDb.update(params).promise();
}
