import pixi = require("pixi.js");
import three = require("three");


export function render (target_gui) {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    let target = document.getElementById(target_gui);

    const ctx_2d = new pixi.Application(WIDTH, HEIGHT, { transparent: true });
    target.appendChild(ctx_2d.view);

    

    draw_test(ctx_2d);
}

function draw_test(ctx) {
    let text = new pixi.Text('mystic',{fontFamily : 'Consolas', fontSize: 14, fill : 0x222222, align : 'center'});
    text.interactive = true;
    text.on('mousedown', (event) => {
        console.log(event)
     });
    ctx.stage.addChild(text);
}

export function init_3d(): Renderer {
    const ctx = new three.WebGLRenderer({antialias:true, alpha:true});
    document.body.appendChild(ctx.domElement);

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    
    const camera =
        new three.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );
    
    const scene = new three.Scene();
    
    scene.add(camera);
    ctx.setSize(WIDTH, HEIGHT);

    
    camera.position.y = 10;
    camera.position.x= 10;
    camera.position.z = 10;
    camera.lookAt(new three.Vector3(0,0,0));

    return new Renderer(ctx,scene,camera);
}

export class Renderer {
    ctx;
    scene;
    camera;
    clock;
    delta;

    constructor(ctx,scene,camera) {
        this.ctx = ctx;
        this.scene = scene;
        this.camera = camera;
        this.clock = new three.Clock();

        let timer = () => {
            requestAnimationFrame(timer);
            this.delta = this.clock.getDelta();
        };
        timer(); 
    }

    new(fn: (r:Renderer) => void): Renderable {
        return new Renderable(this,fn);
    }
}

export class Renderable {
    id: number;
    fn: (r:Renderer) => void;

    constructor (r:Renderer, fn: (r:Renderer) => void) {
        this.fn = fn;
        
        let render = () => {
            this.id = requestAnimationFrame(render);  
            this.fn(r);
            r.ctx.render(r.scene, r.camera);
        };
        render();
    }
    stop() { if (this.id.constructor == Number) cancelAnimationFrame(this.id); }
}