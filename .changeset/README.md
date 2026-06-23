# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets).

To record a change for the next release, run:

```bash
pnpm changeset
```

Pick the affected packages and a bump type (patch / minor / major) and describe the change. The
generated markdown file is committed alongside your code. On merge to `main`, the Release workflow
opens a "Version Packages" PR; merging that PR publishes the bumped packages to npm.

`@prediction-kit/core` and `@prediction-kit/react` are versioned together (a `fixed` group), so they
always share a version number.
