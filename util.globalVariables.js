function getBuildNeed(){
    let conSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES)
    let buildNeed = 0;
    for (let c in conSites){
        let p = conSites[c].progress;
        let t = conSites[c].progressTotal;
        buildNeed += (t - p);
    }
    return buildNeed;
}

function getHarvNeed(){
    let energyCap = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    let energyAv = Game.spawns['Spawn1'].room.energyAvailable;
    return energyCap - energyAv;
}

var buildNeeded = getBuildNeed();
var harvestNeeded = getHarvNeed();
//This figure is the amount of energy work that the colony needs at any moment.
var totalNeed = (buildNeeded + harvestNeeded) - (Memory.beCommit + Memory.heCommit)

module.exports = {
    buildNeeded,
    harvestNeeded,
    totalNeed
}