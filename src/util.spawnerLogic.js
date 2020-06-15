const basicUtiltyBuild = [WORK, CARRY, MOVE]; // 200 points, "Bub" :D
const basicUtiltyBuildmkII = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 550 points
const defenderMKi = [ATTACK, ATTACK, MOVE, MOVE]; // 300 points
    
function spawnerLogic(){
let currentSpawn = Game.spawns['Spawn1'];
    let isSpawning = currentSpawn.spawning == false;

    
    if(!isSpawning){
        let spawnReady = false
        let newName = null;
        let selectedBuild = null;
        let memoryOptions = null;

        //General population level maintinance, based on energy

        if(numBUBCreeps < (currentSpawn.room.energyCapacityAvailable / 50) && bubLevel === 0 && currentSpawn.room.energyAvailable >= 200){ // 200 point BUBs
            spawnReady = true;
            newName = 'BUB' + Game.time;
            selectedBuild = basicUtiltyBuild;
            memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
        }
        else if (((numBUBmkiiCreeps * 3) + numBUBCreeps) < (currentSpawn.room.energyCapacityAvailable / 50) && bubLevel === 1 && currentSpawn.room.energyAvailable >= 550){ // 550 point BUBs
            spawnReady = true
            newName = 'BUB Mk.II' + Game.time;
            selectedBuild = basicUtiltyBuildmkII;
            memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
        }
        // Address shortfalls
        
        if(!spawnReady){
            let hNeed = (currentSpawn.room.energyCapacity - currentSpawn.energyCapacityAvailable - Memory.heCommit);
            let bNeed = 0;
            for(s in currentSpawn.room.find(FIND_MY_CONSTRUCTION_SITES)){bNeed += s.progressTotal - s.progress};
            if(isNaN(bNeed)){bNeed = 0}
            let rNeed = 0;
            for(s in currentSpawn.room.find(FIND_MY_STRUCTURES)){rNeed += s.hitsMax - s.hits};
            bubEngCap = (numBUBCreeps + (numBUBmkiiCreeps * 3) ) * 50;
            adjNeed = (hNeed + bNeed + rNeed) - bubEngCap;
            if (adjNeed > 300 && currentSpawn.room.energyCapacityAvailable > 500){
                spawnReady = true
                newName = 'BUB Mk.II' + Game.time;
                selectedBuild = basicUtiltyBuildmkII;
                memoryOptions = {memory: {role: null, harvesting: false, buildType: 'BUB'}};
            }
            else if (adjNeed > 150){
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

function calculateWorkShortfall(){
    
}