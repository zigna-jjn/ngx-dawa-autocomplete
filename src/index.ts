import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { DawaAutocompleteDirective } from './dawa-autocomplete.directive';
import { DawaAutocompleteService } from './dawa-autocomplete.service';

export * from './dawa-autocomplete.directive';
export * from './dawa-autocomplete.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
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
