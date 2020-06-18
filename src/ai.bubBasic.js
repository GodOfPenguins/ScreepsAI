// This should be a stable unit AI for the BUB line of workers
// The BUB should choose a role based on priority weighting of committed energy towards needed maintainance tasks
// The BUB should harvest enery from the Source from the least traffic
// Once full, the BUB should determine the priority of all tasks
// Based on the priority, the BUB should pick a task and report the energy that it is committing to the task

const roleHarvester = require("role.harvester");
const roleBuilder = require('role.builder');
const roleUpgrader = require('role.upgrader');
const sourceAllocator = require('util.sourceAllocator');
const globalVariables = require('util.globalVariables');
const roleRepairer = require("./role.repairer");

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
            deCommitEng(creep); // I need to dynamically roll deCommitting in to energy expenditure so I can better account for it.
                                // If the creep is destroyed before disposing of its total energy, the commit amount will be off.
                                // Best might be to locally store the commit on the creep and then audit the numbers every few ticks.
            creepMem.harvesting = true; // Set to harvest
            creepMem.role = null; // Remove role
            creepMem.targetSourceIndex = sourceAllocator.getNextSource(creep.room);
            console.log(creep + " targeting source " + creepMem.targetSourceIndex);
       }
       else if (isHarvesting == false && creepMem.role == null){ // Else assign a role if it doesn't have one
            creepMem.role = determinePriorityRole(creep);
            console.log(creep + " assigned to " + creepMem.role)
            commitEng(creep);
       }
       if (isHarvesting == true){
           let sources = creep.room.find(FIND_SOURCES); // Get the room sources and find target
           let target = sources[creepMem.targetSourceIndex];
           if(creep.harvest(target) == ERR_NOT_IN_RANGE){ // Try to harvest
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}}); // Move is not in range
            }
           if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0){ // If at capacity, stop harvesting
               creepMem.harvesting = false;
               creep.room.memory.sourceAlloc[creepMem.targetSourceIndex]--;
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

function deCommitEng(creep){
    let typeVal = creep.store.getCapacity();
    let role = creep.memory.role;
    let roomMem = creep.room.memory;
    switch (role){
        case 'harvester':
            roomMem.heCommit -= typeVal;
            break;
        case 'builder':
            roomMem.beCommit -= typeVal;
            break;
        case 'upgrader':
            roomMem.upCommit -= typeVal;
            break;
        case 'repairer':
            roomMem.rpCommit -= typeval;
            break;
        default:
            console.log(creep + "did not have a role");
    }
}

function commitEng(creep){
    let typeVal = creep.store.getCapacity();
    let role = creep.memory.role;
    let roomMem = creep.room.memory;
    switch (role){
        case 'harvester':
            roomMem.heCommit += typeVal;
            break;
        case 'builder':
            roomMem.beCommit += typeVal;
            break;
        case 'upgrader':
            roomMem.upCommit += typeVal;
            break;
        case 'repairer':
            roomMem.rpCommit += typeval;
            break;
        default:
            console.log(creep + "did not have a role")
    }
}

function determinePriorityRole(creep){
    let harvestPriority = getHarvestPriority(creep);
    let buildPriority = getBuildPriority(creep);
    let upPriority = getUpgradePriority(creep);
    let repairPriority = getRepairPriority(creep);
    let priorities = [harvestPriority, buildPriority, upPriority, repairPriority];
    getBuBRoles();
    console.log("Priorities: " + priorities);
    let highPriority = 0;
    let highIndex = 0;
    if (harvestPriority === 0 && buildPriority === 0){
        return 'upgrader'
    }
    else if((harvesters.length > 0 || builders.length > 0) && upgraders.length == 0 && repairPriority == 0){
        return 'upgrader'
    }
    else if(repairPriority > 0.5){
        return 'repairer'
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
    let engCap = creep.room.energyCapacityAvailable;
    let engAv = creep.room.energyAvailable;
    let need = engCap - engAv;
    return (need - creep.room.memory.heCommit) / engCap;
}

function getUpgradePriority(creep){ // This isn't right... I need to do something different.
    let controlLevel = creep.room.controller.level;
    let tickMax = globalVariables.ticksPerCtlrLevel[controlLevel];
    let ttD = creep.room.controller.ticksToDowngrade;
    let upTicksPriority = 1 - (Math.sin((ttD / tickMax) * (Math.PI / 2)));
    // let upProgPriority = creep.room.controller.progress / creep.room.controller.progressTotal;
    return (upTicksPriority);
}

function getBuildPriority(creep){
    let conSites = creep.room.find(FIND_CONSTRUCTION_SITES);
    let buildNeed = 0;
    let buildTot = 0
    for (let c in conSites){
        let p = conSites[c].progress;
        let t = conSites[c].progressTotal;
        buildNeed += (t - p);
        buildTot += t
    } 
    let priority = (buildNeed - creep.room.memory.beCommit) / buildTot;
    if (!isNaN(priority)){ //If there are no construction sites.
        return priority;
    }
    else{
        return 0;
    }
}

function getRepairPriority(creep){
    repairVals = getRepairVals(creep);
    let rpVal = repairVals[0] - (creep.room.rpCommit / 100) / repairVals[1];
    if (isNaN(rpVal)){
        return 0;
    }
    return rpVal;
}

function getBuBRoles(){ // This is a helper function to get how many BUBs are working in each role.
    let roomCreeps = creep.room.find(FIND_MY_CREEPS);
    harvesters = _.filter(roomCreeps, (creep) => creep.memory.role == 'harvester');
    upgraders = _.filter(roomCreeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(roomCreeps, (creep) => creep.memory.role == 'builder');
    repairers = _.filter(roomCreeps, (creep) => creep.memory.role == 'repairer');
    console.log("BUB role allocation: " + harvesters.length + ", " + upgraders.length+ ", " + builders.length, + ", " + repairers.length)
}

function getRepairVals(creep){
    let structures = creep.room.find(FIND_STRUCTURES);
    let hits = 0;
    let maxHits = 0;
    for (let s in structures){
        let struct = structures[s];
        hits += struct.hits;
        maxHits += struct.hitsMax;
    }
    return [hits, maxHits];
}