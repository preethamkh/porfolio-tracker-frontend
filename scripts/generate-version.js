/**
 * Generate build version dynamically
 * Combines package.json version with git commit count
 * Example: 1.0.0+build.123
 *
 * This runs during the build process (see vite.config.ts)
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getVersion() {
  try {
    // Read base version from package.json
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, "../package.json"), "utf-8"),
    );
    const baseVersion = packageJson.version;

    // Get git commit count (build number)
    let buildNumber = "dev";
    try {
      buildNumber = execSync("git rev-list --count HEAD", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "ignore"],
      }).trim();
    } catch (error) {
      // If git command fails (e.g., not a git repo), use timestamp
      buildNumber = Date.now().toString();
    }

    // Combine: 1.0.0+build.123
    return `${baseVersion}+build.${buildNumber}`;
  } catch (error) {
    console.error("Failed to generate version:", error);
    return "1.0.0+build.unknown";
  }
}

export default getVersion;

// Allow running as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(getVersion());
}
