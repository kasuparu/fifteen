import {
    State,
    FIELD_SIZE,
    Field
} from './meta';

import {
    getEmptyTileIndex,
    swapInPlace
} from './utils';

const STATE_LENGTH = FIELD_SIZE * FIELD_SIZE;

export const generateState = (): State => {
    let field: Field;
    do {
        field = generateField(STATE_LENGTH);
    } while (!isSolvable(field));
    return {field};
};

const generateField = (length: number): Field => {
    const field: Field = [...Array(length).keys()];
    field[0] = undefined;
    shuffleFieldInPlace(field);
    return field;
};

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffleFieldInPlace = (field: Field): void => {
    let index;
    let swapWithIndex;

    for (index = field.length - 1; index > 0; index -= 1) {
        swapWithIndex = Math.floor(Math.random() * (index + 1));
        swapInPlace(field, index, swapWithIndex);
    }
};

const isSolvable = (field: Field): boolean => {
    // http://mathworld.wolfram.com/15Puzzle.html
    // for the puzzle field to be solvavble, the inversion sum + row number of an empty square should be even
    return (getInversionsSum(field) + getEmptyTileRow(field)) % 2 === 0;
};

export const getInversionsSum = (field: Field): number => {
    return arraySum(getInversionCounts(field));
};

export const getInversionCounts = (fieldWithEmpty: Field): number[] => {
    const field = fieldWithEmpty.slice();

    // Disregard the empty tile
    field.splice(getEmptyTileIndex(field), 1);
    const length = field.length;

    const inversionCounts = field.map((tile, index) => {
        let inversionCount = 0;
        for (let index2 = index + 1; index2 < length; index2++) {
            if (tile > field[index2]) {
                inversionCount++;
            }
        }
        return inversionCount;
    });

    return inversionCounts;
};

const arraySum = (array: number[]): number => {
    return array.reduce((sum, element) => sum + element, 0);
};

const getEmptyTileRow = (field: Field): number => {
    return getEmptyTileIndex(field) % FIELD_SIZE + 1;
};
