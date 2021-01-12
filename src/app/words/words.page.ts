import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DataService} from '../shared/services/data.service';

@Component({
    selector: 'app-words',
    templateUrl: './words.page.html',
    styleUrls: ['./words.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordsPage {
    expanded = true;

    constructor(private dataService: DataService) {
    }

    togglePanel() {
        this.expanded = !this.expanded;
    }
}
