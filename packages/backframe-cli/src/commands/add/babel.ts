import generator from "@babel/generator";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

// @ts-expect-error @babel/traverse isn't ESM and needs this trick
export const visit = traverse.default as typeof traverse;
export { t };

export async function generate(ast: t.File) {
  // @ts-expect-error @babel/generator isn't ESM and needs this trick
  const astToText = generator.default as typeof generator;
  const { code } = astToText(ast);
  return code;
}

export const parse = (code: string) =>
  parser.parse(code, { sourceType: "unambiguous", plugins: ["typescript"] });

export function ensureImport(
  root: t.File,
  importDeclaration: t.ImportDeclaration
) {
  const specifiersToFind = [...importDeclaration.specifiers];

  visit(root, {
    ImportDeclaration(path) {
      if (path.node.source.value === importDeclaration.source.value) {
        path.node.specifiers.forEach((specifier) =>
          specifiersToFind.forEach((specifierToFind, i) => {
            if (specifier.type !== specifierToFind.type) return;
            if (specifier.local.name === specifierToFind.local.name) {
              specifiersToFind.splice(i, 1);
            }
          })
        );
      }
    },
  });

  if (specifiersToFind.length === 0) return;

  visit(root, {
    Program(path) {
      const declaration = t.importDeclaration(
        specifiersToFind,
        importDeclaration.source
      );
      const latestImport = path
        .get("body")
        .filter((statement) => statement.isImportDeclaration())
        .pop();

      if (latestImport) {
        // insert after the last import and add a newline
        latestImport.insertAfter([declaration, t.emptyStatement()]);
      } else path.unshiftContainer("body", declaration);
    },
  });
}
