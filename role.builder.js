var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.memory.upgrading = false;
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        if(creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            let target = creep.room.find(FIND_SOURCES);
            if(creep.harvest(target[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;