const globalVariables = require('util.globalVariables');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) =>{
                return (structure.hits < structure.hitsMax)
        }});
        if(targets.length > 0) {
            if (creep.memory.target == null){
                creep.memory.target = getTargetStructure();
            }
            else if (!_.filter(structure, [structure.id == creep.memory.target])){
                    creep.memory.target = getTargetStructure();
                }
            if(creep.build(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }   
        else{
            creep.memory.role = 'upgrader';
            Memory.rpCommit -= creep.store.getCapacity[RESOURCE_ENERGY];
        }    
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.role = null;
        }
    }
};

module.exports = roleRepairer;

function getTargetStructure(structures){
    var highS = null;
    var highPriority = 0;
    for (let s in structures){
        let strcture = strcutures[s];
        let p = getStructureValue(structure);
        if (p > highPriority){
            highPriority = p;
            highS = s;
        }
    }
    return structures[s].id;
}

// Should rework some of the defensive structure values based on the percieved threat level of the room.
function getStructureValue(structure){
    type = struture.structureType;
    let hp = getStructureHitsRemaining();
    let priority = 0.5;
    let val = globalVariables.getStructureTypeValue(structure);
    switch(type){
        case STRUCTURE_CONTAINER:
            priority = starndardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_EXTENSION:
            priority = starndardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_RAMPART:
            priority = starndardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_ROAD:
            priority = hp[1];
            break;
        case STRUCTURE_SPAWN:
            priority  = 2; // Like, seriously.
            break;
        case STRUCTURE_TOWER:
            priority = starndardPriorityFormula(val, hp[1])
            break;
        case STRUCTURE_WALL:
            let thresh = 37500000
            hpWeight = hp[0] / (thresh * creep.room.controller.level);
            priority = starndardPriorityFormula(val, hpWeight);
            break;
        default:
            console.log(structure + ' does not have a priority value.')
    }
    return priority
}

function getStructureHitsRemaining(structure){
    let hits = struture.hits;
    let max = structure.hitsMax;
    return [(max - hits), (hits / max)]; // [num, percent]
}

function starndardPriorityFormula(val, hp){
    val + ((1 - val) * hp);
}