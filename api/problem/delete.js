'use strict';

const { getOne, deleteOne } = require('../../helpers/dynamo');

module.exports.deleteProblem = async (event, context, callback) => {
    const { id } = event.pathParameters;

    try {
        const problem = await getOne({
            TableName: process.env.PROBLEM_TABLE,
            Key: {
                ProblemId: id
            }
        });

        if (problem && Object.keys(problem).length === 0) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Problem ${id} has not been found`
                })
            });
        }

        const response = await deleteOne({
            TableName: process.env.PROBLEM_TABLE,
            Key: {
                ProblemId: id
            }
        });

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully removed problem ${id}`,
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
