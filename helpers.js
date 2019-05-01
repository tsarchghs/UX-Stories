const { createError } = require("apollo-errors");

const CreateValidationError = (errors) => {
    return createError("ValidationError", {
        message: "Invalid arguments were provided.",
        data: {
            errors
        }
    })
}

const checkValidation = async (schema, args, throwErr = true, throwMessage=false) => {
    return await schema.validate(args, { abortEarly: false }).catch(err => {
        let ERROR = CreateValidationError(err.errors)
        if (throwMessage){
            throw new Error(throwMessage);
        } else if (throwErr) {
            throw new ERROR;
        } else {
            return err.errors
        }
    })
}

module.exports = {
    CreateValidationError,
    checkValidation
}