# ng helpers

> A library that provides helpers for your Angular projects that speed up the development or solve tricky problems.

# Table of contents:
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
  - Usage
  - Dependencies
  - API
- [Media service](#media-service)
  - Usage
  - Dependencies
  - API
- [NgRx helpers](#ngrx-helpers)
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
