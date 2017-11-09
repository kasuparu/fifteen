import {
    State,
    FIELD_SIZE,
    Coordinates
} from '../libs/index';

import {
    performMove,
    validateMove,
    validateCoordinates
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
const validMoves11: Coordinates[] = [
    [0, 1],
    [1, 0],
    [2, 1],
    [1, 2]
];
const invalidMoves11: Coordinates[] = [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3]
];

const stateWithEmptyAt33: State = {
    field: [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, undefined
    ]
};
const validMoves33: Coordinates[] = [
    [2, 3],
    [3, 2]
];
const invalidMoves33: Coordinates[] = [
    [4, 3],
    [3, 4]
];

describe('logic.performMove', () => {
    it('performs valid moves', () => {
        expect(performMove(stateWithEmptyAt33, validMoves33[0])).toEqual({
            field: [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, undefined, 15
            ]
        });

        expect(performMove(stateWithEmptyAt33, validMoves33[1])).toEqual({
            field: [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, undefined,
                13, 14, 15, 12
            ]
        });
    });

    it('does not perform invalid move', () => {
        invalidMoves33.forEach((invalidMove) => {
            expect(performMove(stateWithEmptyAt33, invalidMove)).toEqual(stateWithEmptyAt33);
        });
    });
});

// TODO performMove
describe('logic.validateMove', () => {
    it('returns valid moves', () => {
        validMoves11.forEach((validMove) => {
            expect(validateMove(stateWithEmptyAt11, validMove)).toEqual({
                valid: true,
                emptyTileCoordinates: [1, 1],
                movingTileCoordinates: validMove
            });
        });
    });

    it('returns invalid moves', () => {
        invalidMoves11.forEach((invalidMove) => {
            expect(validateMove(stateWithEmptyAt11, invalidMove)).toEqual({
                valid: false,
                emptyTileCoordinates: [1, 1],
                movingTileCoordinates: invalidMove
            });
        });
    });

    it('returns valid moves - out of bounds test', () => {
        validMoves33.forEach((validMove) => {
            expect(validateMove(stateWithEmptyAt33, validMove)).toEqual({
                valid: true,
                emptyTileCoordinates: [3, 3],
                movingTileCoordinates: validMove
            });
        });
    });

    it('returns invalid moves - out of bounds test', () => {
        invalidMoves33.forEach((invalidMove) => {
            expect(validateMove(stateWithEmptyAt33, invalidMove)).toEqual({
                valid: false,
                emptyTileCoordinates: [3, 3],
                movingTileCoordinates: invalidMove
            });
        });
    });
});

describe('logic.validateCoordinates', () => {
    it('returns the coordinates within bounds are valid', () => {
        for (let x = 0; x < FIELD_SIZE; x++) {
            for (let y = 0; y < FIELD_SIZE; y++) {
                expect(validateCoordinates([x, y])).toEqual(true);
            }
        }
    });

    it('returns the coordinates out of bounds are invalid', () => {
        for (let x = 0; x < FIELD_SIZE; x++) {
            expect(validateCoordinates([x, -1])).toEqual(false);
            expect(validateCoordinates([x, FIELD_SIZE])).toEqual(false);
        }

        for (let y = 0; y < FIELD_SIZE; y++) {
            expect(validateCoordinates([-1, y])).toEqual(false);
            expect(validateCoordinates([FIELD_SIZE, y])).toEqual(false);
        }
    });
});
