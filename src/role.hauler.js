var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep){
        if(creep.store[RESOURCE_ENERGY] > 0){

        }
    }        
}

module.exports = roleHauler;

function getTargetByPriority(creep){
    let target;
    if(creep.store.getUsedCapacity([RESOURCE_ENERGY])){
        let targets = creep.room.find(FIND_MY_STRUCTURES).filter(s => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.store.getFreeCapacity() > 0);
        targets? target = targets[0]:null;
    }
    else if(creep.store.getUsedCapacity() > 0){
        let targets = creep.room.find(FIND_MY_STRUCTURES).filter(s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store.getFreeCapacity > 0);
        target? target = targets[0]:null;
    }
}