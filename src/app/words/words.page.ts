import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService, Word} from '../shared/services/data.service';
import {Subscription} from 'rxjs';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {WordEditComponent} from './word-edit/word-edit.component';
import {FormBuilder, FormGroup} from '@angular/forms';

enum SortingDirection {
    None, Asc, Desc
}

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
    sortingDirection = SortingDirection.None;
    SortingDirection = SortingDirection;
    private _subscription = new Subscription();
    private _words: Word[] = [];

    constructor(
        private _dataService: DataService,
        private _actionSheetController: ActionSheetController,
        private _modalCtrl: ModalController,
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

        this._subscription.add(this._dataService.words$.subscribe(wordsList => {
            this._words = wordsList;
            this._filterAction();
        }));

        this._subscription.add(this._dataService.categories$.subscribe(
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

    onSortClick() {
        switch (this.sortingDirection) {
            case SortingDirection.None:
                this.sortingDirection = SortingDirection.Desc;
                break;
            case SortingDirection.Desc:
                this.sortingDirection = SortingDirection.Asc;
                break;
            case SortingDirection.Asc:
                this.sortingDirection = SortingDirection.Desc;
                break;
        }

        this._sort();
    }

    _sort() {
        if (this.sortingDirection === SortingDirection.None) {
            return;
        }

        this.filteredWords.sort(this._compare.bind(this));
        if (this.sortingDirection === SortingDirection.Desc) {
            this.filteredWords.reverse();
        }
    }

    async presentActionSheet(word: Word) {
        const actionSheet = await this._actionSheetController.create({
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
        await this._dataService.deleteWord(id);

        this.pending = false;
    }

    async onCategoryChange(word: Word) {
        this.pending = true;
        await this._dataService.updateWord(word.id, word);
        this.pending = false;
    }

    async openEditWordModal(word?: Word) {
        const modal = await this._modalCtrl.create({
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

    private _compare(a, b) {
        if (a.origin < b.origin) {
            return -1;
        }
        if (a.origin > b.origin) {
            return 1;
        }
        return 0;
    }
}
