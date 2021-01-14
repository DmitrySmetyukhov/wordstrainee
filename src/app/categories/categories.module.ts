import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {CategoriesPageRoutingModule} from './categories-routing.module';

import {CategoriesPage} from './categories.page';
import {CategoryEditComponent} from './category-edit/category-edit.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CategoriesPageRoutingModule
    ],
    declarations: [CategoriesPage, CategoryEditComponent]
})
export class CategoriesPageModule {
}
