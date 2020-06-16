const { before } = require("lodash");

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else{
            creep.memory.roll = 'upgrader'
            Memory.heCommit -= creep.store.getCapacity[RESOURCE_ENERGY]
        }
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.role = null;
        }
    }
};

module.exports = roleHarvester;