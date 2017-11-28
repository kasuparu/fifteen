import {
    Field
} from '../libs/meta';

import {
    STATE_LENGTH
} from '../libs/utils';

import {
    generateState,
    getInversionCounts
} from '../libs/generator';

describe('generator.generateState', () => {
    const state = generateState();

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
        const counts = getInversionCounts(solvedField);
        expect(counts.length).toEqual(STATE_LENGTH - 1);
        expect(counts).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('returns correct results for solvable fields', () => {
        const counts = getInversionCounts(solvableField);
        expect(counts.length).toEqual(STATE_LENGTH - 1);
        expect(counts).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('returns correct results for unsolvable fields', () => {
        const counts1 = getInversionCounts(unsolvableField1);
        expect(counts1.length).toEqual(STATE_LENGTH - 1);
        expect(counts1).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        const counts2 = getInversionCounts(unsolvableField2);
        expect(counts2.length).toEqual(STATE_LENGTH - 1);
        expect(counts2).toEqual([12, 9, 9, 5, 4, 4, 3, 3, 0, 3, 3, 2, 1, 1, 0]);
    });
});
