const { before } = require("lodash");
const roleUpgrader = require("role.upgrader")

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
            roleUpgrader.run(creep);
        }
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }
    }
};

module.exports = roleHarvester;