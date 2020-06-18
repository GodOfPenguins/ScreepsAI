var alertFighter ={
    /** @param {Creep} creep **/
    run: function(creep) {
        let enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        let target;
        if(enemies.length > 0){
            target = creep.pos.findClosestByPath(enemies);
        }
        if(target){
            if(creep.attack(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
        station = creep.memory.station;
        if(station && Game.getObjectById(station) != creep.room){
            room = Game.getObjectById(station).room.controller;
            controller = room.controller;
            flag = room.flag;
            controller ? target = controller : flag ? target = flag : null;
            target ? creep.moveTo(target) : null;
        }
    }
}

module.exports = alerFighter;