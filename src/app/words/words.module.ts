import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {WordsPageRoutingModule} from './words-routing.module';

import {WordsPage} from './words.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WordsPageRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [WordsPage]
})
export class WordsPageModule {
}
