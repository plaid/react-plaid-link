## Publishing

Releases are prepared on a branch and published from the merge commit on
`master`.

1. Create a release branch from the latest `master`.
2. Move the `Unreleased` changelog entries under the new version heading.
3. Update `package.json` without creating a tag:

   ```bash
   yarn version --new-version <version> --no-git-tag-version
   ```

4. Open and merge the release PR after CI passes.
5. Check out the updated `master`, confirm it matches `origin/master`, and
   authenticate with npm.
6. Run:

   ```bash
   make release
   ```

The release command runs lint, type checking, tests, and all builds before
publishing. It publishes the version already recorded in `package.json`, then
creates and pushes the annotated `v<version>` tag.

If npm publication succeeds but tagging fails, rerun `make release`. The
release script detects the published npm version and resumes with the missing
tag instead of attempting to republish.
