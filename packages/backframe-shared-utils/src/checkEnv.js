const {execSync} = require("child_process");
const semver = require("semver");

let _hasYarn;
let _hasGit;
let _hasPnpm;
let _pnpmVersion;

exports.hasYarn = () => {
  try {
    execSync("yarn --version", {stdio: "ignore"});
    return (_hasYarn = true);
  } catch (e) {
    return (_hasYarn = false);
  }
};

exports.hasGit = () => {
  try {
    execSync("git --version", {stdio: "ignore"});
    return (_hasGit = true);
  } catch (e) {
    return (_hasGit = false);
  }
};

function getPnpmVersion() {
  try {
    _pnpmVersion = execSync("pnpm --version", {
      stdio: ["pipe", "pipe", "ignore"],
    }).toString();
    _hasPnpm = true;
  } catch (e) {}
  return _pnpmVersion || "0.0.0";
}

exports.hasPnpmVersionOrLater = version => {
  return semver.gte(getPnpmVersion(), version);
};

exports.hasPnpm3OrLater = () => {
  return this.hasPnpmVersionOrLater("3.0.0");
};
