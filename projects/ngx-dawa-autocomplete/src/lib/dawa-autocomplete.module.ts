import { NgModule, ModuleWithProviders } from '@angular/core';

import { DawaAutocompleteDirective } from './dawa-autocomplete.directive';
import { DawaAutocompleteService } from './dawa-autocomplete.service';

@NgModule({
    declarations: [
        DawaAutocompleteDirective
    ],
    exports: [
        DawaAutocompleteDirective
    ]
})
export class DawaAutocompleteModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DawaAutocompleteModule,
            providers: [DawaAutocompleteService]
        };
    }
}
