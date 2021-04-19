module.exports = { 
    run(spawn, creeps){
        if (!spawn.spawning && spawn.energyAvailable >= 300){
            if (creeps.length < 3){
                spawn.spawnCreep([MOVE, WORK, CARRY], "BUB" + time, {memory: {type: CREEP_TYPE_BUB, mission: MISSION_WAITING, target: null}})
                break;
            }
            else {
                let i = 0;
                let body = [];
                let miners = _.filter(creeps,function(o){return o.memory.type == CREEP_TYPE_MINER} )
                let targets = []

                for (let m in miners){
                    m.push(m.memory.target);
                }

                let freeSource = _.xor(targets, spawn.room.find(FIND_SOURCES));

                if(miners.length < 3){

                    while ((i + BODYPART_COST["work"]) < spawn.energyAvailable){
                        body.push[WORK];
                        i += BODYPART_COST["work"];
                    }

                    spawn.spawnCreep(body, "Miner" + time, {memory: {type: CREEP_TYPE_MINER, mission: MISSION_WAITING, target:freeSource}});
                    break;
                }
                let haulers = _.filter(creeps, function(o){return o.memory.type == CREEP_TYPE_HAULER})
                if (haulers.length < miners.length){
                    
                    while ( (i + BODYPART_COST["work"] + BODYPART_COST["move"]) < spawn.energyAvilable){
                        body.push(WORK);
                        body.push(MOVE);
                        i += BODYPART_COST["work"];
                        i += BODYPART_COST["move"];
                    }
                }
            }
        }
    }
}