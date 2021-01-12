import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category, DataService} from '../shared/services/data.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
    categories: Category[] = [];
    categoryName = '';
    private _pending = false;
    private _duplicate = false;
    private _subscription = new Subscription();

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this._subscription.add(this.dataService.categories$.subscribe(
            list => {
                this.categories = list;
            }
        ));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    get addDisabled() {
        return !this.categoryName || this._pending || this._duplicate;
    }

    onModelChange() {
        this._duplicate = !!this.categories.find(cat => cat.name === this.categoryName);
    }

    async addCategory() {
        if (this.addDisabled) {
            return;
        }
        this._pending = true;
        await this.dataService.addCategory({
            name: this.categoryName
        });

        this._pending = false;
        this.categoryName = '';
    }
}
