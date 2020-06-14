const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

var harvesters;
var upgraders;
var builders;

module.exports.loop = function () {

    const basicUtiltyBuild = [WORK, CARRY, MOVE]
    
    // Variables for general state information
    getBuBRoles();
    var numConSites = Object.keys(Game.constructionSites).length
    var numBUBCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB').length;
    var roomEnergyAvailablePercent = Game.spawns['Spawn1'].room.energyAvailable / Game.spawns['Spawn1'].room.energyCapacityAvailable;
    var roomEnergyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
    
    // Console output for debugging and status monitoring
    console.log('Harvesters: ' + harvesters.length);
    console.log('Upgraders: ' + upgraders.length);
    console.log('Builders: ' + builders.length);
    console.log('Construction Sites: ' + numConSites)
    console.log('BUBs: ' + numBUBCreeps);
    console.log('Energy Available: ' + roomEnergyAvailable + ', ' + roomEnergyAvailablePercent);

    // Basic build logic, this creates one creep for every 50 energy available in the room. I have no basis to know if that's a good pace for expansion or not.
    if(numBUBCreeps < (roomEnergyAvailable / 50)) {
        let newName = 'BUBworker' + Game.time;
        console.log('Spawning new BUB: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(basicUtiltyBuild, newName,
            {memory: {role: 'harvester', buildType: 'BUB'}});
    }

    {
        // At some point -- soon -- I need to make more elegant calculations based on how much energy a BUB can actually harvest, 
        //and how much work/energy is needed for building and filling capacity. That'll be more expandable as I grow and introduce more build types into the fray. 
        let bubHarvNeed = Math.ceil((1 - roomEnergyAvailablePercent) * numBUBCreeps); // Harvesters are allocated based on how much (by percent) the room is empty on energy.
        let bubBuildNeed = Math.ceil(numConSites / 4); // Builders are allocated based on the number of empty build sites.
        let harvAlloc = [];
        let buildAlloc = [];
        let diffHarv = harvesters.length - bubHarvNeed;
        let diffBuild =  builders.length - bubBuildNeed;
        if(diffHarv > 0){
            while (diffHarv > 0){ // If more harvesters than needed
                i = 0;
                for(h in harvesters){
                    while(i < bubHarvNeed){
                        i++;
                    }
                    if (diffBuild < 0){
                        h.role.memory = 'builder';
                        diffBuild++
                    }
                    else{
                        h.role.memory = 'updater';
                    }  
                }
            }
        getBuBRoles();
        }
        else if(diffHarv < 0){
            while (diffHarv < 0){ // If fewer harvesters than needed
                let need = Math.abs(diffHarv);
                if(diffBuild > 0){ //Taking from surplus builders
                    let i = 0;
                    while(i < (diffBuild || need)){
                        builders[i].role.memory = 'harvester';
                    }
                    diffHarv += i;
                    diffBuild -= i
                }
                if (diffBuild <= 0){
                    for (u in upgraders){
                        u.memory.role = 'harvester'
                        diffHarv++
                    }
                }
            }
        getBuBRoles();
        }


        
    // Run each creep according to its role.
    for (let name in Game.creeps){
        let creep = Game.creeps[name];
        let role = creep.memory.role;
        switch (role){
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            default:
                console.log(creep + ' has an undefined role.')
        }
    }
}   
}

function getBuBRoles(){ // This is a helper function to get how many BUBs are working in each role.
    harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
}