import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService, Word} from '../shared/services/data.service';
import {Subscription} from 'rxjs';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {WordEditComponent} from './word-edit/word-edit.component';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-words',
    templateUrl: './words.page.html',
    styleUrls: ['./words.page.scss'],
})
export class WordsPage implements OnInit, OnDestroy {
    expanded = true;
    categories: Category[];
    filteredWords: Word[] = [];
    pending = false;
    isCategoriesVisible = false;
    filtersForm: FormGroup;
    private _subscription = new Subscription();
    private _words: Word[] = [];

    constructor(
        private dataService: DataService,
        private actionSheetController: ActionSheetController,
        private modalCtrl: ModalController,
        private _fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.filtersForm = this._fb.group({
            search: [''],
            categoryId: [null]
        });

        this.filtersForm.valueChanges.subscribe(val => {
            this._filterAction();
        });

        this._subscription.add(this.dataService.words$.subscribe(wordsList => {
            this._words = wordsList;
            this._filterAction();
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

    get search() {
        return this.filtersForm.get('search');
    }

    get categoryId() {
        return this.filtersForm.get('categoryId');
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

    async openEditWordModal(word?: Word) {
        const modal = await this.modalCtrl.create({
            component: WordEditComponent,
            componentProps: {
                categories: this.categories,
                word,
                words: this._words
            }
        });

        await modal.present();
    }

    resetFilters() {
        this.filtersForm.setValue({
            search: '',
            categoryId: ''
        });
    }

    private _filterAction() {
        this.filteredWords = this._words.filter(word => {
            const query = this.search.value.trim().toLowerCase();
            return word.origin.includes(query) || word.translation.includes(query);
        });

        this.filteredWords = this.filteredWords.filter(word => {
            if (this.categoryId.value) {
                return word.categoryId === this.categoryId.value;
            }

            return true;
        });
    }
}
