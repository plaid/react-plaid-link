## Publishing

1. Run `make storybook` and verify that there are no regressions with Link.

2. Pull the changes from `master` into `release`

```
git fetch
git checkout release
# this makes sure that the release branch is using latest master
git reset --hard origin/master
# this should not require force push unless we are rolling back
git push origin release
```

3. Release from the `release` branch.

```
make release-(patch|minor|major)
```

Read [semver](https://semver.org/) to determine what type of version bump to use.
