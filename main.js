const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

var harvesters;
var upgraders;
var builders;
var bubs;
var roomEnergyAvailablePercent;
var numBUBCreeps;
var numConSites;


module.exports.loop = function () {

    const basicUtiltyBuild = [WORK, CARRY, MOVE]
    
    // Variables for general state information
    getBuBRoles();
    numConSites = Object.keys(Game.constructionSites).length
    numBUBCreeps = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB').length;
    roomEnergyAvailablePercent = Game.spawns['Spawn1'].room.energyAvailable / Game.spawns['Spawn1'].room.energyCapacityAvailable;
    var roomEnergyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
    bubs = _.filter(Game.creeps, (creep) => creep.memory.buildType == 'BUB');
    
    // Console output for debugging and status monitoring
    console.log('Harvesters: ' + harvesters.length);
    console.log('Upgraders: ' + upgraders.length);
    console.log('Builders: ' + builders.length);
    console.log('Construction Sites: ' + numConSites)
    console.log('BUBs: ' + numBUBCreeps);
    console.log('Energy Available: ' + roomEnergyAvailable + ', ' + roomEnergyAvailablePercent);
    console.log(Game.time)

    // Basic build logic, this creates one creep for every 50 energy available in the room. I have no basis to know if that's a good pace for expansion or not.
    if(numBUBCreeps < (roomEnergyAvailable / 50)) {
        let newName = 'BUBworker' + Game.time;
        console.log('Spawning new BUB: ' + newName);
        Game.spawns['Spawn1'].spawnCreep(basicUtiltyBuild, newName,
            {memory: {role: 'harvester', buildType: 'BUB'}});
    }

    if ((Game.time % 0) === 0){
        allocateRoles();
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

function getBuBRoles(){ // This is a helper function to get how many BUBs are working in each role.
    harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
}

function allocateRoles(){
    // At some point -- soon -- I need to make more elegant calculations based on how much energy a BUB can actually harvest, 
    //and how much work/energy is needed for building and filling capacity. That'll be more expandable as I grow and introduce more build types into the fray. 
    let bubHarvNeed = Math.ceil((1 - roomEnergyAvailablePercent) * numBUBCreeps); // Harvesters are allocated based on how much (by percent) the room is empty on energy.
    let bubBuildNeed = Math.ceil(numConSites / 4); // Builders are allocated based on the number of empty build sites.

    for (let b in bubs){
        if (bubHarvNeed > 0){
            bubs[b].memory.role = 'harvester';
            bubHarvNeed--;
        }
        else if (bubBuildNeed > 0){
            bubs[b].memory.role = 'builder';
            bubBuildNeed--;
        }
        else{
            bubs[b].memory.role = 'upgrader'
        }
    }
}