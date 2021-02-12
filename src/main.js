var deadCreepCullingInterval = 51;
var creepRecalculationInterval = 24;
var optimalCreepCalculationInterval = 100;
var roomAuditInterval = 1500;
// var roomNeedCalculationInterval = 1;

const CREEP_TYPE_BUB = 0;
const CREEP_TYPE_TRACTOR = 1;
const CREEP_TYPE_MINER = 2;
const CREEP_TYPE_HAULER = 3;
const CREEP_TYPE_FIGHTER = 4;

const MISSION_MINING = 0;
const MISSION_UPGRADING = 1;
const MISSION_SPAWNING = 2;
const MISSION_REPAIRING = 3
const MISSION_TRACTORING = 4;
const MISSION_GATHERING = 5;
const MISSION_WAITING = 6;
const MISSION_SPAWN = 7;

module.exports.loop = function () {

    var time = Game.time;

    // Manage Rooms
    for (let name in Game.rooms){
        let room = Game.rooms[name];
        // Manage Room Memory
        if (!room.memory.creepRoledist){
            room.memory.creepRoleDist == [0, 0, 0, 0, 0];
            room.memory.optimalCreeps = [3, 1, 2, 2];
        }
        // Get creep counts
        if (time % creepRecalculationInterval == 0){
            room.memory.creepRoleDist = [0, 0, 0, 0, 0];

            let roomCreeps = room.find(FIND_MY_CREEPS);
            for (let i in roomCreeps){
                let creep = roomCreeps[i]
                switch (creep.memory.role) {
                    case CREEP_TYPE_BUB:
                        room.memory.creepRoleDist[CREEP_TYPE_BUB]++                        
                        break;
                    default:
                        break;
                }
            }
        }
    
        // Calculate the optimal creep distribution for the room
        if (time % optimalCreepCalculationInterval == 0){
            room.memory.optimalCreeps = [3, 1, 2, 2]
        }

        // Audit the room energy allocation to account for any dead creeps
        if (time % roomAuditInterval == 0){
            room.memory.energyAllocation = [];
        }
        
        room.memory.spawnNeed = 0;
    }

    // Manage Spawns
    for (let name in Game.spawns){
        let spawn = Game.spawns[name];

        let roomMem = spawn.room.memory;
        
        if (roomMem.creepRoleDist[CREEP_TYPE_BUB] < roomMem.optimalCreeps[CREEP_TYPE_BUB]){
            let returnValue = spawn.spawnCreep([WORK, MOVE, CARRY], "BUB" + time, {memory: {role: CREEP_TYPE_BUB, mission: MISSION_WAITING}});
            
            switch (returnValue) {
                case OK:
                    spawn.room.memory.creepRoleDist[CREEP_TYPE_BUB]++;
                    console.log("Meow?");
                    break;
                case ERR_BUSY:
                    break;
                case ERR_NOT_ENOUGH_ENERGY:
                    let need = 200 - spawn.store.getUsedCapacity(RESOURCE_ENERGY);
                    let creeps = spawn.room.find(FIND_MY_CREEPS);

                        for (let i = 0; i < creeps.length; ++i){
                            let creep = creeps[i];
                            let value = creep.store.getUsedCapacity();
                            if (value > 0){
                                creep.memory.mission = MISSION_SPAWN;
                                need -= value;
                            }
                            if (need <= 0){
                                break;
                            }
                        }
                    break;            
                default:
                    break;
            }            
        }
    }

    // Manage Creeps
    for (let name in Game.creeps){
        let creep = Game.creeps[name];

        if (creep.memory.mission == MISSION_WAITING){
            if (creep.store.getUsedCapacity() == 0){ creep.memory.mission = MISSION_MINING; creep.say("Mining!") }
            else {
                creep.memory.mission = MISSION_UPGRADING; creep.say("Upgrading!");
                
            }
        }

        if (creep.memory.mission == MISSION_MINING){
            let target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (creep.harvest(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
            else { 
                if (creep.store.getFreeCapacity() == 0){ 
                    creep.memory.mission = MISSION_WAITING; creep.say("Done!") }
            }
        }
        
        if (creep.memory.mission == MISSION_UPGRADING){
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller)
            }
            if (creep.store.getUsedCapacity() == 0) {creep.memory.mission = MISSION_WAITING; creep.say("Zzz...")}
        }
        
        if (creep.memory.mission == MISSION_SPAWN){
            let target = Game.spawns["Spawn1"];
            
            switch (creep.transfer(target, RESOURCE_ENERGY)) {
                case OK:
                    creep.memory.mission = MISSION_WAITING;
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case ERR_FULL:
                    creep.memory.mission = MISSION_UPGRADING;
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.mission = MISSION_WAITING;
                    break;
                default:
                    break;
            }
            
            if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){ creep.moveTo(Game.spawns["Spawn1"].pos); };
        }
    }
}