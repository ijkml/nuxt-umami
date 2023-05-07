#!/bin/bash

# Bump the version number, commit, tag and push to GitHub
bumpp --commit --push --tag

# Publish the new version to npm
npm publish --access public

# Read the new version number from package.json
version=$(node -p "require('./package.json').version")

# Add a dist-tag to the new version
npm dist-tag add nuxt-umami@$version next
