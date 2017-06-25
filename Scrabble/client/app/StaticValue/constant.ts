import { Letter } from '../GamePage/letter';

export enum ErrorCode {
    BORDER_ERROR = 0,
    CONFLICT_ERROR = 1,
    RACK_ERROR = 2,
    EXIST_ERROR = 3,
    RULE_ERROR = 4,
    OTHER_ERROR = 5,
    TURN_ERROR = 6
}

export const BLANK = 0;
export const STAR = 1;
export const X2LETTER = 12;
export const X3LETTER = 13;
export const X2WORD = 2;
export const X3WORD = 3;
export const EMPTY = 8;
export const TILE = 6;

export const RETRIEVE_DELAY = 3; //3 secondes
export const GRID_ROW_LENGTH = 15;
export const GRID_COL_LENGTH = 15;

export const BOARD: number[][] = [
    [3, 0, 0, 12, 0, 0, 0, 3, 0, 0, 0, 12, 0, 0, 3],
    [0, 2, 0, 0, 0, 13, 0, 0, 0, 13, 0, 0, 0, 2, 0],
    [0, 0, 2, 0, 0, 0, 12, 0, 12, 0, 0, 0, 2, 0, 0],
    [12, 0, 0, 2, 0, 0, 0, 12, 0, 0, 0, 2, 0, 0, 12],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 13, 0, 0, 0, 13, 0, 0, 0, 13, 0, 0, 0, 13, 0],
    [0, 0, 12, 0, 0, 0, 12, 0, 12, 0, 0, 0, 12, 0, 0],
    [3, 0, 0, 12, 0, 0, 0, 1, 0, 0, 0, 12, 0, 0, 3],
    [0, 0, 12, 0, 0, 0, 12, 0, 12, 0, 0, 0, 12, 0, 0],
    [0, 13, 0, 0, 0, 13, 0, 0, 0, 13, 0, 0, 0, 13, 0],
    [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [12, 0, 0, 2, 0, 0, 0, 12, 0, 0, 0, 2, 0, 0, 12],
    [0, 0, 2, 0, 0, 0, 12, 0, 12, 0, 0, 0, 2, 0, 0],
    [0, 2, 0, 0, 0, 13, 0, 0, 0, 13, 0, 0, 0, 2, 0],
    [3, 0, 0, 12, 0, 0, 0, 3, 0, 0, 0, 12, 0, 0, 3]
];

export const alphabets: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];

export const letterValues: number[] = [
    1, //a
    3, //b
    3, //c
    2, //d
    1, //e
    4, //f
    2, //g
    4, //h
    1, //i
    8, //j
    10, //k
    1, //l
    2, //m
    1, //n
    1, //o
    3, //p
    8, //q
    1, //r
    1, //s
    1, //t
    1, //u
    4, //v
    10, //w
    10, //x
    10, //y
    10 //z
];

export const KEY_ESCAPE = 27;

export interface LetterPosition {
    letter: Letter;
    row: number;
    col: number;
}
