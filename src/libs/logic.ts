import {
    State,
    Field,
    Coordinates,
    FIELD_WIDTH,
    FIELD_HEIGHT
} from './index';

import {
    coordinatesToIndex,
    getEmptyTileCoordinates,
    swapInPlace
} from './utils';

export enum Move {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down'
}

export interface ValidatedMove {
    valid: boolean;
    emptyTileCoordinates: Coordinates;
    movingTileCoordinates: Coordinates;
}

export const performMove = (state: State, move: Move): State => {
    const newField: Field = [...state.field];
    const {valid, emptyTileCoordinates, movingTileCoordinates} = validateMove(state, move);

    if (valid) {
        swapInPlace(
            newField,
            coordinatesToIndex(emptyTileCoordinates),
            coordinatesToIndex(movingTileCoordinates)
        );
    }

    return {field: newField};
};

export const validateMove = (state: State, move: Move): ValidatedMove => {
    const emptyTileCoordinates = getEmptyTileCoordinates(state);
    const movingTileCoordinates = getMovingTileCoordinates(state, move);
    return {
        valid: validateCoordinates(movingTileCoordinates),
        emptyTileCoordinates,
        movingTileCoordinates
    };
};

export const getMovingTileCoordinates = (state: State, move: Move): Coordinates => {
    const emptyTileCoordinates = getEmptyTileCoordinates(state);
    switch (move) {
        case Move.LEFT:
            return [emptyTileCoordinates[0] + 1, emptyTileCoordinates[1]];
        case Move.RIGHT:
            return [emptyTileCoordinates[0] - 1, emptyTileCoordinates[1]];
        case Move.UP:
            return [emptyTileCoordinates[0], emptyTileCoordinates[1] + 1];
        case Move.DOWN:
            return [emptyTileCoordinates[0], emptyTileCoordinates[1] - 1];
        default:
            console.error('getMovingTileCoordinates illegal move');
            return undefined;
    }
};

export const validateCoordinates = (coordinates: Coordinates): boolean => {
    return coordinates &&
        coordinates[0] >= 0 &&
        coordinates[0] < FIELD_WIDTH &&
        coordinates[1] >= 0 &&
        coordinates[1] < FIELD_HEIGHT;
};
