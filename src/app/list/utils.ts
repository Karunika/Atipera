import { Query } from "../../interfaces/Query";

// type Limit = 'upper' | 'lower'

export const updateQuery = (query: Query, property: string, value: unknown): Query => {

    if (!property.startsWith("weight")) {
        return {
            ...query,
            [property]: value
        };
    }

    const [_, limit] = property.split('-')
    const index = { 'upper': 1, 'lower': 0 }[limit]
    const parsedValue = parseInt(value as string, 10)

    if (isNaN(parsedValue)) {
        return { ...query }
    }

    return {
        ...query,
        weight: query.weight.map((v, i) =>
            i === index ? parsedValue : v
        ) as [number, number]
    };
}
