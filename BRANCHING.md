# Branching Plan

This repo is now separated from the parent home directory Git repo and should be used as the single Git repository for Success Tunnel.

## Suggested branches
- `main` — stable production-ready baseline
- `section/home` — homepage and shared hero sections
- `section/services` — service hub pages and subpages
- `section/resources` — blog, downloads, calculators, FAQs
- `section/admin` — admin UI and lead management
- `section/seo` — metadata, sitemap, robots, structured data

## Workflow
1. Create a branch from `main` for the section you want to change.
2. Keep each section’s changes isolated to its own branch.
3. Merge only after local review and type-checking.
4. Use the home page only for cross-links or shared content.

## Example
- `git checkout -b section/services`
- make service-page edits
- `git checkout main`
- merge when ready
