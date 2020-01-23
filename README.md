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
  - [Problem](#problem)
  - [Usage](#usage)
- [Media service](#media-service)
  - [Problem](#problem-1)
  - [Usage](#usage-1)
- [NgRx helpers](#ngrx-helpers)
  - [Problem](#problem-2)
  - [Usage](#usage-2)
  - [Dependencies](#dependencies)
  - [API](#api)

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

### NgRX helpers

NgRx helpers reduce boilerplate needed to write the state management Actions, Effects and Reducers by leveraging typescript generics. 

#### Problem
Good codebases have common architecture patterns applied across the entire application. Using components, models, services and state management in a unified way eventually produces a lot of boilerplate. Boilerplate is often boring as it is time-consuming.

This solution presents opinionated way of reducing state management boilerplate when using `ngrx` by abstracting away the duplicated code.

#### Usage

* Grouped action creators

In order to use the benefit of automated reducer, we need to specify the group type of action: `LOAD`, `SUCCESS/LOADED` or `FAILED`.

```typescript
const loadProduct = createLoadAction('[Product] Load Product', props<{ id: string }>());
const productLoaded = createSuccessAction('[Product] Product Loaded', props<{ products: Product[] }>());
const loadProductFailed = createFailureAction('[Product] Load Product Failed', props<{ id: string } & FailurePayload>());

const loadProductAction = loadProduct({ id: '12345' });
const productLoadedAction = productLoaded({ products: myArrayOfProducts });
const productLoadFailedAction = loadProductFailed({ id: '12345', error: myError });
```
which is equivalent to:
```typescript
const loadProduct = createAction('[Product] Load Product', props<{ id: string, actionGroup: ActionGroup }>());
const productLoaded = createAction('[Product] Product Loaded', props<{ products: Product[], actionGroup: ActionGroup }>());
const loadProductFailed = createAction('[Product] Load Product Failed', props<{ id: string, actionGroup: ActionGroup, error?: Error }>());

const loadProductAction = loadProduct({ id: '12345', actionGroup: ActionGroup.LOAD });
const productLoadedAction = loadProduct({ products: myArrayOfProducts, actionGroup: ActionGroup.SUCCESS });
const productLoadFailedAction = loadProduct({ id: '12345', error: myError, actionGroup: ActionGroup.FAILURE });
```

* Grouped reducer

Grouped reducer uses grouped actions to automate state changes in reducer. You can override sub-reducer for loading actions, success actions or failed actions and even non-groped actions.

```typescript
import * as actions from './actions';

const successReducer = createReducer(
  initialState,
  on(productLoaded, (state, { product }) => ({ ...state, product, loading: LoadingState.SUCCESSFUL })),
  on(productsLoaded, (state, { products }) => ({ ...state, products, loading: LoadingState.SUCCESSFUL }))
);
export function reducer(state: ProductState, action: Action) {
  return createGroupedReducer(initialState, actions, { successReducer })(state, action);
}
```

is equivalent to
```typescript
import * as actions from './actions';

const productReducer = createReducer(
  initialState,
  on(loadProducts, loadProduct, loadUsers, loadUser, 
    (state) => ({ ...state, error: null, loading: LoadingState.LOADING })),
  on(productLoaded, (state, { product }) => ({ ...state, product, loading: LoadingState.SUCCESSFUL })),
  on(productsLoaded, (state, { products }) => ({ ...state, products, loading: LoadingState.SUCCESSFUL })),
  on(loadProductsFailed, loadProductFailed, loadUsersFailed, loadUserFailed, 
    (state, { error }) => ({ ...state, error, loading: LoadingState.FAILED }))
);
export function reducer(state: ProductState, action: Action) {
  return productReducer(state, action);
}
```

* Effect helpers
```typescript
export class MyEffectsClass extends EffectsHelper {
  constructor(actions: Actions, private readonly service: MyService) {
    super(actions);
  }

  efx1$ = this.createSwitchMapEffect(
    loadProducts,
    this.service.getProducts,
    () => map(response => productsLoaded(response)),
    productsLoadFailed
  );

  efx2$ = this.createConcatMapEffect(
    saveProducts,
    this.service.saveProducts,
    () => map(response => productsSaved(response)),
    productsSaveFailed
  );
  
  failureEfx$ = this.createMapEffect(
    loadProductFailed,
    ({ productId }) => showFailureMessage({ message: `Loading product ${productId} failed` })
  );
}
```

which is equivalent to:
```typescript
export class MyEffectsClass extends EffectsHelper {
   constructor(private readonly actions$: Actions, private readonly service: MyService) { }

   efx1$ = createEffect(() => this.actions$.pipe(
     ofType(loadProducts),
     switchMap(action => this.service.getProducts(action)
       .pipe(
         map(response => productsLoaded(response)),
         catchError(error => productsLoadFailed({ ...action, error })
        )
      )
   ));

   efx2$ = createEffect(() => this.actions$.pipe(
     ofType(saveProducts),
     concatMap(action => this.service.saveProducts(action)
       .pipe(
         map(response => productsSaved(response)),
         catchError(error => productsSaveFailed({ ...action, error })
        )
      )
   ));

   failureEfx$ = createEffect(() => this.actions$.pipe(
     ofType(loadProductFailed),
     map(({ productId }) => showFailureMessage({ message: `Loading product ${productId} failed` }))
   ));
}
```

#### Dependencies

As name suggests, `NgRX` helpers depend on:
* @ngrx/store, `v >= 8.0.0`
* @ngrx/effects, `v >= 8.0.0`

and `NgRX` itself depends on `RxJS`, version above `v6.0.0`

#### API
TBD

## License
Licensed under MIT
