# WAS Tooling

TypeScript validation and conversion utilities for the Website Aesthetic Schema (WAS).

## Setup

```bash
npm install
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in watch mode for development
- `npm run validate` - Validate a WAS bundle
- `npm run convert:toml-to-json` - Convert TOML to JSON
- `npm run convert:json-to-toml` - Convert JSON to TOML
- `npm test` - Run tests
- `npm run type-check` - Type check without emitting files

## Structure

```
src/
├── converters/       # TOML ↔ JSON conversion utilities
├── validators/       # Zod-based schema validation
├── utils/           # Shared utilities
└── index.ts         # Main entry point
```

## Usage

### Validating a Bundle

```typescript
import { validateBundle } from './validators/bundle_validator.js';

const result = await validateBundle('./path/to/bundle.json');
if (result.success) {
  console.log('Valid bundle:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}
```

### Converting TOML to JSON

```typescript
import { tomlToJson } from './converters/toml_to_json.js';

const json = await tomlToJson('./data/bundle.toml');
console.log(json);
```

## Dependencies

- **zod**: Runtime type validation
- **@iarna/toml**: TOML parsing and stringification
- **tsx**: TypeScript execution for development
- **vitest**: Testing framework
