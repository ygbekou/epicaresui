import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe';
import { FilterNeighborhoodsPipe } from './filter-neighborhoods';
import { FilterStreetsPipe } from './filter-streets.pipe';
import { SafehtmlPipe } from './safehtml.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FilterByIdPipe,
        SafehtmlPipe,
        FilterNeighborhoodsPipe,
        FilterStreetsPipe
    ],
    exports: [
        FilterByIdPipe,
        SafehtmlPipe,
        FilterNeighborhoodsPipe,
        FilterStreetsPipe
    ]
})
export class PipesModule { }
