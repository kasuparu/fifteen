define("libs/meta", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FIELD_SIZE = 4;
});
define("libs/utils", ["require", "exports", "libs/meta"], function (require, exports, meta_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.coordinatesToIndex = (coordinates) => {
        return coordinates[0] + coordinates[1] * meta_1.FIELD_SIZE;
    };
    exports.indexToCoordinates = (index) => {
        return [index % meta_1.FIELD_SIZE, Math.floor(index / meta_1.FIELD_SIZE)];
    };
    exports.indexToPosition = (index, tileSize) => {
        const coordinates = exports.indexToCoordinates(index);
        return coordinates.map((coordinate) => coordinate * tileSize);
    };
    exports.swapInPlace = (field, index, swapWithIndex) => {
        let temp = field[index];
        field[index] = field[swapWithIndex];
        field[swapWithIndex] = temp;
    };
    exports.getEmptyTileCoordinates = (state) => {
        return exports.indexToCoordinates(exports.getEmptyTileIndex(state.field));
    };
    exports.getEmptyTileIndex = (field) => {
        return exports.tileIndex(field, undefined);
    };
    exports.tileIndex = (field, tile) => {
        return field.indexOf(tile);
    };
});
define("libs/generator", ["require", "exports", "libs/meta", "libs/utils"], function (require, exports, meta_2, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const STATE_LENGTH = meta_2.FIELD_SIZE * meta_2.FIELD_SIZE;
    exports.generateState = () => {
        let field;
        do {
            field = generateField(STATE_LENGTH);
        } while (!isSolvable(field));
        return { field };
    };
    const generateField = (length) => {
        const field = [...Array(length).keys()];
        field[0] = undefined;
        shuffleFieldInPlace(field);
        return field;
    };
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    const shuffleFieldInPlace = (field) => {
        let index;
        let swapWithIndex;
        for (index = field.length - 1; index > 0; index -= 1) {
            swapWithIndex = Math.floor(Math.random() * (index + 1));
            utils_1.swapInPlace(field, index, swapWithIndex);
        }
    };
    const isSolvable = (field) => {
        // http://mathworld.wolfram.com/15Puzzle.html
        // for the puzzle field to be solvavble, the inversion sum + row number of an empty square should be even
        return (exports.getInversionsSum(field) + getEmptyTileRow(field)) % 2 === 0;
    };
    exports.getInversionsSum = (field) => {
        return arraySum(exports.getInversionCounts(field));
    };
    exports.getInversionCounts = (fieldWithEmpty) => {
        const field = fieldWithEmpty.slice();
        // Disregard the empty tile
        field.splice(utils_1.getEmptyTileIndex(field), 1);
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
    const arraySum = (array) => {
        return array.reduce((sum, element) => sum + element, 0);
    };
    const getEmptyTileRow = (field) => {
        return utils_1.getEmptyTileIndex(field) % meta_2.FIELD_SIZE + 1;
    };
});
define("libs/logic", ["require", "exports", "libs/meta", "libs/utils", "libs/generator"], function (require, exports, meta_3, utils_2, generator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.performMoveByTile = (state, tile) => {
        return exports.performMove(state, utils_2.indexToCoordinates(utils_2.tileIndex(state.field, tile)));
    };
    exports.performMove = (state, movingTileCoordinates) => {
        const newField = [...state.field];
        const { valid, emptyTileCoordinates } = exports.validateMove(state, movingTileCoordinates);
        if (valid) {
            utils_2.swapInPlace(newField, utils_2.coordinatesToIndex(emptyTileCoordinates), utils_2.coordinatesToIndex(movingTileCoordinates));
        }
        return { field: newField };
    };
    exports.validateMove = (state, movingTileCoordinates) => {
        const emptyTileCoordinates = utils_2.getEmptyTileCoordinates(state);
        return {
            valid: exports.areAdjacent(movingTileCoordinates, emptyTileCoordinates) &&
                exports.validateCoordinates(movingTileCoordinates),
            emptyTileCoordinates,
            movingTileCoordinates
        };
    };
    exports.areAdjacent = (tile1, tile2) => {
        return Math.abs(tile1[0] - tile2[0]) + Math.abs(tile1[1] - tile2[1]) === 1;
    };
    exports.validateCoordinates = (coordinates) => {
        return coordinates &&
            coordinates[0] >= 0 &&
            coordinates[0] < meta_3.FIELD_SIZE &&
            coordinates[1] >= 0 &&
            coordinates[1] < meta_3.FIELD_SIZE;
    };
    exports.isSolved = (state) => {
        return generator_1.getInversionsSum(state.field) === 0;
    };
});
define("libs/index", ["require", "exports", "libs/meta", "libs/logic", "libs/generator", "libs/utils"], function (require, exports, meta_4, logic_1, generator_2, utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FIELD_SIZE = meta_4.FIELD_SIZE;
    exports.performMoveByTile = logic_1.performMoveByTile;
    exports.isSolved = logic_1.isSolved;
    exports.generateState = generator_2.generateState;
    exports.indexToPosition = utils_3.indexToPosition;
});
define("spec/generator.spec", ["require", "exports", "libs/meta", "libs/generator"], function (require, exports, meta_5, generator_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const STATE_LENGTH = meta_5.FIELD_SIZE * meta_5.FIELD_SIZE;
    describe('generator.generateState', () => {
        const state = generator_3.generateState();
        it('returns an array of given length', () => {
            expect(state.field.length).toEqual(STATE_LENGTH);
        });
        it('contains all the needed tiles once', () => {
            const tilesInOrder = [undefined];
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
        const solvedField = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, undefined];
        const solvableField = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, undefined, 15];
        const unsolvableField1 = [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, undefined];
        const unsolvableField2 = [13, 10, 11, 6, 5, 7, 4, 8, 1, 12, 14, 9, 3, 15, 2, undefined];
        it('returns correct results for the solved field', () => {
            const counts = generator_3.getInversionCounts(solvedField);
            expect(counts.length).toEqual(STATE_LENGTH - 1);
            expect(counts).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
        it('returns correct results for solvable fields', () => {
            const counts = generator_3.getInversionCounts(solvableField);
            expect(counts.length).toEqual(STATE_LENGTH - 1);
            expect(counts).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        });
        it('returns correct results for unsolvable fields', () => {
            const counts1 = generator_3.getInversionCounts(unsolvableField1);
            expect(counts1.length).toEqual(STATE_LENGTH - 1);
            expect(counts1).toEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            const counts2 = generator_3.getInversionCounts(unsolvableField2);
            expect(counts2.length).toEqual(STATE_LENGTH - 1);
            expect(counts2).toEqual([12, 9, 9, 5, 4, 4, 3, 3, 0, 3, 3, 2, 1, 1, 0]);
        });
    });
});
define("spec/logic.spec", ["require", "exports", "libs/meta", "libs/logic"], function (require, exports, meta_6, logic_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // TODO Make all the fixtures and tests agnostic to the field size
    const stateWithEmptyAt11 = {
        field: [
            1, 2, 3, 4,
            5, undefined, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15
        ]
    };
    const validMoves11 = [
        [0, 1],
        [1, 0],
        [2, 1],
        [1, 2]
    ];
    const invalidMoves11 = [
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3]
    ];
    const stateWithEmptyAt33 = {
        field: [
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, undefined
        ]
    };
    const validMoves33 = [
        [2, 3],
        [3, 2]
    ];
    const invalidMoves33 = [
        [4, 3],
        [3, 4]
    ];
    describe('logic.performMove', () => {
        it('performs valid moves', () => {
            expect(logic_2.performMove(stateWithEmptyAt33, validMoves33[0])).toEqual({
                field: [
                    1, 2, 3, 4,
                    5, 6, 7, 8,
                    9, 10, 11, 12,
                    13, 14, undefined, 15
                ]
            });
            expect(logic_2.performMove(stateWithEmptyAt33, validMoves33[1])).toEqual({
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
                expect(logic_2.performMove(stateWithEmptyAt33, invalidMove)).toEqual(stateWithEmptyAt33);
            });
        });
    });
    // TODO performMove
    describe('logic.validateMove', () => {
        it('returns valid moves', () => {
            validMoves11.forEach((validMove) => {
                expect(logic_2.validateMove(stateWithEmptyAt11, validMove)).toEqual({
                    valid: true,
                    emptyTileCoordinates: [1, 1],
                    movingTileCoordinates: validMove
                });
            });
        });
        it('returns invalid moves', () => {
            invalidMoves11.forEach((invalidMove) => {
                expect(logic_2.validateMove(stateWithEmptyAt11, invalidMove)).toEqual({
                    valid: false,
                    emptyTileCoordinates: [1, 1],
                    movingTileCoordinates: invalidMove
                });
            });
        });
        it('returns valid moves - out of bounds test', () => {
            validMoves33.forEach((validMove) => {
                expect(logic_2.validateMove(stateWithEmptyAt33, validMove)).toEqual({
                    valid: true,
                    emptyTileCoordinates: [3, 3],
                    movingTileCoordinates: validMove
                });
            });
        });
        it('returns invalid moves - out of bounds test', () => {
            invalidMoves33.forEach((invalidMove) => {
                expect(logic_2.validateMove(stateWithEmptyAt33, invalidMove)).toEqual({
                    valid: false,
                    emptyTileCoordinates: [3, 3],
                    movingTileCoordinates: invalidMove
                });
            });
        });
    });
    describe('logic.validateCoordinates', () => {
        it('returns the coordinates within bounds are valid', () => {
            for (let x = 0; x < meta_6.FIELD_SIZE; x++) {
                for (let y = 0; y < meta_6.FIELD_SIZE; y++) {
                    expect(logic_2.validateCoordinates([x, y])).toEqual(true);
                }
            }
        });
        it('returns the coordinates out of bounds are invalid', () => {
            for (let x = 0; x < meta_6.FIELD_SIZE; x++) {
                expect(logic_2.validateCoordinates([x, -1])).toEqual(false);
                expect(logic_2.validateCoordinates([x, meta_6.FIELD_SIZE])).toEqual(false);
            }
            for (let y = 0; y < meta_6.FIELD_SIZE; y++) {
                expect(logic_2.validateCoordinates([-1, y])).toEqual(false);
                expect(logic_2.validateCoordinates([meta_6.FIELD_SIZE, y])).toEqual(false);
            }
        });
    });
});
define("spec/utils.spec", ["require", "exports", "libs/meta", "libs/utils"], function (require, exports, meta_7, utils_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const STATE_LENGTH = meta_7.FIELD_SIZE * meta_7.FIELD_SIZE;
    describe('utils.coordinatesToIndex', () => {
        it('returns the correct results', () => {
            expect(utils_4.coordinatesToIndex([0, 0])).toEqual(0);
            expect(utils_4.coordinatesToIndex([0, 1])).toEqual(meta_7.FIELD_SIZE);
            expect(utils_4.coordinatesToIndex([1, 1])).toEqual(1 + 1 * meta_7.FIELD_SIZE);
            expect(utils_4.coordinatesToIndex([2, 2])).toEqual(2 + 2 * meta_7.FIELD_SIZE);
            expect(utils_4.coordinatesToIndex([meta_7.FIELD_SIZE - 1, meta_7.FIELD_SIZE - 1])).toEqual(STATE_LENGTH - 1);
        });
    });
    describe('utils.indexToCoordinates', () => {
        it('returns the correct results', () => {
            expect(utils_4.indexToCoordinates(0)).toEqual([0, 0]);
            expect(utils_4.indexToCoordinates(meta_7.FIELD_SIZE)).toEqual([0, 1]);
            expect(utils_4.indexToCoordinates(1 + 1 * meta_7.FIELD_SIZE)).toEqual([1, 1]);
            expect(utils_4.indexToCoordinates(2 + 2 * meta_7.FIELD_SIZE)).toEqual([2, 2]);
            expect(utils_4.indexToCoordinates(STATE_LENGTH - 1)).toEqual([meta_7.FIELD_SIZE - 1, meta_7.FIELD_SIZE - 1]);
        });
    });
    describe('utils.indexToCoordinates * indexToCoordinates', () => {
        it('returns the correct cross-results for all the indices', () => {
            for (let index = 0; index < STATE_LENGTH; index++) {
                expect(utils_4.coordinatesToIndex(utils_4.indexToCoordinates(index))).toEqual(index);
            }
        });
    });
    describe('utils.indexToCoordinates * indexToCoordinates', () => {
        it('returns the correct cross-results for all the coordinates', () => {
            for (let x = 0; x < meta_7.FIELD_SIZE; x++) {
                for (let y = 0; y < meta_7.FIELD_SIZE; y++) {
                    expect(utils_4.indexToCoordinates(utils_4.coordinatesToIndex([x, y]))).toEqual([x, y]);
                }
            }
        });
    });
    describe('generator.getEmptyTileCoordinates', () => {
        const fieldWithEmptyAt11 = [
            1, 2, 3, 4,
            5, undefined, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15
        ];
        it('generator.returns the correct value', () => {
            expect(utils_4.getEmptyTileCoordinates({ field: fieldWithEmptyAt11 })).toEqual([1, 1]);
        });
    });
});
