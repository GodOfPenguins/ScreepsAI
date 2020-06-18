var roleTractor = {
    /** @param {Creep} creep **/
    run: function(creep){
            let target = creep.memory.target;
            let destination = creep.memory.destination;
            if(target == null){
                creep.memory.target = getTarget(creep);
                target = creep.memory.target;
                creep.memory.destination = target.memory.targetID;
                destination = creep.memory.destination;
            }
            target ? target = Game.getObjectById(target):null;
            if(target != null && target.memory.needTractor == false){
                creep.memory.target = null;
            }
            if(target && creep.pos.isNearTo(target)){
                destination = Game.getObjectById(destination);
                creep.move(destination);
                creep.pull(target);
                target.move(creep);
            }
            else{
                creep.move(target);
            }
            if(target && target.pos.isNearTo(destination)){
                target.memory.needTractor = false;
                creep.memory.target = null;
                creep.memory.destination = null;
            }
    }
}

module.exports = roleTractor;

function getTarget(creep){
    let needTractor = creep.room.find(FIND_MY_CREEPS).filter(c=>c.memory.needTractor);
    let target = creep.pos.findClosestByRange(needTractor).id;
    return target;
}