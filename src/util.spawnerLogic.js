const { stubObject } = require("lodash");
const spawnType = require('util.spawnTypes');

var numHarvesters;
var numBuilders;
var numRepairers;
var numUpgraders;
var numTractors;
var numAlertFighters;
var numAutominers;
var numHaulers;
    
function spawnerLogic(spawn){
    let isSpawning = spawn.spawning == false;  

    if(!isSpawning){ // Block for immidiate needs
        let needTractor = spawn.room.find(FIND_MY_CREEPS).filter(c => c.memory.needTractor)
        getCreepsInRoom(spawn);

        if(numHarvesters == 0){spawnType.spawnBUB(spawn, 'harvester')}
        else if (numUpgraders == 0){ spawnType.spawnBUB(spawn, 'upgrader')}
        else if (numBuilders == 0){ spawnType.spawnBUB(spawn, 'builder')}
        else if (numRepairers == 0){ spawnType.spawnBUB(spawn, 'repairer')}
        else if (numAlertFighters < 2){ spawnType.spawnAlertFighter(spawn) }

    }
    
    isSpawning = spawn.spawning == false;  
    if(!isSpawning){
        let priority = getPriority(spawn);
        let rcl = spawn.room.controller.level;

        if(rcl < 3){
            spawnType.spawnBUB(spawn, priority);
        }

        if(rcl >= 3){
            switch(priority){
                case 'harvester':
                    spawnType.spawnAutominer(spawn);
                case 'hauler':
                    spawnType.spawnHauler(spawn);
                case 'builder':
                    spawnType.spawnBUB(spawn, priority);
                case 'upgrader':
                    spawnType.spawnBUB(spawn, priority);
            }
        }

    }
}

module.exports = {
    spawnerLogic
}

function scrambleAlertFighters(spawn){
    let newName = "'avwI'_" + Game.time;
    let engAv = spawn.room.energyAvailable;
    let body = [];
    if (engAv > 210){
        body.push(TOUGH)
        body.push(RANGED_ATTACK);
        body.push(MOVE)
    }
}

function getPriority(spawn){
    let workNeeded = getWorkNeeded(spawn);
    let val = 0;
    let priority = 0;
    for(i = 0; i < workNeeded.length; i++){
        if (workNeeded[i] > val){
            val = workNeeded[i];
        }
    }
    if (val > 0){
        switch (priority){
            case 0:
                return 'upgrader';  
            case 1:
                return 'harvester';
            case 2:
                return 'repairer';
            case 3:
                return 'builder';
            default:
                return null;

        }
    }
    else { return null; }
}

function getWorkNeeded(spawn){
    let upgradeNeed = getUpgradeNeed(spawn);
    let harvestNeed = getHarvestNeed(spawn);
    let repairNeed = getRepairNeed(spawn);
    let buildNeed = getBuildNeed(spawn);

    return [upgradeNeed, harvestNeed, repairNeed, buildNeed];
}

function getBuildNeed(spawn){
    let structs = spawn.room.find(FIND_CONSTRUCTION_SITES);

}

function getRepairNeed(spawn){
    let structs = spawn.room.find(FIND_STRUCTURES).filter(s => s != STRUCTURE_CONTROLLER && s.hits < s.hitsMax);
    let numTot = 0;
    let numMax = 0;
    for(let s in structs){
        let struct = structs[s];
        if (struct.buildType != STURCTURE_WALL){
            numTot += struct.hits;
            numMax += struct.hitsMax;
        }
        else{
            numTot += struct.hits / (8 - spawn.room.controller.level)
            numMax += struct.hits / (8 - spawn.room.controller.level)
        }
    }

    let val = (numRepairers * 1000)  / (numMax - numTot);

    return val; 
}

function getHarvestNeed(spawn){
    let roomStorageCap = spawn.room.energyCapacityAvailable;
    let val = (numHarvesters * 50) / (roomStorageCap * 0.75)

    return val;
}

function getUpgradeNeed(spawn){
    //let controllerUpgradeLevels = [0, 200, 45000, 135000, 405000, 1215000, 3645000, 10935000, 0];
    //let controllerMaxTicksToDown = [0, 20000, 10000, 20000, 40000, 80000, 120000, 150000, 200000];
    let ctrlLevel = spawn.room.controller.level;
    let val = 1 - ((numUpgraders * 1.5) / (ctrlLevel * 1.5))
}

function getCreepsInRoom(spawn){
    numHarvesters = 0;
    numBuilders = 0;
    numRepairers = 0;
    numUpgraders = 0;
    numTractors = 0;
    numAlertFighters = 0;
    numAutominers = 0;

    let creeps = spawn.room.find(FIND_MY_CREEPS)
    for (let c in creeps){
        incrementCreepTypeValues(creeps[c]);
    }
}

function incrementCreepTypeValues(creep){
        let role = creep.memory.role;
        let workParts = creep.getActiveBodyparts(WORK)
        let carryParts = creep.getActiveBodyparts(CARRY);

        switch(role){
            case 'harvester':
                numHarvesters += workParts;
                numHaulers += carryParts;
                break;
            case 'hauler':
                numHaulers += carryParts;
                break;
            case 'autoMiner':
                numHarvesters += workParts;
                break;
            case 'builder':
                numBuilders += workParts;
                break;
            case 'repairer':
                numRepairers += workParts;
                break;
            case 'upgrader':
                numUpgraders += workParts;
                break;
            case 'tractor':
                numTractors++;
                break;
            case 'alertFighter':
                numAlertFighters++;
            case 'autoMiner':
                numAutominers++;
                break;
            default:
                console.log(creep + " has an unknown role.")
        }
}


