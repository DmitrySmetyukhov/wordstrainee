import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService, Word} from '../shared/services/data.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {WordEditComponent} from './word-edit/word-edit.component';

@Component({
    selector: 'app-words',
    templateUrl: './words.page.html',
    styleUrls: ['./words.page.scss'],
})
export class WordsPage implements OnInit, OnDestroy {
    expanded = true;
    categories: Category[];
    words: Word[] = [];
    pending = false;
    isCategoriesVisible = false;
    private _subscription = new Subscription();

    constructor(
        private dataService: DataService,
        private actionSheetController: ActionSheetController,
        private modalCtrl: ModalController
    ) {
    }

    ngOnInit(): void {
        this._subscription.add(this.dataService.words$.subscribe(wordsList => {
            this.words = wordsList;
        }));

        this._subscription.add(this.dataService.categories$.subscribe(
            list => {
                this.categories = list;

                setTimeout(() => {
                    this.isCategoriesVisible = true;
                }, 700);
            }
        ));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    togglePanel() {
        this.expanded = !this.expanded;
    }

    async presentActionSheet(word: Word) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Confirm action:',
            cssClass: 'my-custom-class',
            buttons: [{
                text: `Delete ${word.origin}`,
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.deleteWord(word.id);
                }
            },
                {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel'
                }]
        });
        await actionSheet.present();
    }

    async deleteWord(id: string) {
        this.pending = true;
        await this.dataService.deleteWord(id);

        this.pending = false;
    }

    async onCategoryChange(word: Word) {
        this.pending = true;
        await this.dataService.updateWord(word.id, word);
        this.pending = false;
    }

    async openCreateWordModal() {
        const modal = await this.modalCtrl.create({
            component: WordEditComponent,
            componentProps: {
                categories: this.categories
            }
        });

        await modal.present();
    }
}
