#!/usr/bin/env node
/**
 * JSON to TOML Converter
 *
 * Converts WAS bundle files from JSON format to TOML format.
 *
 * Usage:
 *   npx tsx src/converters/json_to_toml.ts <input.json> [output.toml]
 *   npm run convert:json-to-toml <input.json> [output.toml]
 *
 * If output file is not specified, prints TOML to stdout.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as TOML from '@iarna/toml';

function convertJsonToToml(jsonPath: string, tomlPath?: string): void {
  // Read JSON file
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: Input file not found: ${jsonPath}`);
    process.exit(1);
  }

  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');

  // Parse JSON
  let data: any;
  try {
    data = JSON.parse(jsonContent);
  } catch (error) {
    console.error('❌ Error parsing JSON:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Convert to TOML
  let tomlContent: string;
  try {
    tomlContent = TOML.stringify(data as TOML.JsonMap);
  } catch (error) {
    console.error('❌ Error converting to TOML:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  // Output
  if (tomlPath) {
    // Write to file
    try {
      fs.writeFileSync(tomlPath, tomlContent, 'utf-8');
      console.log(`✅ Converted JSON to TOML:`);
      console.log(`   Input:  ${jsonPath}`);
      console.log(`   Output: ${tomlPath}`);
    } catch (error) {
      console.error('❌ Error writing TOML file:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  } else {
    // Print to stdout
    console.log(tomlContent);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npx tsx src/converters/json_to_toml.ts <input.json> [output.toml]');
    console.error('\nExamples:');
    console.error('  # Convert and save to file');
    console.error('  npx tsx src/converters/json_to_toml.ts bundle.json bundle.toml');
    console.error('\n  # Convert and print to stdout');
    console.error('  npx tsx src/converters/json_to_toml.ts bundle.json');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1];

  convertJsonToToml(inputPath, outputPath);
}

main();
