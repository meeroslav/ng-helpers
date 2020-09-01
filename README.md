<p align="center"><img width="100" src="https://raw.githubusercontent.com/meeroslav/ng-helpers/master/.assets/nghelper.png" alt="Ng Helpers logo"></p>

[![CircleCI](https://circleci.com/gh/meeroslav/ng-helpers/tree/master.svg?style=svg)](https://circleci.com/gh/meeroslav/ng-helpers/tree/master)
[![npm version](https://badge.fury.io/js/ng-helpers.svg)](https://www.npmjs.com/package/ng-helpers)

<h1 align="center">Ng Helpers</h2>

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
  - [Problem](#problem)
  - [Usage](#usage)
- [Media service](#media-service)
  - [Problem](#problem-1)
  - [Usage](#usage-1)

### Fragment component

Fragment component provides solution for cases when you don't want your component template to be wrapped in named tags, but rather have multiple root nodes.

#### Problem

Angular component gets wrapped in single named tag, provided by the `selector` property. Each component must therefore have single root DOM note wrapping entire body.
There are, however, situations when we would like to have multiple `root` nodes, for example, if our component is to render `li` elements in the `ul`:

With parent template defined as:
```html
<ul>
  <my-list/>
</ul>
```

And component defined as:
```typescript
@Component({
  selector: 'my-list',
  template: `
    <li>Apple</li>
    <li>Banana</li>
    <li>Orange</li>
  `
})
export class MyList {}
```

renders as
```html
<ul>
  <my-list>
    <li>Apple</li>
    <li>Banana</li>
    <li>Orange</li>
  </my-list>
</ul>
```

which is, of course, invalid HTML. What we would like is for it to render as:
```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Orange</li>
</ul>
```

#### Usage

Fragment component replaces the root element with contents of template defined as first child element.

```typescript
@Component({
  selector: 'my-list',
  template: `
    <ng-template>
      <li>Apple</li>
      <li>Banana</li>
      <li>Orange</li>
    </ng-template>
  `
})
export class MyList extends FragmentComponent implements OnInit {
  constructor(vcRef: ViewContainerRef) {
    super(vcRef);
  }

  ngOnInit(): void {
    this.appendDOM();
  }
}
```

and given parent template:
```html
<ul>
  <my-list/>
</ul>
```

will render as:
```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Orange</li>
</ul>
```

Possible usages are rendering partial `li` lists, table rows or columns or any other parts of DOM that require specific parent DOM element.

### Media service

Media service encapsulates the media query changes that happen on page load or resize and exposes them as observable stream.

#### Problem
TBD

#### Usage
TBD

## License
Licensed under MIT
