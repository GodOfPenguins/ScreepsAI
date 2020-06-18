var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep){
        let target;
        if(creep.store[RESOURCE_ENERGY] > 0){
            target = getTargetByPriority(creep);
        }
        if (target){
            target.structureType = STRUCTURE_SPAWN || target.structureType == STRUCTURE_EXTENSION ? creep.transfer(target, RESOURCE_ENERGY):creep.moveTo(target);
            target.structureType = STRUCTURE_STORAGE || target.structureType == STRUCTURE_CONTAINER ? creep.transfer(target, _.findKey(creep.store)[0]):creep.moveTo(target);
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
    return target;
}