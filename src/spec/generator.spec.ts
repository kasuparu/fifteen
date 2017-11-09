import {
    FIELD_SIZE,
    Field
} from '../libs/index';

import {
    generateState,
    getInversionCounts
} from '../libs/generator';

const STATE_LENGTH = FIELD_SIZE * FIELD_SIZE;

describe('generator.generateState', () => {
    const state = generateState(STATE_LENGTH);

    it('returns an array of given length', () => {
        expect(state.field.length).toEqual(STATE_LENGTH);
    });

    it('contains all the needed tiles once', () => {
        const tilesInOrder: number[] = [undefined];
        for (let tile = 1; tile < STATE_LENGTH; tile++) {
            tilesInOrder.push(tile);
        }

        const everyTileContainedOnce = tilesInOrder.every((tile) => {
            const tileOccurances = state.field.filter((stateTile) => stateTile === tile);
            return tileOccurances.length === 1;
        });

        expect(everyTileContainedOnce).toEqual(true);
    });
});

describe('generator.getInversionCounts', () => {
    const solvedField: Field = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, undefined];
    const solvableField: Field = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, undefined, 15];
    const unsolvableField1: Field = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, undefined];
    const unsolvableField2: Field = [13, 10, 11, 6, 5, 7, 4, 8, 1, 12, 14, 9, 3, 15, 2, undefined];

    it('returns correct results for the solved field', () => {
        expect(getInversionCounts(solvedField)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('returns correct results for solvable fields', () => {
        expect(getInversionCounts(solvableField)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
    });

    it('returns correct results for unsolvable fields', () => {
        expect(getInversionCounts(unsolvableField1)).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        expect(getInversionCounts(unsolvableField2)).toEqual([12, 9, 9, 5, 4, 4, 3, 3, 0, 3, 3, 2, 1, 1, 0, 0]);
    });
});
