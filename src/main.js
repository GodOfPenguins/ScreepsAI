const getEnergy = require('util.sourceAllocator');
const bubBasicAI = require('ai.bubBasic');

var harvesters;
var upgraders;
var builders;
var bubs;
var bub2s;
var numBUBCreeps;
var numBUBmkiiCreeps
var numConSites;
var bubLevel = 0;

// Allocate some spots in Memory if they don't exist.
if (Memory.sourceAlloc == null){
    Memory.sourceAlloc = [0, 0, 0, 0];
}
if (Memory.beCommit == null){
    Memory.beCommit = 0;
}
if (Memory.heCommit == null){
    Memory.heCommit = 0;
}

module.exports.loop = function () {
    console.log(Game.time);
    var roomEnergyAvailable = Game.spawns['Spawn1'].room.energyAvailable;

    if((Game.time % 20) === 0){clearDeadCreeps()} 

    if(bubLevel === 0 && roomEnergyAvailable >= 550){
        bubLevel = 1;
    }

    const basicUtiltyBuild = [WORK, CARRY, MOVE]; // 200 points, "Bub" :D
    const basicUtiltyBuildmkII = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 550 points
    
    const defenderMKi = [ATTACK, ATTACK, MOVE, MOVE]; // 300 points
    
    // Variables for general state information
    numConSites = Object.keys(Game.constructionSites).length;
    numBUBCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB').length;
    numBUBmkiiCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUBmkII').length;
    bubs = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB');
    bub2s = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUBmkII')

    // Basic build logic. Need to rewrite into something more elegant.
    let currentSpawn = Game.spawns['Spawn1'];
    if(currentSpawn.spawning === null){
        if(numBUBCreeps < (currentSpawn.room.energyCapacityAvailable / 50) && bubLevel === 0 && currentSpawn.room.energyAvailable >= 200){ // 200 point BUBs
            let newName = 'BUBworker' + Game.time;
            console.log('Spawning new BUB: ' + newName);
            currentSpawn.spawnCreep(basicUtiltyBuild, newName,
                {memory: {role: null, harvesting: false, buildType: 'BUB'}});
        }
        if ((numBUBmkiiCreeps + (numBUBCreeps / 2)) < (currentSpawn.room.energyCapacityAvailable / 100) && bubLevel === 1 && currentSpawn.room.energyAvailable >= 550){ // 550 point BUBs
            let newName = 'BUB Mk.II' + Game.time;
            console.log('Spawning new BUB: ' + newName);
            currentSpawn.spawnCreep(basicUtiltyBuild, newName,
                {memory: {role: null, harvesting: false, buildType: 'BUBmkII'}});
        }
    }
    
    // Run the creep AI
    for (let name in Game.creeps){
        let creep = Game.creeps[name];
        if (creep.spawning == false){
            if (creep.memory.buildType == ('BUB' || 'BUBmkII')){
                bubBasicAI.run(creep);            
            }
        }
    }
    
} 

function getBuBRoles(){ // This is a helper function to get how many BUBs are working in each role.
    harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log("BUB role allocation: " + harvesters.length + ", " + upgraders.length+ ", " + builders.length)
}

function clearDeadCreeps(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}