import { PeriodicElement } from "./PeriodicElement"
import { Query } from "./Query"

export interface AppState {
    elementData: PeriodicElement[],
    query: Query,
    debouncedQuery: Query,
    loading: boolean
}