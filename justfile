start: test
    electron .

test: prep
    node ./build/tests/unit.js

prep: 
    npm install
    gulp build