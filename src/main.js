const getEnergy = require('util.sourceAllocator');

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
    roomEnergyAvailablePercent = Game.spawns['Spawn1'].room.energyAvailable / Game.spawns['Spawn1'].room.energyCapacityAvailable;
    var roomEnergyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
    bubs = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB');
    bub2s = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUBmkII')

    // Basic build logic.
    let currentSpawn = Game.spawns['Spawn1'];
    if(currentSpawn.spawning === null){
        if(numBUBCreeps < (currentSpawn.room.energyCapacityAvailable / 50) && bubLevel === 0 && currentSpawn.room.energyAvailable >= 200){ // 200 point BUBs
            let newName = 'BUBworker' + Game.time;
            console.log('Spawning new BUB: ' + newName);
            currentSpawn.spawnCreep(basicUtiltyBuild, newName,
                {memory: {role: 'harvester', buildType: 'BUB'}});
        }
        if ((numBUBmkiiCreeps + (numBUBCreeps / 2)) < (currentSpawn.room.energyCapacityAvailable / 100) && bubLevel === 1 && currentSpawn.room.energyAvailable >= 550){ // 550 point BUBs
            let newName = 'BUB Mk.II' + Game.time;
            console.log('Spawning new BUB: ' + newName);
            currentSpawn.spawnCreep(basicUtiltyBuild, newName,
                {memory: {role: 'harvester', buildType: 'BUBmkII'}});
        }
    }

    // Allocate roles every 5 ticks.
    if ((Game.time % 5) === 0){
        allocateRoles();
    }
    
    // Run each creep according to its role.
    for (let name in Game.creeps){
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        if(creep.memory.harvesting == true){
            getEnergy.run(creep);
            continue;
        }
        else{
            switch (role){
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                default:
                    console.log(creep + ' has an undefined role.')
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

function allocateRoles(){
    // At some point -- soon -- I need to make more elegant calculations based on how much energy a BUB can actually harvest, 
    //and how much work/energy is needed for building and filling capacity. That'll be more expandable as I grow and introduce more build types into the fray. 
    let bubHarvNeed = Math.ceil((1 - roomEnergyAvailablePercent) * numBUBCreeps); // Harvesters are allocated based on how much (by percent) the room is empty on energy.
    let bubBuildNeed = Math.ceil(numConSites / 4); // Builders are allocated based on the number of empty build sites.

    for (let b in bubs){
        let bub = bubs[b];
        bub.memory.harvesting = false;
        bub.memory.building = false;
        bub.memory.upgrading = false;
        if (bubHarvNeed > 0){
            bub.memory.role = 'harvester';
            bubHarvNeed--;
        }
        else if (bubBuildNeed > 0){
            bub.memory.role = 'builder';
            bubBuildNeed--;
        }
        else{
            bub.memory.role = 'upgrader'
        }
    }
    getBuBRoles();
}

function clearDeadCreeps(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}