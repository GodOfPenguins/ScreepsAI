var roleHauler = {
    /** @param {Creep} creep **/
    run: function(creep){
        let targetResource = Game.getObjectById(creep.memory.targetResource)
        let destination = Game.getObjectById(creep.memory.destination)
        // If has capacity, then it needs to go get some resources. Otherwise, it needs to take the resources to appropriate storage
        // It would be nice to have some decision making about the efficacy of dropping off resources vs collecting more if partially full.
        
        

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

function findPriorityResource(creep){
    let resources = creep.room.find(FIND_DROPPED_RESOURCES);
    let haulers = _.filter(creep.room.find(FIND_MY_CREEPS), function(c) {if(c.memory.targetResource){return c.memory.targetsource}});
    let unclaimed = resources.filter(r => !haulers.includes(r));

}

function getFullness(){
    
}