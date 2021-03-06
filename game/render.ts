import Three = require("three");

export function render (target_gui) {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    let target = document.getElementById(target_gui);
}

export function init_3d(): Renderer {
    const ctx = new Three.WebGLRenderer({antialias:true, alpha:true});
    let canvas_ele = document.getElementById("canvas");
    canvas_ele.appendChild(ctx.domElement);

    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;

    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    
    const camera =
        new Three.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );
    
    const scene = new Three.Scene();
    scene.background = new Three.Color( 0x222222 );

    //scene.add(new Three.AmbientLight(0xffffff));
    
    scene.add(camera);
    ctx.setSize(WIDTH, HEIGHT);
    ctx.setPixelRatio(window.devicePixelRatio);
    ctx.gammaOutput = true;
    ctx.gammaInput = true;
    ctx.shadowMap.enabled = true;
    ctx.shadowMap.type = Three.PCFSoftShadowMap;
    
    return new Renderer(ctx,scene,camera);
}

export class Renderer {
    ctx;
    scene;
    camera;
    clock;
    delta;
    time;

    constructor(ctx,scene,camera) {
        this.ctx = ctx;
        this.scene = scene;
        this.camera = camera;
        this.clock = new Three.Clock();

        let timer = (time) => {
            requestAnimationFrame(timer);
            this.delta = this.clock.getDelta();
            this.time = time;
        };
        requestAnimationFrame(timer);
    }

    new(fn: (r:Renderer) => void): Renderable {
        return new Renderable(this,fn);
    }
}

export class ObjectRenderable {
    renderable: Renderable;
    mesh: Three.Mesh;
    raycaster: Three.Raycaster = new Three.Raycaster();

    load (path: string, cb?: ()=>void ) {
        let loader = new Three.JSONLoader();
        loader.load(path, (geometry, materials) => {
            this.mesh = new Three.Mesh(geometry, materials[0]);
            if (cb) cb();
        });
    }

    build (r:Renderer) {
        r.scene.add(this.mesh);
        this.renderable = r.new(function(){});
    }

    stop () {
        this.renderable.stop(this.mesh);
    }
}

export class Renderable {
    id: number;
    renderer: Renderer; // we can use this later for tweens, etc.
    fn: (r:Renderer) => void; // NOTE: this may become a map of functions to iterate

    constructor (r:Renderer, fn: (r:Renderer) => void) {
        this.fn = fn;
        this.renderer = r;

        let render = () => {
            this.id = requestAnimationFrame(render);  
            this.fn(r);
            r.ctx.render(r.scene, r.camera);
        };
        render();
    }
    stop(obj: Three.Mesh) { 
        if (this.id.constructor == Number) {
            cancelAnimationFrame(this.id);
            this.renderer.scene.remove(obj);
        }
    }
}