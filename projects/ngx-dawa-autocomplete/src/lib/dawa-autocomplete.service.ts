import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class DawaAutocompleteItem {
    text: string;
    door: string;
    floor: string;
    number: string;
    zip: number;
    city: string;
    street: string;
    fullStreet: string;
    id: string;
}

@Injectable()
export class DawaAutocompleteService {

    constructor(
        private _httpClient: HttpClient,
    ) {}

    public search(searchTerm: string): Observable<DawaAutocompleteItem[]> {
        const searchQuery = new HttpParams()
            .set('q', searchTerm)
            .set('per_side', '6')
            .set('format', 'json');

        if (searchTerm) {
            return this._httpClient
                .get<DawaAutocompleteItem[]>('https://dawa.aws.dk/adresser/autocomplete', { params: searchQuery })
                .pipe(
                    map(this.mapToAutocompleteItem)
                );
        }

        return of<DawaAutocompleteItem[]>([]);
    }

    private mapToAutocompleteItem(items: any[]): DawaAutocompleteItem[] {
        return items.map(item => {
            return {
                id: item.id,
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
