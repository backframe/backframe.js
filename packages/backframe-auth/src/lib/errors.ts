export function UserNotFound() {
  return {
    status: "error",
    code: "auth/user-not-found",
    message: "No such user was found",
  };
}

export function ProviderNotFound() {
  return {
    status: "error",
    code: "auth/provider-not-found",
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
