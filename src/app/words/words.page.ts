import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService, Word} from '../shared/services/data.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionSheetController} from '@ionic/angular';

@Component({
    selector: 'app-words',
    templateUrl: './words.page.html',
    styleUrls: ['./words.page.scss'],
})
export class WordsPage implements OnInit, OnDestroy {
    expanded = true;
    categories: Category[];
    words: Word[] = [];
    form: FormGroup;
    pending = false;
    isCategoriesVisible = false;
    private _subscription = new Subscription();

    constructor(
        private dataService: DataService,
        private fb: FormBuilder,
        private actionSheetController: ActionSheetController,
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            origin: ['', [Validators.required, Validators.maxLength(200)]],
            translation: ['', [Validators.required, Validators.maxLength(200)]],
            categoryId: ['', [Validators.required]]
        });
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

    async addWord() {
        this.pending = true;
        await this.dataService.addWord(this.form.value);
        this.pending = false;
        this.form.reset();
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
}
