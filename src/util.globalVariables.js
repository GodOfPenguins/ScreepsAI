function getBuildNeed(){
    let conSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
    let buildNeed = 0;
    let buildTot = 0
    for (let c in conSites){
        let p = conSites[c].progress;
        let t = conSites[c].progressTotal;
        buildNeed += (t - p);
        buildTot += t
    }
    return [buildNeed, buildTot];
}

function getRepairVals(){
    let structures = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES);
    let hits = 0;
    let maxHits = 0;
    for (let s in structures){
        let struct = structures[s];
        hits += struct.hits;
        maxHits += struct.hitsMax;
    }
    return [hits, maxHits];
}

var buildVals = getBuildNeed();
var repairVals = getRepairVals();
var energyTotal = Game.spawns['Spawn1'].room.energyCapacityAvailable;

ticksPerCtlrLevel = [1, 20000, 10000, 20000, 40000, 80000, 120000, 150000, 200000]

//This figure is the amount of energy work that the colony needs at any moment.

module.exports = {
    buildVals, // [buildNeeded, totalBuildAmount]
    repairVals, // [hits, maxHits]
    energyTotal,
    ticksPerCtlrLevel
}