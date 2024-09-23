import { Pipe, PipeTransform } from "@angular/core"
import { PeriodicElement } from "../interfaces/PeriodicElement"
import { Query } from "../interfaces/Query"

@Pipe({
    name: 'queryFilter',
    standalone: true
})
export class QueryFilter implements PipeTransform {
    transform(elements: PeriodicElement[], query: Query | null) {
        if (query === null) {
            return elements
        }

        return elements.filter((element) =>
            element.name.startsWith(query.name)
            && element.weight >= query.weight[0]
            && element.weight <= query.weight[1]
            && element.symbol.startsWith(query.symbol)
        )
    }
}
