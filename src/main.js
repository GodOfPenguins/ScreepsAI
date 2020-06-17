const bubBasicAI = require('ai.bubBasic');
const manageDead = require('util.clearDeadCreeps');
const spawnerManagement = require('util.spawnerLogic');
const roomMemory = require('util.allocRoomMemory');

var clearDeadInterval = 50; // How often dead creeps should be purged from memory

// Allocate some spots in Memory if they don't exist.




module.exports.loop = function () {
    console.log(Game.time);
    
    if(Memory.updateRoomMemorySettings != true){ roomMemory.allocRoomMemory() }
    if((Game.time % clearDeadInterval) === 0){manageDead.clearDeadCreeps()} 

    // Link to spawner logic
    for (let s in Game.spawns){
        spawnerManagement.spawnerLogic(Game.spawns[s]);
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
