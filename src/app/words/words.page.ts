import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../shared/services/data.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-words',
    templateUrl: './words.page.html',
    styleUrls: ['./words.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordsPage implements OnInit, OnDestroy {
    expanded = true;
    private _subscription = new Subscription();

    constructor(private dataService: DataService) {
    }

    ngOnInit(): void {
        this._subscription.add(this.dataService.words$.subscribe(wordsList => [
            console.log(wordsList, 'list')
        ]));
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    togglePanel() {
        this.expanded = !this.expanded;
    }
}
