var roleTractor = {
    /** @param {Creep} creep **/
    run: function(creep){
            target = creep.memory.target;
            destination = creep.memory.target;
            if(target.memory.needTractor == false || target == null){
                creep.memory.target = getTarget();
                target = Game.getObjectById(creep.memory.target);
                creep.memory.destination = target.memory.target;
                destination = Game.getObjectById(creep.memory.destination);
            }
            if(creep.pos.isNearTo(target)){
                creep.move(destination);
                creep.pull(target);
                target.move(creep);
            }
            else{
                creep.move(target);
            }
            if(target.pos.isNearTo(destination)){
                target.memory.needTractor = false;
                creep.memory.target = null;
                creep.memory.destination = null;
            }
            if(!target){
                
            }

    }
}

module.exports = roleTractor;

function getTarget(creep){
    needTractor = creep.room.find(FIND_MY_CREEPS).filter(c=>c.memory.needTractor);
    target = creep.pos.findClosestByRange(needTractor).id;
    return target;
}