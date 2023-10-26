## Publishing

**We use the `xyz` NPM package to simplify releases. This library uses a feature that is available in Bash 4 or beyond, but latest versions of macOS
ship with an older version of Bash. If you run into issues with `xyz`, use `brew install bash` to install a newer verison of Bash.**

If you run into any `npm` package versioning issues, make sure you run `make setup` rather than calling `npm install` directly.

1. Create a branch to stage the release, for example `release-3.4.5` (Read [semver](https://semver.org/) to determine what type of version bump to use.)

```
git checkout -b release-3.4.5
git fetch
git reset --hard origin/master
```

2. Run `make storybook` and verify that there are no regressions with Link.

3. Update `CHANGELOG.md` with changes that will be included in the release, commit and push to the release branch. To help confirm the changes
that will be included in the release, consider using GitHub's compare feature: https://github.com/plaid/react-plaid-link/compare/v3.4.0...master
(replace `v3.4.0` with the last published version).

4. When ready, publish the new version from the branch before merging

```
make release-(patch|minor|major)
```

5. Merge the branch

#### **If the `make` command errors out with an authentication issue**

If `make release-*` from above errors out with an authentication issue,
you may need to `npm login` or otherwise manually set up your `~/.npmrc` file to
make sure you have access to publish to npm.

#### (dangerous) Manually publish an already-built package to npm

If you've set up your npm authentication as described above, but are still seeing authentication issues when running `make release-*`, you can 
directly publish a **built** package to the npm registry using the manual commands below. You should **only** publish the package manually using these steps
if the build steps of the `make release-*` command were **successful**. If the build steps did not succeeed, running these commands could publish an unbuilt
version of the package, which would lead to a broken release.

1. Publish already-built package to npm manually

```bash
npm --registry=https://registry.npmjs.com publish
```

2. Push tags manually

```bash
git push --follow-tags
```

Also, under [github releases page](https://github.com/plaid/react-plaid-link/releases), draft a new release corresponding to the tag of the latest version.
