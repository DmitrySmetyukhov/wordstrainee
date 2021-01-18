import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {WordsPageRoutingModule} from './words-routing.module';

import {WordsPage} from './words.page';
import {WordEditComponent} from './word-edit/word-edit.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WordsPageRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [WordsPage, WordEditComponent]
})
export class WordsPageModule {
}
