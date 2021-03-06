import {
    FIELD_SIZE,
    Field
} from '../libs/meta';

import {
    coordinatesToIndex,
    indexToCoordinates,
    getEmptyTileCoordinates
} from '../libs/utils';

const STATE_LENGTH = FIELD_SIZE * FIELD_SIZE;

describe('utils.coordinatesToIndex', () => {
    it('returns the correct results', () => {
        expect(coordinatesToIndex([0, 0])).toEqual(0);
        expect(coordinatesToIndex([0, 1])).toEqual(FIELD_SIZE);
        expect(coordinatesToIndex([1, 1])).toEqual(1 + 1 * FIELD_SIZE);
        expect(coordinatesToIndex([2, 2])).toEqual(2 + 2 * FIELD_SIZE);
        expect(coordinatesToIndex([FIELD_SIZE - 1, FIELD_SIZE - 1])).toEqual(STATE_LENGTH - 1);
    });
});

describe('utils.indexToCoordinates', () => {
    it('returns the correct results', () => {
        expect(indexToCoordinates(0)).toEqual([0, 0]);
        expect(indexToCoordinates(FIELD_SIZE)).toEqual([0, 1]);
        expect(indexToCoordinates(1 + 1 * FIELD_SIZE)).toEqual([1, 1]);
        expect(indexToCoordinates(2 + 2 * FIELD_SIZE)).toEqual([2, 2]);
        expect(indexToCoordinates(STATE_LENGTH - 1)).toEqual([FIELD_SIZE - 1, FIELD_SIZE - 1]);
    });
});

describe('utils.indexToCoordinates * indexToCoordinates', () => {
    it('returns the correct cross-results for all the indices', () => {
        for (let index = 0; index < STATE_LENGTH; index++) {
            expect(coordinatesToIndex(indexToCoordinates(index))).toEqual(index);
        }
    });
});

describe('utils.indexToCoordinates * indexToCoordinates', () => {
    it('returns the correct cross-results for all the coordinates', () => {
        for (let x = 0; x < FIELD_SIZE; x++) {
            for (let y = 0; y < FIELD_SIZE; y++) {
                expect(indexToCoordinates(coordinatesToIndex([x, y]))).toEqual([x, y]);
            }
        }
    });
});

describe('generator.getEmptyTileCoordinates', () => {
    const fieldWithEmptyAt11: Field = [
        1, 2, 3, 4,
        5, undefined, 6, 7,
        8, 9, 10, 11,
        12, 13, 14, 15
    ];

    it('generator.returns the correct value', () => {
        expect(getEmptyTileCoordinates({field: fieldWithEmptyAt11})).toEqual([1, 1]);
    });
});
