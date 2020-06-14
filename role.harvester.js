var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.upgrading = false;
        creep.memory.building = false;
        if(creep.store.getFreeCapacity() > 0) {
            /*
            let target = getNextSource.getNextSource();
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }*/
            creep.say('🔄 harvest');
            creep.memory.harvesting = true;
        }
        else {
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
        }
    }
};

module.exports = roleHarvester;