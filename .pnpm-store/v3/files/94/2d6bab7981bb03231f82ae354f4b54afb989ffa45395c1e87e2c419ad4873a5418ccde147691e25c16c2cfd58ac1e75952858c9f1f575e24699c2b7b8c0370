import { resolve, extname, basename, join, dirname } from 'pathe';
import fse from 'fs-extra';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream } from 'node:fs';
import { transform } from 'esbuild';
import jiti from 'jiti';

function copyFileWithStream(sourcePath, outPath) {
  const sourceStream = createReadStream(sourcePath);
  const outStream = createWriteStream(outPath);
  return new Promise((resolve, reject) => {
    pipeline(sourceStream, outStream, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

const DECLARATION_RE = /\.d\.[cm]?ts$/;
const CM_LETTER_RE = /(?<=\.)(c|m)(?=[jt]s$)/;
const jsLoader = async (input, { options }) => {
  if (![".ts", ".js", ".cjs", ".mjs"].includes(input.extension) || DECLARATION_RE.test(input.path)) {
    return;
  }
  const output = [];
  let contents = await input.getContents();
  if (options.declaration && !input.srcPath?.match(DECLARATION_RE)) {
    const cm = input.srcPath?.match(CM_LETTER_RE)?.[0] || "";
    const extension = `.d.${cm}ts`;
    output.push({
      contents,
      srcPath: input.srcPath,
      path: input.path,
      extension,
      declaration: true
    });
  }
  if (input.extension === ".ts") {
    contents = await transform(contents, { loader: "ts" }).then((r) => r.code);
  }
  const isCjs = options.format === "cjs";
  if (isCjs) {
    contents = jiti().transform({ source: contents, retainLines: false }).replace(/^exports.default = /gm, "module.exports = ");
  }
  output.push({
    contents,
    path: input.path,
    extension: options.ext ? `.${options.ext}` : isCjs ? ".js" : ".mjs"
  });
  return output;
};

const sassLoader$1 = async (input, { options }) => {
  if (![".sass", ".scss"].includes(input.extension)) {
    return;
  }
  const compileString = await import('sass').then((r) => r.compileString || r.default.compileString);
  const output = [];
  const contents = await input.getContents();
  output.push({
    contents: compileString(contents).css,
    path: input.path,
    extension: `.${options.ext || "css"}`
  });
  return output;
};

const vueLoader = async (input, context) => {
  if (input.extension !== ".vue") {
    return;
  }
  const output = [{
    path: input.path,
    contents: await input.getContents()
  }];
  let earlyReturn = true;
  for (const blockLoader of [sassLoader, scriptLoader]) {
    const result = await blockLoader({ ...input, getContents: () => output[0].contents }, context);
    if (!result) {
      continue;
    }
    earlyReturn = false;
    const [vueFile, ...files] = result;
    output[0] = vueFile;
    output.push(...files);
  }
  if (earlyReturn) {
    return;
  }
  return output;
};
const vueBlockLoader = (options) => async (input, { loadFile }) => {
  const contents = await input.getContents();
  const BLOCK_RE = new RegExp(`<${options.type}((\\s[^>\\s]*)*)>([\\S\\s.]*?)<\\/${options.type}>`);
  const [block, attributes = "", _, blockContents] = contents.match(BLOCK_RE) || [];
  if (!block || !blockContents) {
    return;
  }
  if (options.exclude?.some((re) => re.test(attributes))) {
    return;
  }
  const [, lang = options.outputLang] = attributes.match(/lang="([a-z]*)"/) || [];
  const extension = "." + lang;
  const files = await loadFile({
    getContents: () => blockContents,
    path: `${input.path}${extension}`,
    srcPath: `${input.srcPath}${extension}`,
    extension
  }) || [];
  const blockOutputFile = files.find((f) => f.extension === `.${options.outputLang}` || options.validExtensions?.includes(f.extension));
  if (!blockOutputFile) {
    return;
  }
  const newAttributes = attributes.replace(new RegExp(`\\s?lang="${lang}"`), "");
  return [
    {
      path: input.path,
      contents: contents.replace(block, `<${options.type}${newAttributes}>
${blockOutputFile.contents?.trim()}
</${options.type}>`)
    },
    ...files.filter((f) => f !== blockOutputFile)
  ];
};
const sassLoader = vueBlockLoader({
  outputLang: "css",
  type: "style"
});
const scriptLoader = vueBlockLoader({
  outputLang: "js",
  type: "script",
  exclude: [/\bsetup\b/],
  validExtensions: [".js", ".mjs"]
});

const defaultLoaders = [vueLoader, jsLoader, sassLoader$1];
function createLoader(loaderOptions = {}) {
  const loaders = loaderOptions.loaders || defaultLoaders;
  const loadFile = async function(input) {
    const context = {
      loadFile,
      options: loaderOptions
    };
    for (const loader of loaders) {
      const outputs = await loader(input, context);
      if (outputs?.length) {
        return outputs;
      }
    }
    return [
      {
        path: input.path,
        srcPath: input.srcPath,
        raw: true
      }
    ];
  };
  return {
    loadFile
  };
}

async function getDeclarations(vfs) {
  const ts = await import('typescript').then((r) => r.default || r);
  const inputFiles = [...vfs.keys()];
  const compilerOptions = {
    allowJs: true,
    declaration: true,
    incremental: true,
    skipLibCheck: true,
    strictNullChecks: true,
    emitDeclarationOnly: true
  };
  const tsHost = ts.createCompilerHost(compilerOptions);
  tsHost.writeFile = (fileName, declaration) => {
    vfs.set(fileName, declaration);
  };
  const _readFile = tsHost.readFile;
  tsHost.readFile = (filename) => {
    if (vfs.has(filename)) {
      return vfs.get(filename);
    }
    return _readFile(filename);
  };
  const program = ts.createProgram(inputFiles, compilerOptions, tsHost);
  await program.emit();
  const output = {};
  for (const filename of inputFiles) {
    const dtsFilename = filename.replace(/\.(m|c)?(ts|js)$/, ".d.$1ts");
    output[filename] = vfs.get(dtsFilename) || "";
  }
  return output;
}

async function mkdist(options = {}) {
  options.rootDir = resolve(process.cwd(), options.rootDir || ".");
  options.srcDir = resolve(options.rootDir, options.srcDir || "src");
  options.distDir = resolve(options.rootDir, options.distDir || "dist");
  if (options.cleanDist !== false) {
    await fse.unlink(options.distDir).catch(() => {
    });
    await fse.emptyDir(options.distDir);
    await fse.mkdirp(options.distDir);
  }
  const { globby } = await import('globby');
  const filePaths = await globby(options.pattern || "**", { absolute: false, cwd: options.srcDir });
  const files = filePaths.map((path) => {
    const sourcePath = resolve(options.srcDir, path);
    return {
      path,
      srcPath: sourcePath,
      extension: extname(path),
      getContents: () => fse.readFile(sourcePath, { encoding: "utf8" })
    };
  });
  const { loadFile } = createLoader({
    format: options.format,
    ext: options.ext,
    declaration: options.declaration
  });
  const outputs = [];
  for (const file of files) {
    outputs.push(...await loadFile(file) || []);
  }
  for (const output of outputs.filter((o) => o.extension)) {
    const renamed = basename(output.path, extname(output.path)) + output.extension;
    output.path = join(dirname(output.path), renamed);
    if (outputs.some((o) => o !== output && o.path === output.path)) {
      output.skip = true;
    }
  }
  const dtsOutputs = outputs.filter((o) => o.declaration && !o.skip);
  if (dtsOutputs.length > 0) {
    const declarations = await getDeclarations(new Map(dtsOutputs.map((o) => [o.srcPath, o.contents || ""])));
    for (const output of dtsOutputs) {
      output.contents = declarations[output.srcPath] || "";
    }
  }
  const outPaths = new Set(outputs.map((o) => o.path));
  const resolveId = (from, id = "", resolveExtensions) => {
    if (!id.startsWith(".")) {
      return id;
    }
    for (const extension of resolveExtensions) {
      if (outPaths.has(join(dirname(from), id + extension))) {
        return id + extension;
      }
    }
    return id;
  };
  const esmResolveExtensions = ["", "/index.mjs", "/index.js", ".mjs", ".ts"];
  for (const output of outputs.filter((o) => o.extension === ".mjs")) {
    output.contents = output.contents.replace(
      /(import|export)(.* from ["'])(.*)(["'])/g,
      (_, type, head, id, tail) => type + head + resolveId(output.path, id, esmResolveExtensions) + tail
    );
  }
  const cjsResolveExtensions = ["", "/index.cjs", ".cjs"];
  for (const output of outputs.filter((o) => o.extension === ".cjs")) {
    output.contents = output.contents.replace(
      /require\((["'])(.*)(["'])\)/g,
      (_, head, id, tail) => "require(" + head + resolveId(output.path, id, cjsResolveExtensions) + tail + ")"
    );
  }
  const writtenFiles = [];
  await Promise.all(outputs.filter((o) => !o.skip).map(async (output) => {
    const outFile = join(options.distDir, output.path);
    await fse.mkdirp(dirname(outFile));
    await (output.raw ? copyFileWithStream(output.srcPath, outFile) : fse.writeFile(outFile, output.contents, "utf8"));
    writtenFiles.push(outFile);
  }));
  return {
    writtenFiles
  };
}

export { mkdist as m };
