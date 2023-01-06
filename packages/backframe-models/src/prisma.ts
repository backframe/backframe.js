/* eslint-disable @typescript-eslint/no-explicit-any */
import sdk from "@prisma/sdk";
import path from "path";
const { getDMMF } = sdk;

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export const DMMF: any = await getDMMF({
  datamodelPath: path.join(process.cwd(), "../database/prisma/schema.prisma"),
});
