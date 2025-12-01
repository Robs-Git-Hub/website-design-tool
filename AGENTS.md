# Agent Documentation Index

Welcome AI coding agents! This file is the main entry point for understanding how to work with the Website Aesthetic Schema (WAS) project.

## Quick Start

1. **Read First**: `docs/06_project_management/HANDOVER.md` - Current project state and session context
2. **Understand Vision**: `docs/01_strategy_and_vision/01_project_vision.md` - Core philosophy and goals
3. **Check Tasks**: `docs/06_project_management/TASKS.md` - Current priorities and status

## Project Structure

```
website-design-tool/
├── docs/
│   ├── 01_strategy_and_vision/        # Vision, design decisions
│   ├── 02_system_definition/          # WAS layer definitions
│   ├── 03_architecture_and_decisions/ # Architecture decisions
│   ├── 04_api_reference/              # API reference documentation
│   ├── 05_guides_and_playbooks/       # Testing and coding guides (YOU ARE HERE)
│   └── 06_project_management/         # Plans, tasks, handover docs
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
- **Current State**: `docs/06_project_management/HANDOVER.md`
- **Architecture**: `docs/01_strategy_and_vision/01_project_vision.md`
- **Master Plan**: `docs/06_project_management/masterplan.md`
- **Testing Strategy**: `docs/05_guides_and_playbooks/testing/testing_overview.md`

### Development Guides
- **Coding Patterns**: `docs/05_guides_and_playbooks/coding_assistant_guides/` (explicit do's and don'ts)
- **Lessons Learned**: `docs/06_project_management/LESSONS_LEARNED.md` (avoid past mistakes)
- **API Reference**: `docs/04_api_reference/api_reference.md`

### Phase Documentation
- **Phase Plans**: `docs/06_project_management/phases/`
- **Current Phase**: Check HANDOVER.md for active phase

## Working Branch

Always check `HANDOVER.md` for the current working branch. Development typically happens on feature branches named `claude/*`.

## Testing

- **Validation**: `npm run validate-bundle <file>` (from tooling/)
- **Health Check**: `npm run health-check` (from tooling/)
- **API Testing**: See `docs/04_api_reference/api_reference.md`

## Common Patterns

See `docs/05_guides_and_playbooks/coding_assistant_guides/` for project-specific patterns:
- Git workflows
- ES modules handling
- Testing approaches
- Validation workflows

## Need More Context?

1. Check `docs/06_project_management/HANDOVER.md` first
2. Review relevant phase doc in `docs/06_project_management/phases/`
3. Consult `docs/06_project_management/LESSONS_LEARNED.md` to avoid known pitfalls
4. Read architecture docs in `docs/03_architecture_and_decisions/`

---

**For Claude Code specifically**, see `CLAUDE.md` for Claude-specific setup and workflows.
