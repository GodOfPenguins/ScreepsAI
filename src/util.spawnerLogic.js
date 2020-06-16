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
    let spawnReady = false;
        if(!isSpawning){
        let newName = null;
        let selectedBuild = null;
        let memoryOptions = null;

        //General population level maintinance, based on energy

        if(numBUBCreeps < (currentSpawn.room.energyCapacityAvailable / 50) && currentSpawn.room.energyCapacityAvailable < 550 && currentSpawn.room.energyAvailable >= 200){ // 200 point BUBs
            spawnReady = true;
            newName = 'BUB' + Game.time;
            selectedBuild = basicUtiltyBuild;
            memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
        }
        else if (((numBUBmkiiCreeps * 3) + numBUBCreeps) < (currentSpawn.room.energyCapacityAvailable / 50) && currentSpawn.room.energyCapacityAvailable >= 550 && currentSpawn.room.energyAvailable >= 550){ // 550 point BUBs
            spawnReady = true
            newName = 'BUB Mk.II' + Game.time;
            selectedBuild = basicUtiltyBuildmkII;
            memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
        }
        // Address shortfalls
        
        if(!spawnReady){
            let hNeed = (currentSpawn.room.energyAvailable + Memory.heCommit - currentSpawn.room.energyCapacityAvailable);
            let bNeed = 0;
            let sites = currentSpawn.room.find(FIND_MY_CONSTRUCTION_SITES);
            for(let c in sites){bNeed += sites[c].progressTotal - sites[c].progress};
            if(isNaN(bNeed)){bNeed = 0}
            let rNeed = 0;
            let structs = currentSpawn.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType != STRUCTURE_CONTROLLER)
            }});
            for(let s in structs){rNeed += structs[s].hitsMax - structs[s].hits};
            let bubEngCap = (numBUBCreeps + (numBUBmkiiCreeps * 3) ) * 50;
            let adjNeed = (hNeed + bNeed + rNeed) - bubEngCap;
            if (adjNeed > 300 && currentSpawn.room.energyAvailable > 500){
                spawnReady = true
                newName = 'BUB Mk.II' + Game.time;
                selectedBuild = basicUtiltyBuildmkII;
                memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
            }
            else if (adjNeed > 150 && currentSpawn.room.energyAvailable >=300){
                spawnReady = true;
                newName = 'BUB' + Game.time;
                selectedBuild = basicUtiltyBuild;
                memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
            }
            else if (currentSpawn.room.find(FIND_MY_CREEPS).length === 0 && currentSpawn.room.energyAvailable === 200){
                spawnReady = true;
                newName = 'BUB' + Game.time;
                selectedBuild = basicUtiltyBuild;
                memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
            }
        }
            
        if (spawnReady == true){
            currentSpawn.spawnCreep(selectedBuild, newName, memoryOptions);
            console.log('Spawning new BUB: ' + newName);
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