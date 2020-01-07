[![CircleCI](https://circleci.com/gh/meeroslav/ng-helpers/tree/master.svg?style=svg)](https://circleci.com/gh/meeroslav/ng-helpers/tree/master)
[![npm version](https://badge.fury.io/js/ng-helpers.svg)](https://www.npmjs.com/package/ng-helpers)

# ng helpers

> A library that provides helpers for your Angular projects that speed up the development or solve tricky problems.

Table of contents:
- [Installation](#installation)
- [Package](#package)
- [License](#license)

## Installation
```
npm install --save ng-helpers
```

## Package
Package consists of following helpers:
- [Fragment component](#fragment-component)
  - Problem
  - Usage
  - Dependencies
  - API
- [Media service](#media-service)
  - Problem
  - Usage
  - Dependencies
  - API
- [NgRx helpers](#ngrx-helpers)
  - Problem
  - Usage
  - Dependencies
  - API

### Fragment component

Fragment component provides solution for cases when you don't want your component template to be wrapped in named tags, but rather have multiple root nodes.

### Media service

Media service encapsulates the media query changes that happen on page load or resize and exposes them as observable stream.

### NgRx helpers

NgRx helpers reduce boilerplate needed to write the state management Actions, Effects and Reducers by leveraging typescript generics. 

## License
Licensed under MIT
