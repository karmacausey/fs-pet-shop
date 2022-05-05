const { Console } = require('console');
var fs = require('fs');

const logger = new Console({ stdout: process.stdout, stderr: process.stderr});
//Main Function tests for false inputs and calls other functions if appropriate
//gives error messages when user doesn't enter correct inputs
function main(){
let arg = process.argv[2];
if (arg === 'read') {
    if (process.argv.length === 4) {
        let index = process.argv[3];
        readAt(index);
    } else {
        read();
    }
} else if (arg === 'create') {
    if(process.argv.length === 6){
        create();
    } else {
        logger.error('Usage: node pets.js create AGE KIND NAME');
        process.exitCode = 1;
    }    
} else if (arg === 'update'){
    if(process.argv.length === 7){
        update();
    } else {
        logger.error("Usage: node pets.js update INDEX AGE KIND NAME");
        process.exitCode = 1;
    }
} else if (arg === 'destroy'){
    if(process.argv.length === 4){
        destroy();
    } else {
        logger.error("Usage: node pets.js destroy INDEX");
        process.exitCode = 1;
    }
}
if (!arg) {
    logger.error('Usage: node pets.js [read | create | update | destroy]')
    process.exitCode = 1;
}
}
main();

//will console log all of pets.json file
function read() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            logger.error(error)
            process.exitCode = 1;
        } else {            
            let currentData = JSON.parse(data);
            logger.log(currentData);            
        }
    });
}

//will destroy a record from pets.json based on the index passed in by user
function destroy() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            logger.error(error);
            process.exitCode = 1;
        } else {
            let currentData = JSON.parse(data);
            if(process.argv[3] < 0 || process.argv[3] > currentData.length -1){
                logger.error("Usage: node pets.js destroy INDEX")
                process.exitCode = 1;
            }else{
            let destroyed = currentData.splice(process.argv[3],1);
            //console.log(currentData);                        
            let stringVar = JSON.stringify(currentData);
            fs.writeFile('pets.json', stringVar, function (error) {
                if (error) {
                    logger.error(error)
                    process.exitCode = 1;
                } else {
                    logger.log(destroyed);
                }
            })
            }
        }
    });
}

//will update the fields in a specific record in the pets.json file
//based on the index and info passed in by user
function update() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            logger.error(error);
            process.exitCode = 1;
        } else {
            let currentData = JSON.parse(data);
            if(process.argv[3] < 0 || process.argv[3] > currentData.length-1){
                logger.error("Usage: node pets.js update INDEX AGE KIND NAME");
                process.exitCode = 1;
            }else{
            currentData[process.argv[3]].age = parseInt(process.argv[4]);
            currentData[process.argv[3]].kind = process.argv[5];
            currentData[process.argv[3]].name = process.argv[6];                               
            let stringVar = JSON.stringify(currentData);
            fs.writeFile('pets.json', stringVar, function (error) {
                if (error) {
                    logger.error(error);
                    process.exitCode = 1;
                } else {
                    logger.log(currentData[process.argv[3]]);
                }
            })
            }
        }
    });
}

//Creates and adds a new record to the pets.json file
function create() {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            logger.error(error);
            process.exitCode = 1;
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
                    logger.error(error);
                    process.exitCode = 1;
                } else {
                    logger.log(currentData[currentData.length-1]);
                }
            })
        }
    });
}

//reads back a specific record from the pets.json file based on the index passed by the user
function readAt(num) {
    fs.readFile('pets.json', 'utf8', function (error, data) {
        if (error) {
            logger.error(error);
            process.exitCode = 1;
        } else {
            let currentData = JSON.parse(data)
            if (num < 0 || num > currentData.length - 1) {
                logger.error('Usage: node pets.js read INDEX');
                process.exitCode = 1;
            } else {
                logger.log(currentData[num])
            }
        }
    })
}
