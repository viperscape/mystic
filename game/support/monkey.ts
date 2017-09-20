import fs = require("fs");
import path = require('path');
const THREE = require ("three"); //import THREE into namespace, 
                                 // use capitals to appease colladaloader syntax choice

export class Monkey {
    // NOTE: we may want bower if we are going to bundle this up
    CL = "ColladaLoader.js";

    constructor() {
        let _ = fs.readFileSync(path.join(__dirname, this.CL));
        eval(_.toString());
    }
}