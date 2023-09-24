/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context } from "@backframe/rest";
import { logger, require } from "@backframe/utils";
import fs from "fs";
import os from "os";
import path from "path";

export async function evaluatePolicies(
  ctx: Context<any>,
  {
    data,
    roles = [],
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
) {
  const userRoles = ctx.auth.roles ?? roles;
  logger.dev(`auth: evaluating policies: ${status}`);

  const settings = ctx.config.$settings.auth;
  const permissions = userRoles.flatMap(
    (role) =>
      settings.userRolesConfiguration?.roles?.find((r) => r.name === role)
        ?.permissions
  );

  const policies = permissions.filter((p) => {
    if (
      !(
        p.resources.includes("*") ||
        attemptedResources?.some((r) => p.resources?.includes(r))
      )
    )
      return false;

    if (
      !(
        p.actions.includes("*") ||
        attemptedActions?.some((a) => p.actions?.includes(a))
      )
    )
      return false;

    return true;
  });

  const allowed: { actions: string[]; resources: string[] }[] = [];
  const denied: { actions: string[]; resources: string[] }[] = [];

  if (policies.length === 0) return true;

  for (const p of policies) {
    const values = await Promise.all(
      p.conditions?.map(async (condition, idx) => {
        const expr = condition.expression;
        const run = condition.run;

        if (status === run || run === "beforeAndAfter") {
          // write to a temp file
          const temp = path.join(os.tmpdir(), `bf-auth-temp-${idx}.js`);
          fs.writeFileSync(temp, expr);
          logger.dev(`auth: evaluating policy: ${p.id || p.name}`);
          logger.dev(`auth: temp file: ${temp}`);

          // require the temp file
          const module = require(temp);
          const fn = module.default || module;
          if (!fn) {
            logger.warn(
              `auth: invalid expression of policy: ${p.id || p.name}`
            );
          }

          const res = await fn(ctx, {
            data,
            status,
            allow: () => true,
            deny: () => false,
          });
          logger.dev(`auth: expr result: ${res}`);

          // delete the temp file
          fs.unlinkSync(temp);

          return res;
        }

        return true;
      })
    );

    if (values.every((v) => v === true)) {
      if (p.effect === "DENY") {
        denied.push({
          actions: p.actions,
          resources: p.resources,
        });
      } else if (p.effect === "ALLOW") {
        allowed.push({
          actions: p.actions,
          resources: p.resources,
        });
      }
    }
  }

  for (const deniedPolicy of denied) {
    const deniedActions = deniedPolicy.actions;
    const deniedResources = deniedPolicy.resources;

    const actionDenied =
      deniedActions?.some((a) => attemptedActions?.includes(a)) ||
      deniedActions?.includes("*");

    const resourceDenied =
      deniedResources?.some((r) => attemptedResources?.includes(r)) ||
      deniedResources?.includes("*");

    // any attempted action/resource is denied
    if (actionDenied && resourceDenied) {
      return false;
    }
  }

  for (const allowedPolicy of allowed) {
    const allowedActions = allowedPolicy.actions;
    const allowedResources = allowedPolicy.resources;

    const actionAllowed =
      attemptedActions?.every((a) => allowedActions?.includes(a)) ||
      allowedActions?.includes("*");

    const resourceAllowed =
      attemptedResources?.every((r) => allowedResources?.includes(r)) ||
      allowedResources?.includes("*");

    // all attempted actions/resources are allowed
    if (actionAllowed && resourceAllowed) {
      return true;
    }
  }

  return false;
}
