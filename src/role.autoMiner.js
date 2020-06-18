const { xor } = require("lodash");

var automatedMining = {
    /** @param {Creep} creep **/
    run: function(creep){
        let creepMem = creep.memory;
        let targetID = creep.memory.targetID;
        if(!targetID){
            creepMem.targetID = findTarget(creep);
            targetID = creepMem.targetID;
        }
        let target = Game.getObjectById(targetID);

        if(creep.pos.isNearTo(target)){
            mine(target, creep)
        }
    }
}

module.exports = automatedMining;

function findTarget(creep){
    let sources = creep.room.find(FIND_SOURCES);
    let miners = creep.room.find(FIND_MY_CREEPS).filter(c => c.role == 'autoMiner');
    let targets = [];
    for (let m in miners){
        let miner = miners[m];
        let target = Game.getObjectById(miner.target)
        if (target){
            targets.push(target);
        }
    }
    sources = sources.filter(source => !targets.includes(source));
    return creep.pos.findClosestByRange(sources).id;
}

function mine(target, creep){
    let result = creep.harvest(target)
    switch(result){
        case ERR_NOT_IN_RANGE:
            creepMem.needTractor = true;
            break;
        case ERR_NOT_ENOUGH_ENERGY:
            break;
        case OK:
            if(creepMem.needTractor = true){
                creepMem.needTractor = false;
            }
        default:
            console.log(creep + " qaS wanI\' taQ");
    }
}