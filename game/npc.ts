// NOTE: this might split out to monster & npc separately

import {ObjectRenderable,Renderable,Renderer} from "./render";
import Three = require("three");

export class NPC {
    ai: {}; // TODO: type of ai
    renderable: Renderable;

}


export class NPCRenderable implements ObjectRenderable {
    renderable: Renderable;
    mesh: Three.Mesh;
    raycaster = new Three.Raycaster();

}