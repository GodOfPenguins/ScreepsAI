const basicUtiltyBuild = [WORK, CARRY, MOVE]; // 200 points, "Bub" :D
const basicUtiltyBuildmkII = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 550 points
const defenderMKi = [ATTACK, ATTACK, MOVE, MOVE]; // 300 points
var numBUBCreeps;
var numBUBmkiiCreeps;

numBUBCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB').length;
numBUBmkiiCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUBmkII').length;
    
function spawnerLogic(){
let currentSpawn = Game.spawns['Spawn1'];
    let isSpawning = currentSpawn.spawning == false;  
        if(!isSpawning){

        //General population level maintinance, based on energy

        if(numBUBCreeps < (currentSpawn.room.energyCapacityAvailable / 50) && currentSpawn.room.energyCapacityAvailable < 550 && currentSpawn.room.energyAvailable >= 200){ // 200 point BUBs
            spawnBUB(currentSpawn);
            break;
        }
        else if (((numBUBmkiiCreeps * 3) + numBUBCreeps) < (currentSpawn.room.energyCapacityAvailable / 50) && currentSpawn.room.energyCapacityAvailable >= 550 && currentSpawn.room.energyAvailable >= 550){ // 550 point BUBs
            spawnBUBmkII(currentSpawn);
            break;
        }
        
        // Address shortfalls
        
        adjNeed = getEnergyNeed(currentSpawn);


        if (adjNeed > 300 && currentSpawn.room.energyAvailable > 500){
            spawnBUBmkII(currentSpawn);  
            break;
        }
        else if (adjNeed > 150 && currentSpawn.room.energyAvailable >=300){
            spawnBUB(currentSpawn)    
            break;        
        }
        else if (currentSpawn.room.find(FIND_MY_CREEPS).length === 0 && currentSpawn.room.energyAvailable === 200){
            spawnBUB(currentSpawn);
            break;
        }      
    }
}

module.exports = {
    spawnerLogic
}

function spawnBUB(currentSpawn){
    newName = 'BUB' + Game.time;
    selectedBuild = basicUtiltyBuild;
    memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
    currentSpawn.spawnCreep(selectedBuild, newName, memoryOptions);
}

function spawnBUBmkII(currentSpawn){
    newName = 'BUB Mk.II' + Game.time;
    selectedBuild = basicUtiltyBuildmkII;
    memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUBmkII'}};
    currentSpawn.spawnCreep(selectedBuild, newName, memoryOptions)        
}

function getEnergyNeed(currentSpawn){
    // Energy collection need
    let hNeed = (currentSpawn.room.energyAvailable + Memory.heCommit - currentSpawn.room.energyCapacityAvailable);
    //Build need
    let bNeed = 0;
    let sites = currentSpawn.room.find(FIND_MY_CONSTRUCTION_SITES);
    for(let c in sites){bNeed += sites[c].progressTotal - sites[c].progress};
    if(isNaN(bNeed)){bNeed = 0}
    // Repair need
    let rNeed = 0;
    let structs = currentSpawn.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType != STRUCTURE_CONTROLLER)
    }});
    for(let s in structs){rNeed += structs[s].hitsMax - structs[s].hits};
    // Work cap of BUBs
    let bubEngCap = (numBUBCreeps + (numBUBmkiiCreeps * 3) ) * 50;

    return (hNeed + bNeed + rNeed) - bubEngCap;
}