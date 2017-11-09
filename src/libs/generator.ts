import {
    State,
    FIELD_SIZE,
    Field
} from './meta';

import {
    getEmptyTileIndex,
    swapInPlace
} from './utils';

export const generateState = (length: number): State => {
    let field: Field;
    do {
        field = generateField(length);
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

export const getInversionCounts = (field: Field): number[] => {
    const length = field.length;
    replaceFirst(field, undefined, length);

    const inversionCounts = field.map((tile, index) => {
        let inversionCount = 0;
        for (let index2 = index + 1; index2 < length; index2++) {
            if (tile > field[index2]) {
                inversionCount++;
            }
        }
        return inversionCount;
    });
    replaceFirst(field, length, undefined);

    return inversionCounts;
};

const arraySum = (array: number[]): number => {
    return array.reduce((sum, element) => sum + element, 0);
};

const getEmptyTileRow = (field: Field): number => {
    return getEmptyTileIndex(field) % FIELD_SIZE + 1;
};

const replaceFirst = (field: Field, find: number, replace: number) => {
    field.forEach((tile, index) => {
        if (tile === find) {
            field[index] = replace;
        }
    });
};
