import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../shared/services/data.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {
    private _subscription = new Subscription();

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this._subscription.add(this.dataService.categories$.subscribe(
            list => {
                console.log(list, 'categories');
            }
        ));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

}
