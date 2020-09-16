const bubBasicAI = require('ai.bubBasic');
const manageDead = require('util.clearDeadCreeps');
const spawnerManagement = require('util.spawnerLogic');
const roomMemory = require('util.allocRoomMemory');
const calculateThreat = require('util.calculateThreat');
const signController = require('ai.signController');
const autoMiner = require('role.autoMiner');
const roleHauler = require('role.hauler');
const roleTractor = require('role.tractor');

var clearDeadInterval = 50; // How often dead creeps should be purged from memory

// Allocate some spots in Memory if they don't exist.




module.exports.loop = function () {
    console.log(Game.time);
    for (let r in Game.rooms){
        let room = Game.rooms[r];
        if(room.memory.updateRoomMemorySettings != false){roomMemory.allocRoomMemory(room)}
        //if(room.find(FIND_HOSTILE_CREEPS).length > 0){ room.memory.threatLevel = calculateThreat.calculateRoomThreat(room)}
    }
    if((Game.time % clearDeadInterval) === 0){manageDead.clearDeadCreeps()} 

    // Link to spawner logic
    for (let s in Game.spawns){
        spawnerManagement.spawnerLogic(Game.spawns[s]);
    }
    
    // Run the creep AI
    for (let name in Game.creeps){
        let creep = Game.creeps[name];
        if (creep.spawning == false){
            if (creep.memory.signController == true){
                signController.run(creep);
            }
            else if (creep.memory.buildType == 'BUB' || creep.memory.buildType == 'BUBmkII'){
                bubBasicAI.run(creep);            
            }
            else if (creep.memory.role == 'autoMiner'){
                autoMiner.run(creep);
            }
            else if (creep.memory.role == 'hauler'){
                roleHauler.run(creep);
            }
            else if (creep.memory.role == 'tractor'){
                roleTractor.run(creep);
            }
        }
    }
} 
