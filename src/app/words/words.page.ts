import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService, Word} from '../shared/services/data.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
        private fb: FormBuilder
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
                }, 500);
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
}
