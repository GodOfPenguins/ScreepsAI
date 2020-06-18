const basicUtiltyBuild = [WORK, CARRY, MOVE]; // 200 points, "Bub" :D
const basicUtiltyBuildmkII = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 550 points
const alertFighterII = [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK]; // 390 points
const alertFighter = [MOVE, MOVE, ATTACK, ATTACK]; // 280 points
const birdOfPreyI = [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];

var numBUBCreeps;
var numBUBmkiiCreeps;
var numAutoMinerCreeps;
var numTractorCreeps;
var tractorNeeded;
var numAlertFighters;
    
function spawnerLogic(spawn){
    let isSpawning = spawn.spawning == false;  

    if(!isSpawning){
        getCreepsInRoom(spawn)

        tractorNeeded? numTractorCreeps == 0? spawnTractor(spawn): null: null;
        
        let threat = spawn.room.memory.threatLevel;
        //General population level maintinance, based on energy

        if(numBUBCreeps < (spawn.room.energyCapacityAvailable / 50) && spawn.room.energyCapacityAvailable < 550 && spawn.room.energyAvailable >= 200){ // 200 point BUBs
            spawnBUB(spawn);
            return;
        }
        else if (((numBUBmkiiCreeps * 3) + numBUBCreeps) < (spawn.room.energyCapacityAvailable / 100) && spawn.room.energyCapacityAvailable >= 550 && spawn.room.energyAvailable >= 550){ // 550 point BUBs
            spawnBUBmkII(spawn);
            return;
        }

        if(numAutoMinerCreeps < spawn.room.find(FIND_SOURCES).length){
            spawnAutomatedMiner(spawn);
            return;
        }

        

        if (numAlertFighters < 2){
            spawnAlertFighter
        }

        // Address shortfalls
        
        let adjNeed = getEnergyNeed(spawn);

        if (adjNeed > 300 && spawn.room.energyCapacityAvailable > 500){
            spawnBUBmkII(spawn);  
            return;
        }
        else if (adjNeed > 150 && spawn.room.energyCapcityAvailable >=300){
            spawnBUB(spawn)    
            return;        
        }
        else if ((numBUBCreeps + numBUBmkiiCreeps) == 0 && spawn.room.energyAvailable >= 550){
            spawnBUBmkII(spawn);
            return;
        }
            else if ((numBUBCreeps + numBUBmkiiCreeps) == 0 && spawn.room.energyAvailable >= 200){
            spawnBUB(spawn);
            return;
        }

        
    }     
    
}

module.exports = {
    spawnerLogic
}

function spawnBUB(spawn){
    let newName = 'vumwI\'_' + Game.time;
    let selectedBuild = basicUtiltyBuild;
    let memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
    spawn.spawnCreep(selectedBuild, newName, memoryOptions);
}

function spawnBUBmkII(spawn){
    let newName = 'vumwI\'\'a\'_' + Game.time;
    let selectedBuild = basicUtiltyBuildmkII;
    let memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUBmkII'}};
    spawn.spawnCreep(selectedBuild, newName, memoryOptions)        
}

function spawnAutomatedMiner(spawn){
    let newName = "tlhIlwI\'_" + Game.time;
    engAv = spawn.room.energyAvailable;
    body = [];
    while (engAv >= 100){
        body.push(WORK);
    }
    memoryOptions = {memory: {role:'autoMiner', needTractor: true, buildType:'autoMiner'}};
    spawn.spawnCreep(body, newName, memoryOptions);    
}

function spawnTractor(spawn){
    let newName = "yuvwI\'_" + Game.time;
    let engAv = spawn.room.energyAvailable;
    let body = [];
    while (engAv >= 100){
        body.push(MOVE);
    }
    memoryOptions = {memory: {role:'tractor', target: null, destination:null, buildType:'tractor'}};
    spawn.spawnCreep(body, newName, memoryOptions);
}

function spawnAlertFighter(spawn){
    let newName = 'SuvwI\'_' + Game.time;
    let body = [];
    if (spawn.room.energyCapacityAvailable <= 300){
        body = alertFighter;
        type = 'alertFighterI'
    }
    else if (spawn.room.energyCapacityAvailable > 500){
        body = alertFighterII;
        type = 'alertFighterII'
    }
    memoryOptions = {memory: {role:'alertFighter', buildType: type}}
}

function getEnergyNeed(spawn){
    // Energy collection need
    let hNeed = (spawn.room.energyAvailable + Memory.heCommit - spawn.room.energyCapacityAvailable);
    //Build need
    let bNeed = 0;
    let sites = spawn.room.find(FIND_MY_CONSTRUCTION_SITES);
    for(let c in sites){bNeed += sites[c].progressTotal - sites[c].progress};
    if(isNaN(bNeed)){bNeed = 0}
    // Repair need
    let rNeed = 0;
    let structs = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType != STRUCTURE_CONTROLLER)
    }});
    for(let s in structs){rNeed += structs[s].hitsMax - structs[s].hits};
    // Work cap of BUBs
    let bubEngCap = (numBUBCreeps + (numBUBmkiiCreeps * 3) ) * 50;

    return (hNeed + bNeed + rNeed) - bubEngCap;
}

function scrambleAlertFighters(spawn){
    let newName = "'avwI'_";
    let engAv = spawn.room.energyAvailable;
    let body = []
    if (engAv > 200){
        
    }
}

function getCreepsInRoom(spawn){
    numBUBCreeps = 0;
    numBUBmkiiCreeps = 0;
    numAutoMinerCreeps = 0;
    numAlertFighters = 0;
    let creeps = spawn.room.find(FIND_MY_CREEPS);
    if (creeps.length > 0){
        for (let c in creeps){
            let type = creeps[c].memory.buildType;
            switch (type){
                case 'BUB':
                    numBUBCreeps++;
                    break;
                case 'BUBmkII':
                    numBUBmkiiCreeps++;
                    break;
                case 'autoMiner':
                    numAutoMinerCreeps++;
                    if(creeps.memory.needTractor = true){
                        tractorNeeded = true;
                    }
                case 'alertFighter':
                    numAlertFighters++;
                default:
                    console.log(creeps[c] + " is of an unknown Buildtype");
            }
        }
    }
}
