import {
    State,
    Field,
    FIELD_WIDTH,
    Coordinates
} from '../libs/index';

export const coordinatesToIndex = (coordinates: Coordinates): number => {
    return coordinates[0] + coordinates[1] * FIELD_WIDTH;
};

export const indexToCoordinates = (index: number): [number, number] => {
    return [index % FIELD_WIDTH, Math.floor(index / FIELD_WIDTH)];
};

export const swapInPlace = (field: Field, index: number, swapWithIndex: number): void => {
    let temp = field[index];
    field[index] = field[swapWithIndex];
    field[swapWithIndex] = temp;
};

export const getEmptyTileCoordinates = (state: State): Coordinates => {
    return indexToCoordinates(state.field.indexOf(undefined));
};
