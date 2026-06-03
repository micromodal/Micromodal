<p align="center">
  <img src="https://www.dropbox.com/s/tbaooyi4yh8pbi7/logo.png?raw=1" width="100px"/>
</p>
<h3 align="center">
  Micromodal.js (Testing v0.7.2)
</h3>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/made%20with-love-E760A4.svg" alt="Made with love">
  </a>
  <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/micromodal" target="_blank" rel="noopener">
    <img src="https://img.shields.io/npm/v/micromodal.svg" alt="Package version">
  </a>
</p>

<p align="center">
  Tiny, dependency-free javascript library for creating accessible modal dialogs
</p>

---

<img src="https://www.dropbox.com/s/8g7fr091tk8o62j/micromodal.gif?raw=1" width="100%">

The aim of this library is to make modal dialogs accessible and easy to include in your project with minimum configuration. It's only ~1.8kb minified and gzipped&mdash;A tiny library for big change.

**[Demo and documentation](https://micromodal.now.sh/)**

**[Codepen example](https://codepen.io/pen?template=LEYmYWy)**

&nbsp;

## Features
✔ Toggles relevant aria attributes on open and close

✔ Closes modal on overlay click

✔ Closes modal on pressing the `esc` key

✔ Traps tab focus within the modal

✔ Focuses on the first focusable element within the modal

✔ Retains the focused element state after closing the modal

✔ Supports nested modals

&nbsp;

## Installation

**via npm**
```shell
npm install micromodal --save
```

**via yarn**
```shell
yarn add micromodal
```

**via CDN direct link**
```html
<script src="https://cdn.jsdelivr.net/npm/micromodal/dist/micromodal.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>
```

**direct download**
```shell
curl -O -L https://unpkg.com/micromodal/dist/micromodal.min.js
```

&nbsp;

## IE 11 and below

Please use this pollyfill suggested [here](https://github.com/ghosh/Micromodal/issues/49#issuecomment-424213347).

&nbsp;

## Changelog

Find the latest changelog [here](https://github.com/ghosh/micromodal/blob/master/CHANGELOG.md).

&nbsp;

## Contributing

We are always open and invite developers to contribute to Micromodal. We have kept the guidelines and process dead simple, so you invest more time in making modals accessible to all.

Micromodal follows the [standardjs](https://standardjs.com/) coding standard and is part of our `package.json` file. It will help us to maintain consistency in the code base.

#### Development setup
1. Clone Github repo `$ git clone https://github.com/ghosh/micromodal.git`
2. Install `yarn` package manager (Read [installation guide](https://yarnpkg.com/en/docs/install#mac-tab))
3. Run `yarn install` in the root folder to install all dependencies
4. Run `yarn dev` to start a dev server. This serves the example directory and live reloads when any files are changed
5. [Optional] Run `yarn build` to build the files for distribution. This is run automatically as a pre-commit hook as well.
6. Send us pull request and chill

#### Pushing a new version

First, you must be authorized on npmjs.com. Then:

1. Update the npm package:
  - Update the version in `lib/package.json`
  - `yarn deploy:npm`

2. Update the changelog.

3. Commit and push changes

4. Tag the version in git:
  - `git tag -a X.Y.Z`
  - Add the same text as the changelog to the tag description
  - `git push origin X.Y.Z`

5. Create a new release in Github: https://github.com/micromodal/micromodal/releases

&nbsp;

## Want to be a core maintainer?

We are looking for more maintainers for Micromodal. If you are interested, and you have at least some free time to spend on this, reach out to @dkniffin.

&nbsp;

## Licensing
This project is licensed under [MIT license](https://opensource.org/licenses/MIT).

&nbsp;

## Related
- [Microtip](https://github.com/ghosh/microtip) - Modern, lightweight, accessible css tooltip library. Just 1kb.

&nbsp;

## Created and maintained by

Derek Kniffin – [@dkniffin](https://github.com/dkniffin) 🇺🇸

Indrashish Ghosh – [@_ighosh](https://twitter.com/_ighosh) 🇮🇳

Kalpesh Singh - [@knowkalpesh](https://twitter.com/knowkalpesh) 🇮🇳

Darpan Kakadia - [@kakadiadarpan](https://twitter.com/kakadiadarpan) 🇩🇪

Contributors - [list](https://github.com/ghosh/micromodal/graphs/contributors) 🌐

You? - Open a PR to get started!
