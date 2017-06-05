import { Engine } from "../engine/engine";

/**
 * The abstract base class for all scenes.
 * 
 * @export
 * @abstract
 * @class Scene
 */
export abstract class Scene {

    protected engine: Engine;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasExt.CanvasRenderingContext2DExt;
    
    public constructor(canvas: HTMLCanvasElement, ctx: CanvasExt.CanvasRenderingContext2DExt) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Reset all mouse information
        if (this.ctx && this.ctx.mouse) {
            this.ctx.mouse.clicked = false;
        }        
    }

    /**
     * The engine.
     * 
     * @param {Engine} engine 
     * 
     * @memberof Scene
     */
    public setEngine(engine: Engine) {
        this.engine = engine;
    }

    /**
     * Updates the scene.
     * 
     * @abstract
     * @param {number} dt 
     * 
     * @memberof Scene
     */
    public update = (dt: number) => {      
    };

}