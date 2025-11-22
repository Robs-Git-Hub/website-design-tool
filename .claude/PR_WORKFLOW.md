# Pull Request Workflow

## The Simple Workflow

When Rob asks for a PR, the process is:

1. **Claude**: Makes commits with clear, descriptive commit messages
2. **Claude**: Pushes commits to the feature branch
3. **Rob**: Clicks "View PR" in GitHub UI and reviews/merges

That's it.

## Important: Write Good Commit Messages

Since the PR is created from commit messages, Claude must write clear, descriptive commits that:

- Explain what changed
- Explain why it changed (if not obvious)
- Use conventional commit format when appropriate (feat:, fix:, docs:, refactor:, etc.)
- Are detailed enough that Rob understands the changes without additional context

## Example Commit Messages

**Good:**
```
docs: update PR workflow to reflect simplified process

The PR workflow documentation previously described a complex process involving
PR_DESCRIPTION.md files and manual gh commands. The actual workflow is much
simpler - Rob just clicks "View PR" in the GitHub UI after commits are pushed.

Updated .claude/PR_WORKFLOW.md to reflect this simplified approach.
```

**Also Good (shorter):**
```
refactor: remove duplicate registry files and simplify to single source of truth

Deleted /registries directory and updated generator to extract from instance
files only. Updated all documentation to clarify instances are canonical source.
Reduces maintenance burden and eliminates drift risk.
```

**Not Good (too vague):**
```
update docs
```

## What Rob Does NOT Need to Do

- ❌ Switch branches
- ❌ Run `gh pr create` commands
- ❌ Pull my feature branch
- ❌ Create PR_DESCRIPTION.md files

## After PR is Merged

Rob will typically:
```bash
git pull origin main
```

To sync his local main with the merged changes.

## Notes

- GitHub automatically detects pushed branches and offers PR creation in the UI
- Rob can review the full diff and commit history before merging
- This workflow keeps Rob on `main` branch and avoids confusion
- Focus on commit message quality - they become the PR description
