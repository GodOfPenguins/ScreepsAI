// This should be a stable unit AI for the BUB line of workers
// The BUB should choose a role based on priority weighting of committed energy towards needed maintainance tasks
// The BUB should harvest enery from the Source from the least traffic
// Once full, the BUB should determine the priority of all tasks
// Based on the priority, the BUB should pick a task and report the energy that it is committing to the task

const roleHarvester = require("role.harvester");
const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const getNextSource = require('util.sourceAllocator');
const globalVariables = require('util.globalVariables');
const bubEngCommitVal = 50; // How much energy a BUB can commit with
const bubIIEngCommitVal = 150; // How much energy a BUBmkII can commit with

// Once the task is completed, the BUB should report the task complete and remove the committed energy from the task cue
var harvestEngCommit = Memory.heCommit; // Not really using these here, just making a note of them so I can find them later.
var buildEngCommit = Memory.beCommit;
var sourceAlloc = Memory.sourceAlloc;
var nextSource = Memory.nextSource[0];
// creep.memory.engCommitted is the amount of energy committed to the current role

var bubBasicAI = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let creepMem = creep.memory;
       // If out of energy, and not already allocated to harvesting
       if(creep.store[RESOURCE_ENERGY] === 0 && creepMem.harvesting == false){
            deCommitEng(creepMem);
            creepMem.harvesting = true; // Set to harvest
            creepMem.role = null; // Remove role
            creepMem.targetSourceIndex = getNextSource.getNextSource();
            creep.say('🔄 harvest');
       }
       else if (isHarvesting == false && role == null){ // Else assign a role if it doesn't have one

       }
       if (isHarvesting){
           let sources = creep.room.find(FIND_SOURCES); // Get the room sources and find target
           let target = sources[creep.memory.targetSourceIndex];
           if(creep.harvest(target) == ERR_NOT_IN_RANGE){ // Try to harvest
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}}); // Move is not in range
            }
           if (creep.store.getFreeCapacity === 0){ // If at capacity, stop harvesting
               creepMem.harvesting = false;
            }
        }
        else if (creepMem.role){
            switch (creepMem.role){
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

module.exports = bubBasicAI;

function getEngCommitVal(creepMem){
    let typeVal;
    switch (creepMem.buildType){
        case 'BUB':
            typeVal = bubEngCommitVal;
            break;
         case 'BUBmkII':
             typeVal = bubIIEngCommitVal;
             break;
         default:
             typeVal = bubEngCommitVal;
    }
    return typeVal;
}

function deCommitEng(creepMem){
    typeVal = getEngCommitVal(creepMem);
    switch (role){
        case 'harvester':
            Memory.heCommit -= typeVal;
            break;
        case 'builder':
            memory.beCommit -= typeVal;
            break;
    }
}

function determinePriorityRole(){
    let heNeed = globalVariables.harvestNeeded;
    let beNeed = globalVariables.buildNeeded;
 
}