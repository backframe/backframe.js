import type { AuthUser } from "@backframe/models";
import { OAuthConfig, OAuthUserConfig } from "../lib/types";

export default function Credentials<P extends AuthUser>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "credentials",
    type: "credentials",
    name: "credentials",
    options,
  };
}
