var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length > 0) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }   
        else{
            creep.memory.role = 'upgrader';
            Memory.beCommit -= creep.store.getCapacity[RESOURCE_ENERGY];
        }    
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.role = null;
        }
    }
};

module.exports = roleBuilder;