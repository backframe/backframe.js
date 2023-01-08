import { BaseClient } from "openid-client";

interface State {
  code_verifier: string | undefined;
  client: BaseClient;
}

export function authState(verifier?: string, client?: BaseClient): State {
  if ((globalThis as { __authState?: State }).__authState) {
    return (globalThis as { __authState?: State }).__authState;
  }

  const state: State = {
    code_verifier: verifier,
    client: client,
  };

  (globalThis as { __authState?: State }).__authState = state;

  return state;
}
