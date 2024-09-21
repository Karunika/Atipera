import { Component, inject, model, Pipe, PipeTransform } from '@angular/core'
import { NgFor } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { EditDialog } from './edit-dialog/edit-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider'
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

interface PeriodicElement {
    position: number,
    name: string,
    weight: number,
    symbol: string
}

interface Query {
    name: string,
    weight: [number, number],
    symbol: string
}


@Pipe({
    name: 'nameQueryFilter',
    standalone: true
})
export class NameQueryFilter implements PipeTransform {
    transform(elements: PeriodicElement[], query: Query) {
        return elements.filter((element) => 
            element.name.startsWith(query.name)
            && element.weight >= query.weight[0]
            && element.weight <= query.weight[1]
            && element.symbol.startsWith(query.symbol)
        )
    }
}

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    standalone: true,
    imports: [
        NgFor,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSliderModule,
        NameQueryFilter,
    ]
})
export class ListComponent {
    readonly ELEMENT_DATA = model<PeriodicElement[]>([
        { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
        { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
        { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
        { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
        { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
        { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
        { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    ]);
    readonly query = model<Query>({
        name: '',
        weight: [0, 100],
        symbol: '',
    })
    debouncedQuery: Query = this.query()

    dialog = inject(MatDialog)

    constructor() {
        toObservable(this.query)
            .pipe(debounceTime(2000), distinctUntilChanged())
            .subscribe(value => {
                this.debouncedQuery = value
            });
    }

    onInputChange(property: keyof Query, event: Event, which?: number) {
        const inputValue = (event.target as HTMLInputElement).value;
        console.log('changing', inputValue)

        this.query.update((previous: Query) => {
            if (property !== 'weight') {
                return {
                    ...previous,
                    [property]: inputValue
                };
            }

            if (typeof which === 'number') {
                const parsedValue = parseInt(inputValue, 10);

                if (isNaN(parsedValue)) {
                    return previous;
                }

                return {
                    ...previous,
                    weight: previous.weight.map((v, i) =>
                        i === which ? parsedValue : v
                    ) as [number, number]
                };
            }

            return previous;
        })
    }

    openEditDialog(element: PeriodicElement) {
        const dialogRef = this.dialog.open(EditDialog, {
            data: { ...element }
        })

        dialogRef.afterClosed().subscribe((editedElement) => {
            if (editedElement !== undefined) {
                this.ELEMENT_DATA.update(element_data => (
                    element_data.map((element) => (
                        editedElement.position === element.position ?
                            { ...editedElement } : element
                    ))
                ))
            }
        })
    }
}
