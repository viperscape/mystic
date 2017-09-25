import fs = require("fs");
import path = require('path');
const THREE = require ("three"); //import THREE into namespace, 
                                 // use capitals to appease colladaloader syntax choice


["ColladaLoader.js"].forEach(f => {
    let _ = fs.readFileSync(path.join(__dirname, f));
    eval(_.toString());
});