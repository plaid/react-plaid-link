## Publishing

Releases are prepared on a branch and published by GitHub Actions from a tag on
`master`. The [Publish to npm](.github/workflows/publish.yml) workflow uses npm
trusted publishing, so no npm token is stored anywhere, and each release gets a
provenance attestation that links it to the workflow run and commit that built
it.

1. Create a release branch from the latest `master`.
2. Move the `Unreleased` changelog entries under the new version heading.
3. Update `package.json` without creating a tag:

   ```bash
   yarn version --new-version <version> --no-git-tag-version
   ```

4. Open and merge the release PR after CI passes.
5. Check out the updated `master` and confirm it matches `origin/master`.
6. Run:

   ```bash
   make release
   ```

   The release command runs lint, type checking, tests, and all builds, then
   creates and pushes the annotated `v<version>` tag.

7. The tag starts the Publish to npm workflow. Its build job checks that the tag
   matches `package.json`, `CHANGELOG.md`, and `master`, runs the same checks,
   and packs the package. Approve the publish job in the `npm-publish`
   environment to publish that tarball.

A prerelease such as `5.1.0-beta.1` is published under its prerelease tag
(`beta`). A stable version must be newer than the current `latest`.

If the publish job fails, rerun it from the workflow run. Don't push the tag
again.
