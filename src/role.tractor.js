var roleTractor = {
    /** @param {Creep} creep **/
    run: function(creep){
            let target = creep.memory.target;
            if (target){target = Game.getObjectById(target)}
            let destination = creep.memory.destination;
            if(target == null){
                target = getTarget(creep);
                if (target){
                    creep.memory.target = target.id;
                    creep.memory.destination = target.memory.targetID;
                }
            }
            if(target && !destination){creep.memory.destination = target.memory.targetID}
            if(target && target.memory.needTractor == false){
                creep.memory.target = null;
            }
            if(target && creep.pos.isNearTo(target)){
                destination = Game.getObjectById(destination);
                creep.pos.isNearTo(destination) ? dropIt(creep, target) : pullIt(creep, target, destination);
            }
            else{
                creep.moveTo(target);
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
    let target;
    if (needTractor.length){
        target = creep.pos.findClosestByRange(needTractor);
    }
    return target;
}

function pullIt(creep, target, destination){
    creep.moveTo(destination);
    creep.pull(target);
    target.move(creep);
}

function dropIt(creep, target){
    creep.moveTo(target.pos);
    creep.pull(target);
    target.move(creep);
    target.memory.needTractor = false;
    creep.memory.target = null;
    creep.memory.destination = null;   
}