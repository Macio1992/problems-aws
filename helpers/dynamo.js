const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.setPromisesDependency(require('bluebird'));

async function putOne(params){
    return dynamoDb.put(params).promise();
}

async function deleteOne(params) {
    return dynamoDb.delete(params).promise();
}

async function getOne(params) {
    return dynamoDb.get(params).promise();
}

async function scan(params){
    return dynamoDb.scan(params).promise();
}

async function updateOne(params) {
    return dynamoDb.update(params).promise();
}

module.exports = {
    putOne,
    deleteOne,
    getOne,
    scan,
    updateOne
};
