'use strict';

const uuid = require('uuid');
const { validateCategory } = require('../../helpers/validate');
const { putOne } = require('../../helpers/dynamo');

module.exports.createCategory = async (event, context, callback) => {
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

    const category = {
        CategoryId: uuid.v1(),
        CategoryName,
        IsRootCategory,
        CategoryParentId,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: null
    };

    try {
        const response = await putOne({
            TableName: process.env.CATEGORY_TABLE,
            Item: category
        });
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully created new category`,
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
