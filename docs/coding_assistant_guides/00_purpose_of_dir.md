# Coding Assistant Guides - Purpose

## Purpose of This Directory

This directory contains **tight, explicit instructions** for AI coding agents working on the Website Aesthetic Schema (WAS) project.

Unlike other documentation which provides context, background, and rationale, these guides are:

- **Prescriptive**: Clear do's and don'ts
- **Action-oriented**: Direct instructions for specific scenarios
- **Pattern-based**: Concrete examples of good and bad patterns
- **Project-specific**: Tailored to WAS codebase conventions

## Target Audience

AI coding agents (Claude Code, GitHub Copilot, etc.) and human developers who need quick, authoritative guidance on project-specific conventions.

## What Belongs Here

- **Good/Bad Code Patterns**: ES modules vs CommonJS, git workflows, structured logging patterns
- **Project Conventions**: TOML formatting rules, file naming, directory structure
- **Common Pitfalls**: Issues documented in LESSONS_LEARNED.md translated to explicit rules
- **Workflow Instructions**: Step-by-step procedures for commits, deployments, testing

## What Does NOT Belong Here

- **Conceptual Documentation**: Vision, architecture decisions → `docs/architecture/`
- **API References**: Endpoint specs → `docs/api/`
- **Project Planning**: Phases, tasks → `docs/project-management/`
- **Testing Strategy**: High-level test plans → `docs/testing/`

## Format

Each guide should be:
1. **Concise**: One topic per file
2. **Scannable**: Use headings, lists, code blocks
3. **Executable**: Provide exact commands and code examples
4. **Versioned**: Update as patterns evolve

## Example Files (Future)

- `git_workflow.md` - Exact git commands for commits, branches, pushes
- `es_modules_patterns.md` - How to handle __dirname, imports, require
- `testing_patterns.md` - How to write tests in this project
- `api_testing.md` - How to test with curl, handle cold starts
- `validation_workflow.md` - When and how to use bundle validator

---

**Last Updated:** 2025-11-28
