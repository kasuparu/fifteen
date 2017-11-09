import {
    State,
    Field,
    FIELD_SIZE,
    Coordinates
} from '../libs/index';

export const coordinatesToIndex = (coordinates: Coordinates): number => {
    return coordinates[0] + coordinates[1] * FIELD_SIZE;
};

export const indexToCoordinates = (index: number): [number, number] => {
    return [index % FIELD_SIZE, Math.floor(index / FIELD_SIZE)];
};

export const swapInPlace = (field: Field, index: number, swapWithIndex: number): void => {
    let temp = field[index];
    field[index] = field[swapWithIndex];
    field[swapWithIndex] = temp;
};

export const getEmptyTileCoordinates = (state: State): Coordinates => {
    return indexToCoordinates(getEmptyTileIndex(state.field));
};

export const getEmptyTileIndex = (field: Field): number => {
    return field.indexOf(undefined);
};
