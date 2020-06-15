var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.role = null;
        }
    }
};

module.exports = roleUpgrader;