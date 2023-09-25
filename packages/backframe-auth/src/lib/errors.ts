export function UserNotFound() {
  return {
    status: "error",
    code: "auth/no-user",
    message: "No such user was found",
  };
}

export function ProviderNotFound() {
  return {
    status: "error",
    code: "auth/no-provider",
    message: "The requested provider is not enabled on this server",
  };
}

export function InvalidCredentials() {
  return {
    status: "error",
    code: "auth/invalid-credentials",
    message: "Invalid login credentials",
  };
}

export function PasswordsDontMatch() {
  return {
    status: "error",
    code: "auth/no-match",
    message: "Password fields don't match",
  };
}

export function AccountExists(param: string) {
  return {
    status: "error",
    code: "auth/exists",
    message: `Account with provided ${param} already exists`,
  };
}

export function MissingRequiredAttribute(attr: string) {
  return {
    status: "error",
    code: "auth/missing-attribute",
    message: `Missing required attribute: ${attr}`,
  };
}
