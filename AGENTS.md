# Agent Documentation Index

Welcome AI coding agents! This file is the main entry point for understanding how to work with the Website Aesthetic Schema (WAS) project.

## Quick Start

1. **Read First**: `docs/project-management/HANDOVER.md` - Current project state and session context
2. **Understand Vision**: `docs/architecture/design_note_vision.md` - Core philosophy and goals
3. **Check Tasks**: `docs/project-management/TASKS.md` - Current priorities and status

## Project Structure

```
website-design-tool/
├── docs/
│   ├── architecture/          # Vision, design decisions
│   ├── api/                   # API reference documentation
│   ├── testing/               # Testing strategy and validation
│   ├── coding_assistant_guides/ # Explicit patterns for AI agents (YOU ARE HERE)
│   ├── project-management/    # Plans, tasks, handover docs
│   └── to_be_sorted/          # Documents pending organization
├── data/                      # TOML instance data (L1-L4)
├── schema/                    # TOML schemas
├── tooling/                   # TypeScript validators, converters, generators
├── app/
│   ├── orchestrator-ui/       # React frontend
│   └── orchestrator-api/      # Express backend (deployed to Render)
└── examples/                  # Test inputs and bundles
```

## Key Documentation for Agents

### Getting Context
- **Current State**: `docs/project-management/HANDOVER.md`
- **Architecture**: `docs/architecture/design_note_vision.md`
- **Master Plan**: `docs/project-management/masterplan.md`
- **Testing Strategy**: `docs/testing/testing_overview.md` (when available)

### Development Guides
- **Coding Patterns**: `docs/coding_assistant_guides/` (explicit do's and don'ts)
- **Lessons Learned**: `docs/project-management/LESSONS_LEARNED.md` (avoid past mistakes)
- **API Reference**: `docs/api/api_reference.md`

### Phase Documentation
- **Phase Plans**: `docs/project-management/phases/`
- **Current Phase**: Check HANDOVER.md for active phase

## Working Branch

Always check `HANDOVER.md` for the current working branch. Development typically happens on feature branches named `claude/*`.

## Testing

- **Validation**: `npm run validate-bundle <file>` (from tooling/)
- **Health Check**: `npm run health-check` (from tooling/)
- **API Testing**: See `docs/api/api_reference.md`

## Common Patterns

See `docs/coding_assistant_guides/` for project-specific patterns:
- Git workflows
- ES modules handling
- Testing approaches
- Validation workflows

## Need More Context?

1. Check `docs/project-management/HANDOVER.md` first
2. Review relevant phase doc in `docs/project-management/phases/`
3. Consult `docs/project-management/LESSONS_LEARNED.md` to avoid known pitfalls
4. Read architecture docs in `docs/architecture/`

---

**For Claude Code specifically**, see `CLAUDE.md` for Claude-specific setup and workflows.
