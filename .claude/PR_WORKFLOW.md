# Pull Request Workflow

## When Rob Asks for a PR

Follow this workflow:

### Step 1: Create PR Description File
Write a comprehensive PR description to `PR_DESCRIPTION.md` in the repo root with:
- Summary of changes
- Motivation/context
- Detailed changes organized by category
- Testing notes
- Benefits
- Migration notes (if applicable)
- Related tasks
- Commit list

### Step 2: Provide Command to Rob
Give Rob this command to copy and paste (he will run it locally):

```bash
gh pr create --web --title "YOUR_PR_TITLE_HERE" --body-file PR_DESCRIPTION.md
```

**Important:** Rob must be on the feature branch before running this command. If he's on `main`, he should:
```bash
git checkout claude/setup-working-branch-01SgAVrYSLoN8iGK1zuc8qLj
```

### Step 3: Rob Runs Command Locally
- Rob copies the command
- Runs it in his terminal (outside Claude Code)
- His browser opens with PR fields pre-populated
- He clicks "Create Pull Request"

## Why This Workflow

- Claude Code doesn't have permission to run `gh pr create` commands
- Running it locally works perfectly
- The `--web` flag opens browser with pre-populated fields
- The `--body-file` flag reads from PR_DESCRIPTION.md
- This gives Rob full control while automating the tedious parts

## Example

```bash
# Rob is on main branch after pulling changes
git checkout claude/setup-working-branch-01SgAVrYSLoN8iGK1zuc8qLj

# Rob runs the command Claude provided
gh pr create --web --title "Remove duplicate registry files - simplify to single source of truth" --body-file PR_DESCRIPTION.md

# Browser opens, fields are filled, Rob clicks "Create Pull Request"
```

## Notes

- Always commit and push PR_DESCRIPTION.md before Rob runs the command
- The feature branch must exist on remote
- Rob must have GitHub CLI (`gh`) installed and authenticated
- The `--web` flag requires both `--title` and `--body` (or `--body-file`) to work
