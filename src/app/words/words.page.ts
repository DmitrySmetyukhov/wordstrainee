import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-words',
    templateUrl: './words.page.html',
    styleUrls: ['./words.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordsPage {
    expanded = true;

    constructor() {
    }

    togglePanel() {
        this.expanded = !this.expanded;
    }
}
