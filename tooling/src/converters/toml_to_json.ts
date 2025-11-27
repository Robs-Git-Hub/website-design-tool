#!/usr/bin/env node
/**
 * TOML to JSON Converter
 *
 * Converts WAS bundle files from TOML format to JSON format.
 *
 * Usage:
 *   npx tsx src/converters/toml_to_json.ts <input.toml> [output.json]
 *   npm run convert:toml-to-json <input.toml> [output.json]
 *
 * If output file is not specified, prints JSON to stdout.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as TOML from '@iarna/toml';

function convertTomlToJson(tomlPath: string, jsonPath?: string): void {
  // Read TOML file
  if (!fs.existsSync(tomlPath)) {
    console.error(`❌ Error: Input file not found: ${tomlPath}`);
    process.exit(1);
  }

  const tomlContent = fs.readFileSync(tomlPath, 'utf-8');

  // Parse TOML
  let data: any;
  try {
    data = TOML.parse(tomlContent);
  } catch (error) {
    console.error('❌ Error parsing TOML:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Convert to JSON
  const jsonContent = JSON.stringify(data, null, 2);

  // Output
  if (jsonPath) {
    // Write to file
    try {
      fs.writeFileSync(jsonPath, jsonContent, 'utf-8');
      console.log(`✅ Converted TOML to JSON:`);
      console.log(`   Input:  ${tomlPath}`);
      console.log(`   Output: ${jsonPath}`);
    } catch (error) {
      console.error('❌ Error writing JSON file:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  } else {
    // Print to stdout
    console.log(jsonContent);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npx tsx src/converters/toml_to_json.ts <input.toml> [output.json]');
    console.error('\nExamples:');
    console.error('  # Convert and save to file');
    console.error('  npx tsx src/converters/toml_to_json.ts bundle.toml bundle.json');
    console.error('\n  # Convert and print to stdout');
    console.error('  npx tsx src/converters/toml_to_json.ts bundle.toml');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];

  convertTomlToJson(inputPath, outputPath);
}

main();
