import {
    State,
    Field
} from './index';

import {
    swapInPlace
} from './utils';

export const generateState = (length: number): State => {
    const field: Field = [...Array(length).keys()];
    field[0] = undefined;
    shuffleFieldInPlace(field);
    return {field};
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
