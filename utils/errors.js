class AppError extends Error{
    constructor(message, statusCode = 500){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError{
    constructor(details, message = "Validation Failed"){
        super(message, 400);
        this.details = details
        this.name = 'ValidationError'
    }
}

class DatabaseError extends AppError{
    constructor(message = "Database operation Failed"){
        super(message, 503);
        this.name = 'DatabaseError'
    }
}

class NotFoundError extends AppError{
    constructor(message = "Resource not found"){
        super(message, 404);
        this.name = 'NotFoundError'
    }
}

class AuthError extends AppError{
    constructor(message = "Authentication Failed"){
        super(message, 401);
        this.name = 'AuthError'
    }
}

class ForbiddenError extends AppError{
    constructor(message = "Forbidden"){
        super(message, 403);
        this.name = 'ForbiddenError'
    }
}


module.exports = {
    AppError,
    ValidationError,
    DatabaseError,
    NotFoundError,
    AuthError,
    ForbiddenError
}