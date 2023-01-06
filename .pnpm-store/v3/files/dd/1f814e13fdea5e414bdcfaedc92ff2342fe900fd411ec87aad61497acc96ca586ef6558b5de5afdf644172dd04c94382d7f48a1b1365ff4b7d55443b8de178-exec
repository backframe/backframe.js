#!/usr/bin/env node
import mri from 'mri';
import { m as mkdist } from './shared/mkdist.08e478e6.mjs';
import 'pathe';
import 'fs-extra';
import 'node:stream';
import 'node:fs';
import 'esbuild';
import 'jiti';

async function main() {
  const arguments_ = mri(process.argv.splice(2));
  if (arguments_.help) {
    console.log("Usage: npx mkdist [rootDir] [--src=src] [--dist=dist] [--pattern=glob [--pattern=more-glob]] [--format=cjs|esm] [-d|--declaration] [--ext=mjs|js|ts]");
    process.exit(0);
  }
  const { writtenFiles } = await mkdist({
    rootDir: arguments_._[0],
    srcDir: arguments_.src,
    distDir: arguments_.dist,
    format: arguments_.format,
    pattern: arguments_.pattern,
    ext: arguments_.ext,
    declaration: Boolean(arguments_.declaration || arguments_.d)
  });
  console.log(writtenFiles.map((f) => `- ${f}`).join("\n"));
  process.exit(0);
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
