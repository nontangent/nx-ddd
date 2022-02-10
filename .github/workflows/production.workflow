name: Production
on:
  push:
    branches:
      - main
jobs:
  build:
    name: Build
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      # - uses: actions/setup-node@v2
      #   with:
      #     node-version: 16.x
          # cache: npm
      # - run: npm i
      # - run: npx nx build firestore --with-deps
      # - name: Archive production artifacts
      #   uses: actions/upload-artifact@v2
      #   with:
      #     name: dist
      #     path: dist
#   release:
#     name: Release
#     runs-on: ubuntu-18.04
#     needs: build
#     outputs:
#       is_released: ${{ steps.result.outputs.is_released }}
#     steps:
#       - uses: actions/checkout@v2
#       - uses: actions/setup-node@v2
#         with:
#           node-version: 16.x
#           cache: npm
#       - name: Install node packages
#         run: npm i
#       - name: Download production artifacts
#         uses: actions/download-artifact@v2
#       - env:
#           GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
#         run: npx semantic-release
#       - id: result
#         run: echo "::set-output name=is_released::$(sh ./.github/scripts/is-released)"
#   publish:
#     name: Publish
#     runs-on: ubuntu-18.04
#     needs: release
#     if: needs.release.outputs.is_released == 'true'
#     steps:
#       - uses: actions/checkout@v2
#       - uses: actions/setup-node@v2
#         with:
#           node-version: 16.x
#           registry-url: 'https://registry.npmjs.org'
#           cache: npm
#       - name: Download production artifacts
#         uses: actions/download-artifact@v2
#       - name: Set Package Version to Environment
#         run: echo PACKAGE_VERSION=$(node -pe '`v${require("./package.json")["version"]}`') >> $GITHUB_ENV
#       - name: Publish @nx-ddd/common
#         env:
#           NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
#         run: npm run publish:common
#       - name: Publish @nx-ddd/firestore
#         env:
#           NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
#         run: npm run publish:firestore
        