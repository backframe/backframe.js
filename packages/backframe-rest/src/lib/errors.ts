export class GenericException {
  constructor(
    private statusCode: number,
    private message: string,
    private description: string
  ) {}

  getValues() {
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

export function UnathorizedException(
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