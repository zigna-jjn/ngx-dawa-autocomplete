# ngx-dawa-autocomplete

## About

DawaAutocomplete is a module consisting of a directive that provides an typeahead/autocomplete solution for the [Danish Address Web Api](https://dawa.aws.dk/). It uses the autocomplete api that has been provided by DAWA.

## Installation

To install this library, run:

```bash
$ npm install ngx-dawa-autocomplete --save
```

## Example

[Here is a Plunker example](http://embed.plnkr.co/JRgHXteqVxOSo2TKsyXD/)

## Usage

Like described above, the ngx-dawa-autocomplete is a module with a directive, that you can apply to any input/textarea element in your Angular application. Its built in a way so you have full control over the layout and structure of the autocomplete container, therefor its not a component.

**First include the DawaAutocompleteModule in your module (main or sub)**
```typescript
import { NgModule } from '@angular/core';

import { DawaAutocompleteModule } from 'ngx-dawa-autocomplete';
 
import { AppComponent }  from './app.component';
 
@NgModule({
  imports: [
    BrowserModule,
    DawaAutocompleteModule.forRoot()
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
```

**then you apply the `ngxDawaAutocomplete` directive to the specified input element, and the rest of the html is what ever you decide.**
```typescript
import { Component } from '@angular/core';
import { DawaAutocompleteItem } from 'ngx-dawa-autocomplete';

@Component({
    selector: 'app',
    template: `
        <div class="autocomplete-container">
            <input
                type="text"
                [value]="selectedStreet"
                ngxDawaAutocomplete
                (items$)="onItems($event)"
                (highlighted$)="onItemHighlighted($event)"
                (select$)="onItemSelected($event)" />
            <ul class="autocomplete-items" *ngIf="items.length > 0">
                <li class="autocomplete-item"
                    *ngFor="let item of items; let i = index;"
                    [class.highlighted]="i === highlightedIndex"
                    (click)="onItemSelected(item)">
                    {{item.text}}
                </li>
            </ul>
        </div>
    `
})
export class AppComponent {

    public items: DawaAutocompleteItem[] = [];
    public highlightedIndex: number = 0;
    public selectedItem: DawaAutocompleteItem;

    public onItems(items) {
        this.items = items;
    }

    public onItemHighlighted(index) {
        this.highlightedIndex = index;
    }

    public onItemSelected(item) {
        this.items = [];
        this.highlightedIndex = 0;
        this.selectedItem = item;
    }
}
```

## API

Right now there is no way to specify information to the directive, there is only 3 outputs that you can listen on:

**DawaAutocompleteDirective**  

| Outputs          | type                    | description      |
| ---------------- | ----------------------- | ---------------- |
| **items$**       | DawaAutocompleteItem[]  | Emitted each time theres a new search result, when you focus/click in the field and click outside the autocomplete container |
| **highlighted$** | number                  | Emitted when `arrow up/down` are pressed to identify highlighted index |
| **select$**      | DawaAutocompleteItem    | Emitted when `enter` or `tab` is pressed |

**DawaAutocompleteItem interface**  

| Name          | type   |
| ------------- | ------ |
| text          | string |
| door          | string |
| floor         | string |
| number        | string |
| zip           | string |
| city          | string |
| street        | string |
| fullStreet    | string |

## License

MIT © [dineroregnskab](mailto:developer@dinero.dk)
