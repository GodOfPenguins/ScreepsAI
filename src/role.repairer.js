const globalVariables = require('util.globalVariables');
const roleUpgrader = require('role.upgrader');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let target = creep.memory.target;

        if (target == null){
            target = getTargetStructure(creep);
            if(target == null){ roleUpgrader.run(creep); }
        }
        if(target != null) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            if(target.hits == target.hitsMax){creep.memory.target = null; console.log("Wipe target")}
            else{ creep.memory.targetObj = target.id; console.log("Save Target")}
        }   
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.target = null;
            creep.memory.harvesting = true;
        }
    }
};

module.exports = roleRepairer;

function getTargetStructure(creep){
    let structures = creep.room.find(FIND_STRUCTURES).filter(s => s.hits < s.hitsMax);
    var highS = null;
    var highPriority = 0;
    for (let s in structures){
        let structure = structures[s];
        let p = getStructureValue(structure);
        if (p > highPriority){
            highPriority = p;
            highS = s;
        }
    }
    console.log("Priority: " + structures[highS])
    return structures[highS];
}

// Should rework some of the defensive structure values based on the percieved threat level of the room.
function getStructureValue(structure){
    type = structure.structureType;
    console.log(type);
    let hp = getStructureHitsRemaining(structure);
    let priority = 0.5;
    let val = getStructureTypeValue(type);
    switch(type){
        case STRUCTURE_CONTAINER:
            priority = standardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_EXTENSION:
            priority = standardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_RAMPART:
            priority = standardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_ROAD:
            priority = hp[1];
            break;
        case STRUCTURE_SPAWN:
            priority  = 2; // Like, seriously.
            break;
        case STRUCTURE_TOWER:
            priority = standardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_WALL:
            let thresh = 37500000
            hpWeight = hp[0] / (thresh * structure.room.controller.level);
            priority = standardPriorityFormula(val, hpWeight);
            break;
        default:
    }
    return priority
}

function getStructureHitsRemaining(structure){
    let hits = structure.hits;
    let max = structure.hitsMax;
    return [(max - hits), (hits / max)]; // [num, percent]
}

function standardPriorityFormula(val, hp){
    return val + ((1 - val) * hp);
}

function getStructureTypeValue(type){
    let val;
    switch(type){
        case STRUCTURE_CONTAINER:
            val = (structure.store.getUsedCapacity / structure.store.getCapacity());
            break;
        case STRUCTURE_EXTENSION:
            val = 0.5;
            break;
        case STRUCTURE_RAMPART:
            val = 0.75;
            break;
        case STRUCTURE_ROAD:
            val = 0.25;
            break;
        case STRUCTURE_SPAWN:
            val = 2;
            break;
        case STRUCTURE_TOWER:
            val = 0.75;
            break;
        case STRUCTURE_WALL:
            val = 0.25;
            break;
        default:
            val = 0.5;
            console.log(type + " has no defined weighting value.")
    }
    return val;

}