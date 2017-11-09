import {
    State,
    Field,
    Coordinates,
    FIELD_SIZE
} from './index';

import {
    coordinatesToIndex,
    getEmptyTileCoordinates,
    swapInPlace
} from './utils';

import {
    getInversionsSum
} from './generator';

export interface ValidatedMove {
    valid: boolean;
    emptyTileCoordinates: Coordinates;
    movingTileCoordinates: Coordinates;
}

export const performMove = (state: State, movingTileCoordinates: Coordinates): State => {
    const newField: Field = [...state.field];
    const {valid, emptyTileCoordinates} = validateMove(state, movingTileCoordinates);

    if (valid) {
        swapInPlace(
            newField,
            coordinatesToIndex(emptyTileCoordinates),
            coordinatesToIndex(movingTileCoordinates)
        );
    }

    return {field: newField};
};

export const validateMove = (state: State, movingTileCoordinates: Coordinates): ValidatedMove => {
    const emptyTileCoordinates = getEmptyTileCoordinates(state);
    return {
        valid: areAdjacent(movingTileCoordinates, emptyTileCoordinates) &&
            validateCoordinates(movingTileCoordinates),
        emptyTileCoordinates,
        movingTileCoordinates
    };
};

export const areAdjacent = (tile1: Coordinates, tile2: Coordinates): boolean => {
    return Math.abs(tile1[0] - tile2[0]) + Math.abs(tile1[1] - tile2[1]) === 1;
};

export const validateCoordinates = (coordinates: Coordinates): boolean => {
    return coordinates &&
        coordinates[0] >= 0 &&
        coordinates[0] < FIELD_SIZE &&
        coordinates[1] >= 0 &&
        coordinates[1] < FIELD_SIZE;
};

export const isSolved = (state: State): boolean => {
    return getInversionsSum(state.field) === 0;
};
