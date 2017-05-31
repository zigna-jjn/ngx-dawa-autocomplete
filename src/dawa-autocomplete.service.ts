import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

@Injectable()
export class DawaAutocompleteService {

    constructor(private _http: Http) {}

    search(searchTerm: string): Observable<DawaAutocompleteItem[]> {

        const searchQuery = new URLSearchParams();
        searchQuery.set('q', searchTerm);
        searchQuery.set('per_side', '6');
        searchQuery.set('format', 'json');

        if (searchTerm) {
            return this._http
                        .get('https://dawa.aws.dk/adresser/autocomplete', { search: searchQuery })
                        .map((request) => request.json())
                        .map(this.mapToAutocompleteItem);
        }

        return Observable.of([]);
    }

    private mapToAutocompleteItem(items: any[]): DawaAutocompleteItem[] {
        return items.map(item => {
            return {
                text: item.tekst,
                door: item.adresse['dør'],
                floor: item.adresse['etage'],
                number: item.adresse['husnr'],
                zip: item.adresse['postnr'],
                city: item.adresse['postnrnavn'],
                street: item.adresse['vejnavn'],
                fullStreet: item.tekst.lastIndexOf(',') > 0 ? item.tekst.substring(0, item.tekst.lastIndexOf(',')) : item.tekst
            };
        });
    }
}

export class DawaAutocompleteItem {
    text: string;
    door: string;
    floor: string;
    number: string;
    zip: number;
    city: string;
    street: string;
    fullStreet: string;
}
