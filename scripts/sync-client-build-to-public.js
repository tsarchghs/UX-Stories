const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const clientBuildDir = path.join(projectRoot, "client", "build");
const publicDir = path.join(projectRoot, "public");

if (!fs.existsSync(clientBuildDir)) {
  throw new Error(`Client build directory not found: ${clientBuildDir}`);
}

fs.cpSync(clientBuildDir, publicDir, {
  force: true,
  recursive: true
});

console.log(`Copied ${clientBuildDir} -> ${publicDir}`);
