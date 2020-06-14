var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.building = false;
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        /*
        else {
            let target = creep.room.find(FIND_SOURCES);
            if(creep.harvest(target[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } */
    }
};

module.exports = roleUpgrader;