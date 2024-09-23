import { Component, inject, model, Pipe, PipeTransform, signal } from '@angular/core'
import { AsyncPipe, NgFor } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { EditDialog } from './edit-dialog/edit-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider'
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, map, Subject, switchMap, tap } from 'rxjs';
import { rxState } from '@rx-angular/state';
import { PeriodicElement } from '../../interfaces/PeriodicElement';
import { Query } from '../../interfaces/Query';
import { AppState } from '../../interfaces/AppState';
import { QueryFilter } from '../../pipes/queryFilter';
import { COLUMNS, ELEMENT_DATA, QUERY } from '../../assets/data';
import { updateQuery } from './utils';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [
        NgFor,
        AsyncPipe,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatTableModule,
        MatIconModule,
        MatCardModule,
        // MatProgressBarModule,
        MatProgressSpinnerModule,
        QueryFilter,
    ]
})
export class ListComponent {
    readonly columns = COLUMNS

    private dialog = inject(MatDialog)

    inputChangeHandler = new Subject<Event>()
    clearQueryInput = new Subject<keyof Query>()
    editElementHandler = new Subject<PeriodicElement>()

    private state = rxState<AppState>(({ set, connect }) => {
        set({
            elementData: ELEMENT_DATA,
            query: QUERY,
            loading: false
        })

        connect('query', this.inputChangeHandler, ({ query }: AppState, event: Event) => {
            set({ loading: true })
            const input = event.target as HTMLInputElement;

            return updateQuery(query, input.id as keyof Query, input.value)
        })

        connect('query', this.clearQueryInput, ({ query }: AppState, property: keyof Query) => {
            return {
                ...query,
                [property]: QUERY[property]
            }
        })

        connect('elementData', this.editElementHandler, ({ elementData }: AppState, editedElement: PeriodicElement) => {
            return elementData.map((element: PeriodicElement) => (
                editedElement.position === element.position ?
                    { ...editedElement } : element
            ))
        })
    })

    elementData$ = this.state.select('elementData')

    query$ = this.state.select('query')
    name$ = this.query$.pipe(map(q => q.name))
    symbol$ = this.query$.pipe(map(q => q.symbol))
    lowerWeight$ = this.query$.pipe(map(q => q.weight[0]))
    upperWeight$ = this.query$.pipe(map(q => q.weight[1]))

    loading$ = this.state.select('loading')

    debouncedQuery$ = this.query$.pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        tap(() => this.state.set({ loading: false }))
    )

    openEditDialog(element: PeriodicElement) {
        const dialogRef = this.dialog.open(EditDialog, {
            data: { ...element },
            width: '50%'
        })

        dialogRef.afterClosed().pipe()
            .subscribe(this.editElementHandler)
    }
}
