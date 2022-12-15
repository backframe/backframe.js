import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  declaration: true,
  clean: true,
  rollup: {
    inlineDependencies: true,
  },
  entries: ["src/index"],
  externals: ["create-bf", "@backframe/utils", "@backframe/rest"],
});
