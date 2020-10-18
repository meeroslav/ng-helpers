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
    - [Description](#description)
    - [Usage](#usage)
  - [Media](#media)
    - [Usage](#usage-1)
    - [Media service](#media-service)
    - [Media component](#media-component)
    - [Media directive](#media-directive)
    - [Common media queries](#common-media-queries)
- [License](#license)

## Installation
```
npm install --save ng-helpers
```

## Package
This package consists of the following helpers:
- [Fragment component](#fragment-component)
- [Media](#media)

### Fragment component

The `Fragment component` provides the solution for cases when you don't want your component template to be wrapped in a named tag. Such cases include:
- having multiple root nodes
- having a native element as a root node

#### Description

An angular component gets wrapped in a single named tag, provided by the `selector` property. Each component must therefore have a single root DOM note wrapping an entire body. There are, however, situations when we would like to have multiple `root` nodes, for example, if our component is to render `li` elements in the `ul`:

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

which is, of course, invalid HTML and might additionally break our styles. What we would like is for it to render as:
```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Orange</li>
</ul>
```

#### Usage

The `Fragment component` replaces the root element with the contents of the template defined as the first child element.

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

Possible usages are rendering partial `li` lists, table rows or columns or any other parts of DOM that require the specific parent DOM element.

### Media

The `Media package` consists several utilities used to responsive content handling in Angular. Those utilities include:
- [Media service](#media-service)
- [Media component](#media-component)
- [Media directive](#media-directive)

You can read more about the motivation in my blog post [Responsive Angular Components](https://missing-manual.com/responsive-angular/). It's an upgrade from [CSS based responsive design by media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) as it allows us to manipulate the actual content of the DOM instead of just it's visibility. By having too many differences between responsive states we are polluting the DOM by keeping there elements that are not visible.

This can be avoided in Angular by using services, directives or components that will not be rendered unless the certain media query is matched. For example we could use the service to fetch data from different endpoints depending on media or use a component to optionally render a certain DOM block. 

#### Usage

In order to use any of the utility parts of the media package we need to include the `MediaModule`:

```typescript
import { MediaModule } from 'ng-helpers';

@NgModule({
  //...
  imports: [
    MediaModule
  ],
  //...
})
export class AppModule { }
```

#### Media service

The `Media service` is a service that exposes an Observable returning matched state of the given media queries.

Usage:
```typescript
@Component({
  selector: 'foo-bar',
  template: `
    <div *ngIf="mediaService.match$ | async">
      I am shown only in the portrait mode
    </div>
  `
})
class FooBarComponent { 
  private mediaService = new MediaService('(orientation: portrait)');
  private sub: Subscription<boolean>;

  ngOnInit() {
    this.mediaService.match$
      .pipe(
        distinctUntilChanged(),
        map(isPortrait => isPortrait ? 'Potrait' : 'Landscape')
      )
      .subscribe(orientation => console.log(`Orientation changed! New: ${orientation}`));
  }
}
```


#### Media component

The `Media component` is an angular wrapper component for manipulating the rendering of the content based on the matched media queries. 

Usage:

```typescript
@Component({
  selector: 'foo-bar',
  template: `
    <use-media query="(min-width: 768px)">
      I am visible only on desktop
    </use-media>
    <use-media query="(orientation: portrait)">
      I am visible only on portrait mode
    </use-media>
  `
})
class FooBarComponent { }
```

#### Media directive

The `Media directive` is a structural directive for manipulating the content of the template based on the matched media queries. 

Usage:

```html
<div *media="'(min-width: 768px)'">I will be shown only on desktop</div>
<my-portait-component *media="'(orientation: portrait)'"></my-portait-component>
```

#### Common media queries

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
