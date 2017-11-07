import {
    State,
    FIELD_WIDTH,
    FIELD_HEIGHT
} from '../libs/index';

import {
    // validateMove,
    validateCoordinates,
    getMovingTileCoordinates,
    Move
} from '../libs/logic';

// TODO Make all the fixtures and tests agnostic to the field size

const stateWithEmptyAt11: State = {
    field: [
        1, 2, 3, 4,
        5, undefined, 6, 7,
        8, 9, 10, 11,
        12, 13, 14, 15
    ]
};

const stateWithEmptyAt00: State = {
    field: [
        undefined, 1, 2, 3,
        4, 5, 6, 7,
        8, 9, 10, 11,
        12, 13, 14, 15
    ]
};

const stateWithEmptyAt33: State = {
    field: [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, undefined
   ]
};

// describe('validateMove', () => {
//
// });

describe('logic.getMovingTileCoordinates', () => {
    it('returns mathematically correct tile coordinates of the 4 legal moves', () => {
        expect(getMovingTileCoordinates(stateWithEmptyAt11, Move.LEFT)).toEqual([2, 1]);
        expect(getMovingTileCoordinates(stateWithEmptyAt11, Move.RIGHT)).toEqual([0, 1]);
        expect(getMovingTileCoordinates(stateWithEmptyAt11, Move.UP)).toEqual([1, 2]);
        expect(getMovingTileCoordinates(stateWithEmptyAt11, Move.DOWN)).toEqual([1, 0]);
    });

    it('returns mathematically correct tile coordinates of the illegal moves', () => {
        expect(getMovingTileCoordinates(stateWithEmptyAt00, Move.RIGHT)).toEqual([-1, 0]);
        expect(getMovingTileCoordinates(stateWithEmptyAt00, Move.DOWN)).toEqual([0, -1]);

        expect(getMovingTileCoordinates(stateWithEmptyAt33, Move.LEFT)).toEqual([4, 3]);
        expect(getMovingTileCoordinates(stateWithEmptyAt33, Move.UP)).toEqual([3, 4]);
    });
});

describe('logic.validateCoordinates', () => {
    it('returns the coordinates within bounds are valid', () => {
        for (let x = 0; x < FIELD_WIDTH; x++) {
            for (let y = 0; y < FIELD_HEIGHT; y++) {
                expect(validateCoordinates([x, y])).toEqual(true);
            }
        }
    });

    it('returns the coordinates out of bounds are invalid', () => {
        for (let x = 0; x < FIELD_WIDTH; x++) {
            expect(validateCoordinates([x, -1])).toEqual(false);
            expect(validateCoordinates([x, FIELD_HEIGHT])).toEqual(false);
        }

        for (let y = 0; y < FIELD_HEIGHT; y++) {
            expect(validateCoordinates([-1, y])).toEqual(false);
            expect(validateCoordinates([FIELD_WIDTH, y])).toEqual(false);
        }
    });
});
