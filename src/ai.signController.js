var signController = {

    /** @param {Creep} creep **/
    run: function(creep) {
        controller = creep.room.controller;
        message = creep.memory.message;
        if(controller){
            if(creep.signController(controller, message) == ERR_NOT_IN_RANGE){
                creep.moveTo(controller);
            }
            else {
                creep.memory.signController = false;
            }
        }
    }
};

module.exports = signController;