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

// Once the task is completed, the BUB should report the task complete and remove the committed energy from the task cue
//Memory.heCommit; // Just making a note of them so I can find them later.
//Memory.beCommit;
//Memory.rpCommit;

var bubBasicAI = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let creepMem = creep.memory;
        let isHarvesting = creepMem.harvesting;
       // If out of energy, and not already allocated to harvesting
       if(creep.store[RESOURCE_ENERGY] === 0 && creepMem.harvesting == (false || null)){
            deCommitEng(creep); // I need to dynamically roll deCommitting in to energy expenditure so I can better account for it.
                                // If the creep is destroyed before disposing of its total energy, the commit amount will be off.
                                // Best might be to locally store the commit on the creep and then audit the numbers every few ticks.
            creepMem.harvesting = true; // Set to harvest
            creepMem.role = null; // Remove role
            creepMem.targetSourceIndex = getNextSource.getNextSource();
       }
       else if (isHarvesting == false && role == null){ // Else assign a role if it doesn't have one
            creepMem.role = determinePriorityRole(creep);
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
            runRole(creep);
        }
    }
}

module.exports = bubBasicAI;

function runRole(creep){
    role = creep.memory.role;
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

function deCommitEng(creep){
    let typeVal = creep.store.getCapacity();
    switch (role){
        case 'harvester':
            Memory.heCommit -= typeVal;
            break;
        case 'builder':
            Memory.beCommit -= typeVal;
            break;
        case 'upgrader':
            Memory.upCommit -= typeVal;
            break;
        case 'repairer':
            Memory.rpCommit -= typeval;
            break;
        default:
            console.log(creep + "was previously assigned an invalid role")
    }
}

function determinePriorityRole(creep){
    let harvestPriority = getHarvestPriority(creep);
    let buildPriority = getBuildPriority(creep);
    let upPriority = getUpdatePriority(creep);
    let repairPriority = getRepairPriority(creep);
    let priorities = [harvestPriority, buildPriority, upPriority];
    let highPriority = 0;
    let highIndex = 0;
    if ((harvestPriority && buildPriority) === 0){
        return 'upgrader'
    }
    for(let i = 0; i < priorities.length; i++){
        let val = priorities[i];
        if (val > highPriority){
            highPriority = val;
            highIndex = i;
        }
    }
    switch (highIndex){
        case 0:
            return 'harvester';
        case 1:
            return 'builder';
        case 2:
            return 'upgrader';
        case 3:
            return 'repairer'
        default:
            return null;
    }
}

function getHarvestPriority(creep){
    return (globalVariables.harvestNeeded - Memory.heCommit) / creep.room.energyCapacityAvailable;
}

function getUpdatePriority(creep){
    let upTicksPriority = Math.sin((creep.room.controller.ticksToDowngrade / 10000) * (Math.PI / 2))
    let upProgPriority = creep.room.controller.progress / creep.room.controller.progressTotal;
    return (0.75 * upTicksPriority) + (0.25 * upProgPriority);
}

function getBuildPriority(creep){
    return (globalVariables.buildVals[0] - Memory.beCommit) / globalVariables.buildVals[1];
}

function getRepairPriority(creep){
    return (globalVariables.repairVals[0] - (Memory.rpCommit / 100)) / globalVariables.repairVals[1];
}