import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {Subscription} from 'rxjs';
import {Category, DataService, Word} from '../shared/services/data.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
    test = '';
    userName = '';
    categories: Category[];
    filteredWords: Word[];
    selectedCategoryId: string;
    activeWord: Word;
    enteredValue = '';
    isRotated = false;
    isError = false;
    private _subscription = new Subscription();
    private _words: Word[];
    private _prevActiveWordId = '';
    private _lastActiveWordId;

    constructor(
        private _authService: AuthService,
        private _dataService: DataService
    ) {
    }

    ngOnInit() {
        this._subscription.add(this._authService.user$.subscribe(user => this.userName = user?.displayName));
        this._subscription.add(this._dataService.categories$.subscribe(list => {
            this.categories = list;
            this.selectedCategoryId = list[0]?.id;
        }));
        this._subscription.add(this._dataService.words$.subscribe(list => {
            this._words = list;
            this.filterAction();
            this.next();
        }));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    logout() {
        this._authService.logout();
    }

    check() {
        const enteredValue = this.enteredValue.replace(/(\r\n|\n|\r)/gm, ' ').replace(/  +/g, ' ').trim().toLowerCase();

        if (!this.isRotated) {
            this.isError = enteredValue !== this.activeWord.translation;
        } else {
            this.isError = enteredValue !== this.activeWord.origin;
        }

        if (!this.isError) {
            const wordToRemove = this.filteredWords.find(word => word.id === this.activeWord.id);
            this.filteredWords.splice(this.filteredWords.indexOf(wordToRemove), 1);
            this.enteredValue = '';
        } else {
            const count = this.filteredWords.filter(word => word.id === this.activeWord.id).length;
            if (count < 2) {
                this.filteredWords.push(this.activeWord);
            }

            return;
        }

        if (!this.filteredWords.length) {
            this.filterAction();
        }

        this.next();
    }

    onNext() {
        const wordToRemove = this.filteredWords.find(word => word.id === this.activeWord.id);
        this.filteredWords.splice(this.filteredWords.indexOf(wordToRemove), 1);

        if (!this.filteredWords.length) {
            this.filterAction();
        }

        this.next();
    }

    next() {
        let index = Math.floor(Math.random() * this.filteredWords.length);

        if (this.filteredWords.length > 1) {
            while (this.filteredWords[index].id === this._lastActiveWordId) {
                index = Math.floor(Math.random() * this.filteredWords.length);
            }
        }

        this.activeWord = this.filteredWords[index];
        this._prevActiveWordId = this.activeWord?.id;
        this._lastActiveWordId = this.filteredWords[index]?.id;
        this.isError = false;
        this.enteredValue = '';
    }

    rotate() {
        this.isRotated = !this.isRotated;
    }

    private filterAction() {
        this.filteredWords = this._words.filter(word => word.categoryId === this.selectedCategoryId);
        this._lastActiveWordId = '';
    }

}
