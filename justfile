start: test
    electron .

run:
    electron .

test: prep
    node ./build/tests/unit.js

prep: 
    npm install
    gulp build