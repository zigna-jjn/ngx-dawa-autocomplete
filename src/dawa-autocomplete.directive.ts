import { Directive, AfterViewInit, OnDestroy, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switchMap';

import { DawaAutocompleteService, DawaAutocompleteItem } from './dawa-autocomplete.service';

@Directive({
    selector: '[ngxDawaAutocomplete]'
})
export class DawaAutocompleteDirective implements AfterViewInit, OnDestroy {

    @Output() items$: EventEmitter<DawaAutocompleteItem[]> = new EventEmitter<DawaAutocompleteItem[]>();
    @Output() highlighted$: EventEmitter<number> = new EventEmitter<number>();
    @Output() select$: EventEmitter<DawaAutocompleteItem> = new EventEmitter<DawaAutocompleteItem>();

    private _searchEventSubscription$: Subscription;
    private _arrowEventSubscription$: Subscription;
    private _selectEventSubscription$: Subscription;

    private _items: DawaAutocompleteItem[] = [];
    private _highlightedIndex = 0;

    constructor(private _elementRef: ElementRef,
                private _dawaAutocompleteService: DawaAutocompleteService) {}

    public ngAfterViewInit() {

        this._searchEventSubscription$ = Observable
            .fromEvent(this._elementRef.nativeElement, 'keyup')
            .filter(this.filterArrowEnterAndTabKeys)
            .map(e => e.target.value)
            .debounceTime(150)
            .distinctUntilChanged()
            .switchMap((term: string) => this._dawaAutocompleteService.search(term))
            .subscribe(items => {

                this._items = items;
                this._highlightedIndex = 0;

                this.highlighted$.next(this._highlightedIndex);
                this.items$.next(this._items);
            });

        const keydownEvent$ = Observable
            .fromEvent<KeyboardEvent>(this._elementRef.nativeElement.parentElement, 'keydown');

        this._arrowEventSubscription$ = keydownEvent$
            .filter(e => e.keyCode === 38 || e.keyCode === 40)
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
            .filter(e => e.keyCode === 13 || e.keyCode === 9)
            .subscribe(e => {

                if (this._items[this._highlightedIndex]) {
                    this.select$.next(this._items[this._highlightedIndex]);
                }
            });
    }

    public ngOnDestroy() {

        this._searchEventSubscription$.unsubscribe();
        this._arrowEventSubscription$.unsubscribe();
        this._selectEventSubscription$.unsubscribe();
    }

    @HostListener('click', ['$event'])
    public onClick(event) {

        this._dawaAutocompleteService
            .search(event.target.value)
            .subscribe(items => {
                this._items = items;
                this._highlightedIndex = 0;
                this.items$.next(this._items);
            });
    }

    @HostListener('focus', ['$event'])
    public onFocus(event) {

        this._dawaAutocompleteService
            .search(event.target.value)
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
