function clearDeadCreeps(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            let creep = Memory.creeps[name];
            if (creep.role){
                let engVal = creep.buildType == 'BUB' ? 50:150
                switch (creep.role){
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
                }
            }
            else if (creep.harvesting == true){
                Memory.sourceAlloc[creep.targetSourceIndex]--;
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