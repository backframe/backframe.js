export class GenericException extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public description: string
  ) {
    super(message);
  }

  toJSON() {
    const { description, statusCode, message } = this;
    return {
      statusCode,
      message,
      description,
    };
  }
}

export function NotFoundExeption(
  msg = "Not found",
  body = "The requested resource was not found"
) {
  return new GenericException(404, msg, body);
}

export function ForbiddenException(
  msg = "Forbidden",
  body = "The requested action is forbidden"
) {
  return new GenericException(403, msg, body);
}

export function UnauthorizedException(
  msg = "Unauthorized",
  body = "You must be authenticated to perfom this action"
) {
  return new GenericException(401, msg, body);
}

export function InternalException(
  msg = "Internal Error",
  body = "An internal server error occured. Please try again later"
) {
  return new GenericException(500, msg, body);
}

export function MethodNotAllowed(
  msg = "Method Not Allowed",
  body = "This method is not allowed on this resource"
) {
  return new GenericException(405, msg, body);
}
