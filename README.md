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
    - [Usage](#usage)
  - [Let directive](#let-directive)
    - [Usage](#usage-1)
  - [Media](#media)
    - [Usage](#usage-2)
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

### Let directive

The angular template is often using deep nested object values or observables in multiple places. The common pattern is to use the `ngIf` structural directive to extract the value:

```HTML
<div *ngIf="loadingState$ | async as loadingState">
  <my-table 
    [loading]="loadingState" 
    [rows]="rows"
    [columns]="columns">
  </my-table>
  <button 
    (click)="addRow()"
    [disabled]="loadingState === LoadingState.Loading"
  >Add row</button>
</div>
```

The non-so-obvious flaw of the above approach is that whenever the `loadingState` has a falsy value (0, null, false, etc.) the entire block will not be rendered. The `ngLet` solves this by always rendering the inner content and passing the value no matter if falsy or truthy.

#### Usage

Before using the directive we need to include the module.
```typescript
import { LetModule } from 'ng-helpers';

@NgModule({
  imports: [
    LetModule
  ]
})
export class AppModule { }
```

Now we can use it in our component templates
```html
<div *ngLet="loadingState$ | async as loadingState">
  The {{ loadingState }} will be available here
</div>
```

We can also use it to put deep nested values in variables for better readability:
```html
<form [formGroup]="myForm">
  <input formControlName="name" required />
  <ng-container *ngLet="myForm.controls.name as name">
    <div *ngIf="name.invalid && (name.dirty || name.touched)"
        class="alert alert-danger">

      <div *ngIf="name.errors.required">
        Name is required.
      </div>
      <div *ngIf="name.errors.minlength">
        Name must be at least 4 characters long.
      </div>
      <div *ngIf="name.errors.forbiddenName">
        Name cannot be Bob.
      </div>
    </div>
  </ng-container>
</form>
```

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
  imports: [
    MediaModule
  ]
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
  private sub: Subscription<boolean>;

  constructor(private readonly mediaService: MediaService) {};

  ngOnInit() {
    // initialize listener
    this.mediaService.setQuery('(orientation: portrait)');
    // subscribe to changes programatically or via template
    this.mediaService.match$
      .pipe(
        distinctUntilChanged(),
        map(isPortrait => isPortrait ? 'Potrait' : 'Landscape')
      )
      .subscribe(orientation => console.log(`Orientation changed! New: ${orientation}`));
  }
}
```

> In order to avoid memory leaks don't forget to unsubscribe all the listeners! The observable will be automatically closed when service is destroyed.

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
