var spawnOps = require('ops.spawn')

var roomAuditInterval = 1500;
var clearDeadCreepInterval = 150;
// var roomNeedCalculationInterval = 1;

const CREEP_TYPE_BUB = 0;
const CREEP_TYPE_TRACTOR = 1;
const CREEP_TYPE_MINER = 2;
const CREEP_TYPE_HAULER = 3;
const CREEP_TYPE_FIGHTER = 4;

const COMMIT_UPGRADE = 0;
const COMMIT_SPAWN = 0;
const COMMIT_BUILD = 0

const MISSION_MINING = 0;
const MISSION_UPGRADING = 1;
const MISSION_SPAWNING = 2;
const MISSION_REPAIRING = 3
const MISSION_TRACTORING = 4;
const MISSION_GATHERING = 5;
const MISSION_WAITING = 6;
const MISSION_BUILDING = 7;

module.exports.loop = function () {

    if (Game.time % clearDeadCreepInterval == 0){
        ClearDeadCreeps();
    }
    
    var time = Game.time;

    // Manage Rooms
    for (let name in Game.rooms){
        let room = Game.rooms[name];
        // Manage Room Memory
        if(!room.memory.engCommit){
            room.memory.engCommit = [0, 0, 0];
        }
        
        let spawns = room.find(FIND_MY_SPAWNS);
        let creeps = room.find(FIND_MY_CREEPS);
        let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        
        // Get the amount of energy in spawns

        let engNeed = room.energyCapacityAvailable - room.energyAvailable;
        let constructNeed = 0;

        for (site in constructionSites){
            constructNeed += (site.progressTotal - site.progress);
        }


        for (spawn in spawns){
            spawnOps.run(spawn, creeps);
        }

        creeps.sort(function(a, b) {return b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)})

        for (let creep in creeps){
            let role = creep.memory.role;
            switch (type) {
                case CREEP_TYPE_BUB:
                    BuBing(creep);
                    break;
                case CREEP_TYPE_FIGHTER:

                    break;
                case CREEP_TYPE_HAULER:
                    Hauler(creep);
                    break;
                case CREEP_TYPE_MINER:

                    break;
                case CREEP_TYPE_TRACTOR:

                    break;            
                default:
                    console.log("Undefined creep type.")
                    break;
            }
        }

        
        
    }
}

function ClearDeadCreeps(){
    for (var i in Memory.creeps){
        if (!Game.creeps[i]){
            creep = Memory.creeps[i];
            delete Memory.creeps[i];
        }
    }
}







