var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep){
        if(creep.store[RESOURCE_ENERGY] > 0){

        }
    }        
}

module.exports = roleHauler;

function getTargetByPriority(creep){
    creep.room.find(FIND_STRUCTURES)
}