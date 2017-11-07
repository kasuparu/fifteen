import {
    FIELD_WIDTH,
    FIELD_HEIGHT
} from '../libs/index';

import {
    generateState
} from '../libs/generator';

const STATE_LENGTH = FIELD_WIDTH * FIELD_HEIGHT;

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
