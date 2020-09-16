const basicUtiltyBuild = [WORK, CARRY, MOVE]; // 200 points, "Bub" :D
const basicUtiltyBuildmkII = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]; // 550 points
const alertFighterII = [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK]; // 390 points
const alertFighter = [MOVE, MOVE, ATTACK, ATTACK]; // 280 points
const birdOfPreyI = [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];

function spawnBUB(spawn, role){
    let engAv = spawn.room.energyAvailable;
    let newName;
    let selectedBuild;
    let memoryOptions;

    if (engAV > 550){
        newName = 'vumwI\'_' + Game.time;
        selectedBuild = basicUtiltyBuildmkII;
        memoryOptions = {memory: {role: role, harvesting: false, buildType: 'BUBmkII'}};
    }
    else{
        newName = 'vumwI\'Hom_' + Game.time;
        selectedBuild = basicUtiltyBuild;
        memoryOptions = {memory: {role: role, harvesting: false, buildType: 'BUB'}};
    }
    spawn.spawnCreep(selectedBuild, newName, memoryOptions);
}

function spawnAutomatedMiner(spawn){
    let newName = "tlhIlwI'_" + Game.time;
    let engAv = spawn.room.energyAvailable;
    let body = [];
    while (engAv >= 100){
        body.push(WORK);
        engAv -= 100;
    }
    let memoryOptions = {memory: {role:'autoMiner', needTractor: true, buildType:'autoMiner'}};
    spawn.spawnCreep(body, newName, memoryOptions);    
}

function spawnTractor(spawn){
    let newName = "yuvwI'_" + Game.time;
    let engAv = spawn.room.energyAvailable;
    let body = [];
    while (engAv >= 50){
        body.push(MOVE);
        engAv -= 50;
    }
    let memoryOptions = {memory: {role:'tractor', target: null, destination:null, buildType:'tractor'}};
    spawn.spawnCreep(body, newName, memoryOptions);
}

function spawnAlertFighter(spawn, stationAt = null){
    let newName = 'SuvwI\'_' + Game.time;
    let body = [];
    if (spawn.room.energyCapacityAvailable <= 300){
        body = alertFighter;
        type = 'alertFighterI'
    }
    else if (spawn.room.energyCapacityAvailable > 500){
        body = alertFighterII;
        type = 'alertFighterII'
    }
    let memoryOptions = {memory: {role:'alertFighter', buildType: type, station:stationAt}}
    spawn.spawnCreep(body, newName, memoryOptions);
}

function spawnHauler(spawn){
    let newName = "qengwI'_" + Game.time;
    let engAv = spawn.room.energyAvailable;
    let body = [];
    while(engAV > 100){
        body.push(WORK);
        body.push(MOVE);
        engAv -= 100;
    }
    let memoryOptions = {memory: {buildType:'hauler'}};
    spawn.spawnCreep(body, newName, memoryOptions);    
}

module.exports = {
    spawnBUB,
    spawnAutomatedMiner,
    spawnTractor,
    spawnAlertFighter,
    spawnHauler

}