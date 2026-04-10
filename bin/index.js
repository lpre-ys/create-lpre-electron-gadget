#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.join(__dirname, "..", "template");

function toKebabCase(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTitleCase(input) {
  return input
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function ensureDirWritable(targetDir) {
  if (!fs.existsSync(targetDir)) {
    return;
  }
  const entries = fs.readdirSync(targetDir);
  if (entries.length > 0) {
    throw new Error(`Target directory is not empty: ${targetDir}`);
  }
}

function applyReplacements(targetDir, map) {
  const files = ["package.json", "README.md", "electron/main.js"];
  for (const relativeFile of files) {
    const filePath = path.join(targetDir, relativeFile);
    let content = fs.readFileSync(filePath, "utf8");
    for (const [key, value] of Object.entries(map)) {
      content = content.replaceAll(key, value);
    }
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function main() {
  const rawName = process.argv[2];
  if (!rawName) {
    console.error("Usage: create-lpre-electron-gadget <project-name>");
    process.exit(1);
  }

  const normalizedName = toKebabCase(rawName);
  if (!normalizedName) {
    console.error("Invalid project name.");
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), rawName);
  const productName = toTitleCase(normalizedName);
  const appId = `com.example.${normalizedName.replace(/-/g, "")}`;

  try {
    ensureDirWritable(targetDir);
    fs.cpSync(templateDir, targetDir, { recursive: true, errorOnExist: true });
    applyReplacements(targetDir, {
      "__APP_NAME__": normalizedName,
      "__PRODUCT_NAME__": productName,
      "__APP_ID__": appId
    });
  } catch (error) {
    console.error(`Failed to scaffold project: ${error.message}`);
    process.exit(1);
  }

  console.log(`\nCreated ${normalizedName} at ${targetDir}`);
  console.log("\nNext steps:");
  console.log(`  cd ${rawName}`);
  console.log("  npm install");
  console.log("  npm run dev");
}

main();
