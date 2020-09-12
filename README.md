> A library that provides helpers for your Angular projects that speed up the development or solve tricky problems.

<p align="center"><img width="300" src="https://raw.githubusercontent.com/meeroslav/ng-helpers/master/.assets/nghelper.png" alt="Ng Helpers logo"></p>

<p align="center">
  <a href="https://circleci.com/gh/meeroslav/ng-helpers/tree/master"><img src="https://circleci.com/gh/meeroslav/ng-helpers/tree/master.svg?style=svg" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/ng-helpers"><img src="https://img.shields.io/npm/v/ng-helpers.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/ng-helpers"><img src="https://img.shields.io/npm/l/ng-helpers.svg?sanitize=true" alt="License"></a>
</p>

<h1 align="center">ng Helpers</h2>



Table of contents:
- [Installation](#installation)
- [Package](#package)
  - [Fragment component](#fragment-component)
    - [Problem](#problem)
    - [Usage](#usage)
  - [Media](#media-directive)
    - [Problem](#problem-1)
    - [Usage](#usage-1)
- [License](#license)

## Installation
```
npm install --save ng-helpers
```

## Package
Package consists of following helpers:
- [Fragment component](#fragment-component)
- [Media](#media-directive)

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

### Media directive

Structural directive for manipulating content of the template based on matched media query. It's an upgrade from [CSS based responsive design driven by media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).

#### Problem
The CSS media queries represent well-known way to handle responsive design, but the CSS cannot control the generation of DOM elements, just their visual representation. By having too many differences between responsive states we are poluting the DOM by keeping there elements that are not visible.

This can be avoided in Angular by using structural directives or components that will not be rendered unless certain media query is matched.

#### Usage

```html
<div *media="'(min-width: 768px)'">I will be shown only on desktop</div>
<my-portait-component *media="'(orientation: portrait)'"></my-portait-component>
```

Some of the most common media queries:

| Query | Result |
| - | - |
| `(max-width: 768px)` | Used for mobile views |
| `(min-width: 769px) and (max-width: 1200px)` | Standard browsers size |
| `(min-width: 1201px) and (max-width: 1400px)` | Wide browsers |
| `(min-width: 1401px)` | Ultra-wide browser |
| `(orientation: landscape)` | Landscape mode on handheld device or if width > height |
| `(orientation: portrait)` | Portrait mode on handheld device or height > width |

You can find more on [CSS Tricks post](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/).

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Miroslav Jonas
