import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GaleryComponent } from './galery.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: GaleryComponent, pathMatch: 'full' },
  //{ path: '', component: GaleryComponent }, // Route pour la galerie
];

@NgModule({
  declarations: [
    GaleryComponent // Composant de la galerie
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes) // Import des routes enfants
  ],
  exports: [
    GaleryComponent // Export si nécessaire dans d'autres modules
  ]
})
export class GaleryModule {}
