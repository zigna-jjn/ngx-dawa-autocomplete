import { Directive, AfterViewInit, OnDestroy, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { DawaAutocompleteService, DawaAutocompleteItem } from './dawa-autocomplete.service';

import { fromEvent, Subscription } from 'rxjs';

import { filter, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Directive({
    selector: '[ngxDawaAutocomplete]'
})
export class DawaAutocompleteDirective implements AfterViewInit, OnDestroy {

    @Output() items$ = new EventEmitter<DawaAutocompleteItem[]>();
    @Output() highlighted$ = new EventEmitter<number>();
    @Output() select$ = new EventEmitter<DawaAutocompleteItem>();

    private _searchEventSubscription$: Subscription;
    private _arrowEventSubscription$: Subscription;
    private _selectEventSubscription$: Subscription;

    private _items: DawaAutocompleteItem[] = [];
    private _highlightedIndex = 0;

    constructor(
        private _elementRef: ElementRef,
        private _dawaAutocompleteService: DawaAutocompleteService
    ) { }

    public ngAfterViewInit() {

        const keydownEvent$ = fromEvent<KeyboardEvent>(this._elementRef.nativeElement.parentElement, 'keydown');
        const keyupEvent$ = fromEvent<KeyboardEvent>(this._elementRef.nativeElement.parentElement, 'keyup');

        this._searchEventSubscription$ = keyupEvent$
            .pipe(
                filter(this.filterArrowEnterAndTabKeys),
                map(e => e.target.value),
                debounceTime(150),
                distinctUntilChanged(),
                switchMap((term: string) => this._dawaAutocompleteService.search(term))
            )
            .subscribe(items => {
                this._items = items;
                this._highlightedIndex = 0;

                this.highlighted$.next(this._highlightedIndex);
                this.items$.next(this._items);
            });

        this._arrowEventSubscription$ = keydownEvent$
            .pipe(filter(e => e.keyCode === 38 || e.keyCode === 40))
            .subscribe(e => {
                e.preventDefault();

                if (e.keyCode === 40) {
                    this._highlightedIndex = this._highlightedIndex === (this._items.length - 1) ? 0 : this._highlightedIndex + 1;
                } else if (e.keyCode === 38) {
                    this._highlightedIndex = this._highlightedIndex <= 0 ? (this._items.length - 1) : this._highlightedIndex - 1;
                }

                this.highlighted$.next(this._highlightedIndex);
            });

        this._selectEventSubscription$ = keydownEvent$
            .pipe(filter(e => e.keyCode === 13 || e.keyCode === 9))
            .subscribe(e => {

                if (this._items[this._highlightedIndex]) {
                    this.select$.next(this._items[this._highlightedIndex]);
                }
            });
    }

    public ngOnDestroy() {
        if (this._searchEventSubscription$) {
            this._searchEventSubscription$.unsubscribe();
        }

        if (this._arrowEventSubscription$) {
            this._arrowEventSubscription$.unsubscribe();
        }

        if (this._selectEventSubscription$) {
            this._selectEventSubscription$.unsubscribe();
        }
    }

    @HostListener('click', ['$event.target.value'])
    public onClick(searchValue: string) {
        this._dawaAutocompleteService
            .search(searchValue)
            .subscribe(items => {
                this._items = items;
                this._highlightedIndex = 0;
                this.items$.next(this._items);
            });
    }

    @HostListener('focus', ['$event.target.value'])
    public onFocus(searchValue: string) {
        this._dawaAutocompleteService
            .search(searchValue)
            .subscribe(items => {
                this._items = items;
                this._highlightedIndex = 0;
                this.items$.next(this._items);
            });
    }

    @HostListener('document:click', ['$event.target'])
    public onOutsideClick(target) {
        if (!this._elementRef.nativeElement.parentElement.contains(target)) {
            this._highlightedIndex = 0;
            this.items$.next([]);
        }
    }

    private filterArrowEnterAndTabKeys(event) {
        return event.keyCode !== 37 &&
            event.keyCode !== 38 &&
            event.keyCode !== 39 &&
            event.keyCode !== 40 &&
            event.keyCode !== 13 &&
            event.keyCode !== 9;
    }
}
