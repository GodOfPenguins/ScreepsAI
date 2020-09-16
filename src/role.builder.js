const roleUpgrader = require("./role.upgrader");

var roleUpgrader = require('role.upgrader');

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
            roleUpgrader.run(creep)
        }    
        if(creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }
    }
};

module.exports = roleBuilder;