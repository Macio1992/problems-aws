function validateCategory(requestBody) {
    const missingFields = [];

    const {
        CategoryName,
        IsRootCategory,
        CategoryParentId
    } = requestBody;

    if (!CategoryName) {
        missingFields.push('Category Name');
    }

    if (IsRootCategory === undefined) {
        missingFields.push('Is Root Category');
    }

    if (IsRootCategory === false && !CategoryParentId) {
        missingFields.push('Category Parent Id');
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

function validateProblem(requestBody) {
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
    validateCategory,
    validateProblem
};
