'use strict';

const { updateOne } = require('../../helpers/dynamo');
const { validateCategory } = require('../../helpers/validate');

module.exports.updateCategory = async (event, context, callback) => {
    const { id } = event.pathParameters;
    const requestBody = JSON.parse(event.body);

    const {
        CategoryName,
        IsRootCategory,
        CategoryParentId } = requestBody;

    try {
        validateCategory(requestBody);
    } catch (err) {
        callback(null, err);
        return;
    }

    try {
        const response = await updateOne({
            TableName: process.env.CATEGORY_TABLE,
            Key: {
                CategoryId: id
            },
            UpdateExpression: "set #CategoryName = :CategoryName, #IsRootCategory = :IsRootCategory, #CategoryParentId = :CategoryParentId, #UpdatedAt = :UpdatedAt",
            ExpressionAttributeValues: {
                ":CategoryName": CategoryName,
                ":IsRootCategory": IsRootCategory,
                ":CategoryParentId": CategoryParentId,
                ":UpdatedAt": new Date().toISOString()
            },
            ExpressionAttributeNames: {
                '#CategoryName': 'CategoryName',
                '#IsRootCategory': 'IsRootCategory',
                '#CategoryParentId': 'CategoryParentId',
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
