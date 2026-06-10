const { spawnSync } = require("node:child_process");
const { copyFileSync, existsSync } = require("node:fs");
const { dirname, join } = require("node:path");

function rebuildDmgNativeDependencies() {
  if (process.platform !== "darwin") return;

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
}

function prepareSquirrelVendor() {
  let vendorDir;

  try {
    vendorDir = join(
      dirname(require.resolve("electron-winstaller/package.json")),
      "vendor",
    );
  } catch {
    console.warn(
      "Skipping Squirrel vendor preparation: electron-winstaller is not installed.",
    );
    return;
  }

  const hostArch = process.arch === "arm64" ? "arm64" : "x64";
  const files = [
    [`7z-${hostArch}.exe`, "7z.exe"],
    [`7z-${hostArch}.dll`, "7z.dll"],
  ];

  for (const [sourceName, targetName] of files) {
    const source = join(vendorDir, sourceName);
    const target = join(vendorDir, targetName);

    if (!existsSync(source)) {
      throw new Error(
        `Missing electron-winstaller vendor file: ${source}. Reinstall dependencies and approve electron-winstaller build scripts.`,
      );
    }

    copyFileSync(source, target);
  }
}

rebuildDmgNativeDependencies();
prepareSquirrelVendor();
