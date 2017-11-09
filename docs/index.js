requirejs.config({
    bundles: {
        'libs': ['libs/index']
    }
});

requirejs(['libs/index'], (libs) => {
    let state = libs.generateState();

    const TILE_SIZE = 125; // px



    const updateTilePositions = (state) => {
        state.field.forEach((tile, index) => {
            if (tile === undefined) {
                return;
            }
            const position = libs.indexToPosition(index, TILE_SIZE)
            const element = document.getElementById('tile' + tile);
            element.style.left = position[0];
            element.style.top = position[1];
        })
    };

    const updateVictoryVisibility = (state) => {
        const elements = document.getElementsByClassName('victory');
        for (let index = 0; index < elements.length; index++) {
            elements[index].style.display = libs.isSolved(state) ? 'inherit' : 'none';
        }
    };

    const refreshAll = (state) => {
        updateTilePositions(state);
        updateVictoryVisibility(state);
    };

    const bindShuffle = () => {
        const elements = document.getElementsByClassName('shuffle');
        for (let index = 0; index < elements.length; index++) {
            elements[index].addEventListener('click', () => {
                state = libs.generateState();
                refreshAll(state);
            });
        }
    };

    const bindTiles = () => {
        const STATE_LENGTH = libs.FIELD_SIZE * libs.FIELD_SIZE;
        for (let tile = 1; tile < STATE_LENGTH; tile++) {
            const element = document.getElementById('tile' + tile);
            element.addEventListener('click', () => {
                state = libs.performMoveByTile(state, tile);
                refreshAll(state);
            });
        }
    };

    bindShuffle();
    bindTiles();
    refreshAll(state);
});
