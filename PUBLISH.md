## Publishing

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

#### **Manually publish to NPM**

If `make release-*` from above errors out with an authentication issue,
you may need to `npm login` or otherwise manually set up your `~/.npmrc` file to
make sure you have access to publish to npm.

Once you have done that, the following command will publish the latest version
(already bumped and pushed in step 4) to the NPM registry:

1. Publish to npm manually

```bash
npm --registry=https://registry.npmjs.com publish
```

2. Push tags manually

```bash
git push --follow-tags
```

Also, under [github releases page](https://github.com/plaid/react-plaid-link/releases), draft a new release corresponding to the tag of the latest version.
