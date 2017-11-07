
export const FIELD_WIDTH = 4;
export const FIELD_HEIGHT = 4;

export interface State {
    field: Field;
}

export type Field = number[];

export type Coordinates = [number, number];
