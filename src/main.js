const getEnergy = require('util.sourceAllocator');
const bubBasicAI = require('ai.bubBasic');
const manageDead = require('util.clearDeadCreeps');
const spawnerManagement = require('util.spawnerLogic');

var harvesters;
var upgraders;
var builders;
var bubs;
var bub2s;
var numBUBCreeps;
var numBUBmkiiCreeps
var numConSites;
var bubLevel = 0;
var clearDeadInterval = 50; // How often dead creeps should be purged from memory

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

    if((Game.time % clearDeadInterval) === 0){manageDead.clearDeadCreeps()} 

    if(bubLevel === 0 && Game.spawns['Spawn1'].room.energyAvailable >= 550){
        bubLevel = 1;
    }

    
    // Variables for general state information
    numConSites = Object.keys(Game.constructionSites).length;
    numBUBCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB').length;
    numBUBmkiiCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUBmkII').length;
    bubs = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB');
    bub2s = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUBmkII')

    // Basic build logic. Need to rewrite into something more elegant.
    spawnerManagement.spawnerLogic();
    
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