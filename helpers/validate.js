function validate(requestBody) {
    const missingFields = [];

    const {
        ProblemContent,
        ProblemSolution,
        ProblemType,
        ProblemCategory,
        ProblemSubCategory } = requestBody;

    if (!ProblemContent) {
        missingFields.push('Problem Content');
    }

    if (!ProblemSolution) {
        missingFields.push('Problem Solution');
    }

    if (!ProblemType) {
        missingFields.push('Problem Type');
    }

    if (!ProblemCategory) {
        missingFields.push('Problem Category');
    }

    if (!ProblemSubCategory) {
        missingFields.push('Problem Subcategory');
    }

    if (missingFields.length) {
        throw {
            statusCode: 400,
            body: JSON.stringify({
                message: `${missingFields.toString()} fields are required`
            })
        };
    }
}

module.exports = {
    validate
};
