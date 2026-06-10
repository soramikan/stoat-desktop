const { spawnSync } = require("node:child_process");
const { dirname, join } = require("node:path");

if (process.platform !== "darwin") {
  process.exit(0);
}

const nativeModules = ["macos-alias", "fs-xattr"];
const nodeGyp = join(process.cwd(), "node_modules", ".bin", "node-gyp");

for (const moduleName of nativeModules) {
  let moduleDir;

  try {
    moduleDir = dirname(require.resolve(`${moduleName}/package.json`));
  } catch {
    console.warn(
      `Skipping DMG native rebuild: ${moduleName} is not installed.`,
    );
    continue;
  }

  const result = spawnSync(nodeGyp, ["rebuild"], {
    cwd: moduleDir,
    encoding: "utf8",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    process.exit(result.status ?? 1);
  }
}
