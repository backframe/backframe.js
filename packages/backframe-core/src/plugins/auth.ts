/* eslint-disable @typescript-eslint/no-explicit-any */

export type AuthPluginConfig = {
  middleware?: (
    ctx: any,
    cfg: {
      resourceRoles: string[];
      currentActions: string[];
      currentResources: string[];
    }
  ) => Promise<
    | void
    | (object & {
        statusCode: number;
        headers: {
          [key: string]: string | number | string[];
        };
      })
  >;
  evaluatePolicies?: (
    ctx: any,
    {
      data,
      roles,
      status,
      attemptedActions,
      attemptedResources,
    }: {
      roles: string[];
      status: "before" | "after";
      attemptedActions?: string[];
      attemptedResources?: string[];
      data?: unknown;
    }
  ) => Promise<boolean>;
};
