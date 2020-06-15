function clearDeadCreeps(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            let creep = Memory.creeps[name];
            let role = creep.memory.role;
            let engVal = creep.store.getFreeCapacity((RESOURCE_ENERGY));
            switch (role){
                case 'harvester':
                    Memory.heCommit -= engVal;
                    break;
                case 'builder':
                    Memory.beCommit -= engVal;
                    break;
                case 'upgrader':
                    Memory.upCommit -= engVal;
                    break;
                case 'repairer':
                    Memory.rpCommit -= engVal;
                    break;
                default:
                    console.log(creep + "did not have a role")
            }
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
            /*
            for (let creep in Game.creeps){
                creep.say(getRandomMessage(creep, role));
            }
            */
        }
    }
}

module.exports = {
    clearDeadCreeps
}