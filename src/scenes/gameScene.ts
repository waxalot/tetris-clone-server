import { Scene } from "./scene";
import { Constants } from "../constants";
import { Board } from "../board";
import { Key } from "../key";
import { GameOptions } from "../gameOptions";
import { StonePosition } from "../stonePosition";
import { GameTypes } from "../gameTypes";

export class GameScene extends Scene {

    private gameType: GameTypes;

    private board: Board;
    private infoWidth: number;

    private isGameOver: boolean;
    private isPaused: boolean;

    private score: number;
    private level: number;
    private lines: number;
    private high: number;

    private levelSpeedMS: number;
    private levelFrames: number[];
    private tickTimer: number;

    private readonly AFTER_START_DELAY_TIME_MS = 1000;
    private afterStartDelayTickTimer: number;

    private readonly KEYBOARD_SCANNING_TIME_MS = 100;
    private keyHelper: Key;
    private keyboardScanningTimer: number;

    private gameOptions: GameOptions;

    private previewWidth = 140;
    private previewHeight = 90;
    private previewPosX: number;
    private previewPosY: number;

    public constructor(canvas: HTMLCanvasElement, ctx: CanvasExt.CanvasRenderingContext2DExt, gameOptions: GameOptions) {
        super(canvas, ctx);

        this.gameOptions = gameOptions;

        this.initBoard();

        this.keyHelper = new Key();
        this.keyboardScanningTimer = this.KEYBOARD_SCANNING_TIME_MS;

        canvas.addEventListener('keyup', (e: KeyboardEvent) => { this.keyHelper.onKeyUp(e); }, false);
        canvas.addEventListener('keydown', (e: KeyboardEvent) => {

            if (this.isGameOver) {
                return;
            }

            if (e.keyCode === Key.p) {
                this.pause();
            } else if (!this.isPaused) {
                switch (e.keyCode) {
                    case Key.LEFT: {
                        this.board.moveStoneLeft();
                        this.keyHelper.onKeyDown(e);
                        break;
                    }
                    case Key.RIGHT: {
                        this.board.moveStoneRight();
                        this.keyHelper.onKeyDown(e);
                        break;
                    }
                    case Key.a: {
                        // Rotate CW
                        this.board.tryRotateCW();
                        break;
                    }
                    case Key.d: {
                        // Rotate CCW
                        this.board.tryRotateCCW();
                        break;
                    }
                    case Key.m: {
                        // Switch preview mode
                        this.gameOptions.showPreview = !this.gameOptions.showPreview;
                        break;
                    }
                    case Key.UP: {
                        // Instant down
                        this.board.instantDown();
                        break;
                    }
                    default: {
                        this.keyHelper.onKeyDown(e);
                        break;
                    }
                }
            }
        }, false);

        this.initLevelFrames();
        this.init();
    }

    private init() {
        this.gameType = this.gameOptions.gameType;

        switch (this.gameType) {
            case GameTypes.A: {
                this.initTypeA();
                break;
            }
            case GameTypes.B: {
                this.initTypeB();
                break;
            }
        }

        this.afterStartDelayTickTimer = this.AFTER_START_DELAY_TIME_MS;

        this.level = this.gameOptions.level;
        this.setLevel(this.level);
    }

    private initTypeA() {
        this.score = 0;
        this.lines = 0;
    }

    private initTypeB() {
        this.lines = 25;
        this.high = this.gameOptions.height;
    }

    public update = (dt: number) => {

        if (this.isGameOver) {
            return;
        }

        if (!this.isPaused) {
            // Keyboard input
            this.keyboardScanningTimer -= dt;
            if (this.keyboardScanningTimer <= 0) {
                this.handleKeyDown();

                this.keyboardScanningTimer = this.KEYBOARD_SCANNING_TIME_MS;
            }

            if (this.afterStartDelayTickTimer > 0) {
                this.afterStartDelayTickTimer -= dt;
            } else {
                // World tick
                this.tickTimer -= dt;
                if (this.tickTimer <= 0) {

                    if (!this.keyHelper.isDown(Key.DOWN)) {
                        // A game step can be performed
                        this.performWorldStep();
                    }

                    this.tickTimer = this.levelSpeedMS;
                }
            }
        }

    }

    private performWorldStep = () => {
        this.board.moveStoneDown();
    }

    private onGameOver = () => {
        this.isGameOver = true;
    }

    private onRemoveLines = (numberOfLines: number) => {

        switch (this.gameType) {
            case GameTypes.A: {
                this.lines += numberOfLines;

                let newLevel = Math.floor(this.lines / 10);
                if (newLevel > this.level) {
                    this.increaseLevel();
                }

                this.score += this.getScore(numberOfLines);

                break;
            }
            case GameTypes.B: {
                this.lines -= numberOfLines;
                if (this.lines < 0) {
                    this.lines = 0;
                }
                break;
            }
        }
    }

    private increaseLevel() {
        this.level++;
        this.setLevel(this.level);
    }

    private getScore(numberOfLines: number): number {
        let result: number = 0;

        switch (numberOfLines) {
            case 1: {
                result = 40 * (this.level + 1);
                break;
            }
            case 2: {
                result = 100 * (this.level + 1);
                break;
            }
            case 3: {
                result = 300 * (this.level + 1);
                break;
            }
            case 4: {
                result = 1200 * (this.level + 1);
                break;
            }
        }

        return result;
    }

    private handleKeyDown = () => {
        if (this.isGameOver) {
            return;
        }

        if (this.keyHelper.isDown(Key.LEFT) > 200) {
            this.board.moveStoneLeft();
        }
        if (this.keyHelper.isDown(Key.RIGHT) > 200) {
            this.board.moveStoneRight();
        }
        if (this.keyHelper.isDown(Key.DOWN)) {
            this.board.moveStoneDown();
        }
    }

    private initLevelFrames() {
        this.levelFrames = new Array<number>();
        this.levelFrames.push(53);
        this.levelFrames.push(49);
        this.levelFrames.push(45);
        this.levelFrames.push(41);
        this.levelFrames.push(37);
        this.levelFrames.push(33);
        this.levelFrames.push(28);
        this.levelFrames.push(22);
        this.levelFrames.push(17);
        this.levelFrames.push(11);
        this.levelFrames.push(10);
        this.levelFrames.push(9);
        this.levelFrames.push(8);
        this.levelFrames.push(7);
        this.levelFrames.push(6);
        this.levelFrames.push(6);
        this.levelFrames.push(5);
        this.levelFrames.push(5);
        this.levelFrames.push(4);
        this.levelFrames.push(4);
        this.levelFrames.push(3);
    }

    private setLevel(level: number): void {

        let tempFrames: number;
        if (level < this.levelFrames.length) {
            tempFrames = this.levelFrames[level];
        } else {
            tempFrames = this.levelFrames[this.levelFrames.length - 1];
        }

        this.levelSpeedMS = (1000 / 60) * tempFrames;
        this.tickTimer = this.levelSpeedMS;
    }

    private initBoard() {
        this.infoWidth = 200;

        this.board = new Board(this.gameOptions);
        this.board.gameOverCallback = this.onGameOver;
        this.board.removeLinesCallback = this.onRemoveLines;

        this.previewPosX = this.board.width + this.infoWidth * 0.5 - this.previewWidth * 0.5;
        this.previewPosY = this.board.height - this.previewHeight - 40;
    }

    private pause = () => {
        this.isPaused = !this.isPaused;
    }

}