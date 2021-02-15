## Publishing

1. Create a branch to stage the release, for example `release-3.4.5` (Read [semver](https://semver.org/) to determine what type of version bump to use.)

```
git checkout -b release-3.4.5
git fetch
git reset --hard origin/master
```

2. Run `make storybook` and verify that there are no regressions with Link.

3. Update `CHANGELOG.md` with changes that will be included in the release, commit and push to the release branch.

4. When ready, publish the new version from the branch before merging

```
make release-(patch|minor|major)
```

5. Merge the branch
