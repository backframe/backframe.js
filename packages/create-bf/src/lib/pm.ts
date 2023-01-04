import { execa } from "execa";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import pm from "preferred-pm";
import pmRuns from "which-pm-runs";

export class PackageManager {
  name!: string;
  version!: string;

  constructor() {
    if (pmRuns()?.name) {
      this.name = pmRuns()!.name;
      this.version = pmRuns()!.version;
    } else {
      pm(process.cwd()).then((value) => {
        this.name = value!.name;
        this.version = value!.version;
      });
    }
    if (!this.name) this.name = "npm";
  }

  async install() {
    await execa(this.name, ["install"]);
  }

  async run(script: string) {
    await execa(this.name, ["run", script]);
  }

  async addDeps(deps: string[]) {
    await execa(this.name, ["add", ...deps]);
  }
}

export const pacman = new PackageManager();
