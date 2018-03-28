import { Component } from '@angular/core';
import { DawaAutocompleteItem } from 'ngx-dawa-autocomplete';

@Component({
	selector: 'app-root',
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
  	`,
	styles: [`
		input {
			border: 1px solid #ccc;
			background: #f9f9f9;
			box-shadow: inset 0 0 0 #fff;
			padding: 0.4em;
			font-size: 15px;
			width: 100%;
			box-sizing: border-box;
		}
		input:focus {
			outline: none;
		}
		.autocomplete-container {
			position: relative;
			width:400px;
		}
		.autocomplete-items {
			list-style: none;
			padding: 0.2em 0;
			margin: 0;
			position: absolute;
			z-index: 50;
			margin-top: 0px;
			left: 0;
			right: 0;
			background-color: #ffffff;
			border: 1px solid rgba(0, 0, 0, 0.2);
			box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
			border-top-color: transparent;
		}
		.autocomplete-item {
			cursor: pointer;
			padding: 0.5em 1em;
			border-bottom: 1px solid whitesmoke;
		}
		.autocomplete-item:last-child {
			border-bottom: none;
		}
		.autocomplete-item:hover,
		.autocomplete-item.highlighted {
			background-color: #f9f9f9;
			font-weight: bold;
		}
	`]
})
export class AppComponent {

	public items: DawaAutocompleteItem[] = [];
	public highlightedIndex: number = 0;
	public selectedStreet: string = '';

	public onItems(items) {
		this.items = items;
	}

	public onItemHighlighted(index) {
		this.highlightedIndex = index;
	}

	public onItemSelected(item) {
		this.items = [];
		this.highlightedIndex = 0;
		this.selectedStreet = item.fullStreet;
	}
}
