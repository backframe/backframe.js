import { OAuthConfig, OAuthUserConfig } from "../lib/types";

export default function Credentials<P extends object>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "credentials",
    type: "credentials",
    name: "credentials",
    options,
  };
}
