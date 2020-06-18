// This AI version uses the worker with a static role, that falls back to other valid roles if it has nothing to do.
// The adaptive version was having issues with prioritizing things that really needed to be done.
// This will also make specialization easier at higher RCL.

const roleHarvester = require("role.harvester");
const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const sourceAllocator = require('util.sourceAllocator');
const globalVariables = require('util.globalVariables');
const roleRepairer = require("role.repairer");

// Once the task is completed, the BUB should report the task complete and remove the committed energy from the task cue
//Memory.heCommit; // Just making a note of them so I can find them later.
//Memory.beCommit;
//Memory.rpCommit;

var upgraders;
var builders;
var harvesters;
var repairers;

var bubBasicAI = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let creepMem = creep.memory;
        let isHarvesting = creepMem.harvesting;
       // If out of energy, and not already allocated to harvesting
       if(creep.store[RESOURCE_ENERGY] === 0 && creepMem.harvesting == false){
            creepMem.harvesting = true; // Set to harvest
            creepMem.targetSourceIndex = sourceAllocator.getNextSource(creep.room);
       }
       if (isHarvesting == true){
           let sources = creep.room.find(FIND_SOURCES); // Get the room sources and find target
           let target = sources[creepMem.targetSourceIndex];
           if(creep.harvest(target) == ERR_NOT_IN_RANGE){ // Try to harvest
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}}); // Move is not in range
            }
           if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){ // If at capacity, stop harvesting
               creepMem.harvesting = false;
            }
        }
        else if (creepMem.role){
            runRole(creep);
        }
    }
}

module.exports = bubBasicAI;

function runRole(creep){
    let role = creep.memory.role;
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
        case 'repairer':
            roleRepairer.run(creep);
            break;
        default:
            console.log(creep + ' has an undefined role.')
    }
}