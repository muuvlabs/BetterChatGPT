import fs from 'fs';
import semver from 'semver';
import packageJson from './package.json' assert { type: 'json' };
import versionJson from './version.json' assert { type: 'json' };
//const packageJson = await import("./package.json", { assert: { type: "json" } });
//const versionJson = await import("./version.json", { assert: { type: "json" } });

let newVersion;

// Check if base versions differ or not
if (!semver.eq(semver.coerce(packageJson.version), semver.coerce(versionJson.version))) {
    // Base versions differ, reset prerelease to '-1'
    versionJson.version = packageJson.version;
}

newVersion = semver.inc(versionJson.version, 'prerelease');

// Update version.json content with new version
fs.writeFileSync('./version.json', JSON.stringify({ version: newVersion }, null, 2), 'utf-8');

console.log(`Updated version.json to ${newVersion}`);
