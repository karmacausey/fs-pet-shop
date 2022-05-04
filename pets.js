var fs = require('fs');

//fs.writeFile("PATH/TO/FILE.type", YOUR_STRING_DATA, YOUR_CALLBACK_FUNCTION)
let arg = process.argv[2];
if (arg === 'read') {
    if (process.argv[3] !== undefined) {
        let recNum = process.argv[3];
        readAt(recNum);
    } else {
        read();
    }
} else if (arg === 'create') {
    if(process.argv.length === 6){
        create();
    } else {
        console.log("Usage: node pets.js create AGE KIND NAME");
    }    
} else if (arg === 'update'){
    if(process.argv.length === 7){
        update();
    } else {
        console.log("Usage: node pets.js update INDEX AGE KIND NAME");
    }
} else if (arg === 'destroy'){
    if(process.argv.length === 4){
        destroy();
    } else {
        console.log("Usage: node pets.js destroy INDEX");
    }
}
if (!arg) {
    console.log('Usage: node pets.js [read | create | update | destroy]')
}

function read() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error)
        } else {            
            let currentData = JSON.parse(data);
            console.log(currentData);            
        }
    });
}

function destroy() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error)
        } else {
            let currentData = JSON.parse(data);
            let destroyed = currentData.splice(process.argv[3],1);
            //console.log(currentData);                        
            let stringVar = JSON.stringify(currentData);
            fs.writeFile('pets.json', stringVar, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(destroyed);
                }
            })
        }
    });
}

function update() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error)
        } else {
            let currentData = JSON.parse(data);
            currentData[process.argv[3]].age = parseInt(process.argv[4]);
            currentData[process.argv[3]].kind = process.argv[5];
            currentData[process.argv[3]].name = process.argv[6];                               
            let stringVar = JSON.stringify(currentData);
            fs.writeFile('pets.json', stringVar, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(currentData[process.argv[3]]);
                }
            })
        }
    });
}

function create() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error)
        } else {
            let currentData = JSON.parse(data);
            //console.log(`currentData before object: ${currentData}`);
            const obj = {
                age: parseInt(process.argv[3]),
                kind: `${process.argv[4]}`,
                name: `${process.argv[5]}`
            }
            currentData.push(obj);            
            let stringVar = JSON.stringify(currentData);
            fs.writeFile('pets.json', stringVar, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(currentData[currentData.length-1]);
                }
            })
        }
    });
}

function readAt(num) {

    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error)
        } else {
            let log = JSON.parse(data)
            if (num < 0 || num > log.length - 1) {
                console.log('Usage: node pets.js read INDEX')
            } else {
                console.log(log[num])
            }
        }
    })
}


