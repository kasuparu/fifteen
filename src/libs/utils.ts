import {
    State,
    Field,
    FIELD_SIZE,
    Coordinates
} from '../libs/meta';

export const STATE_LENGTH = FIELD_SIZE * FIELD_SIZE;

export const coordinatesToIndex = (coordinates: Coordinates): number => {
    return coordinates[0] + coordinates[1] * FIELD_SIZE;
};

export const indexToCoordinates = (index: number): [number, number] => {
    return [index % FIELD_SIZE, Math.floor(index / FIELD_SIZE)];
};

export const indexToPosition = (index: number, tileSize: number) => {
    const coordinates = indexToCoordinates(index);
    return coordinates.map((coordinate) => coordinate * tileSize);
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
    return tileIndex(field, undefined);
};

export const tileIndex = (field: Field, tile: number): number => {
    return field.indexOf(tile);
};
