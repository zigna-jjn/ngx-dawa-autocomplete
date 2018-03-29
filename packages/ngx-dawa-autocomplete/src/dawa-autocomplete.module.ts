import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DawaAutocompleteDirective } from './dawa-autocomplete.directive';
import { DawaAutocompleteService } from './dawa-autocomplete.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
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
