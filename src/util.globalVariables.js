function getStructureTypeValue(type){
    let val;
    switch(type){
        case STRUCTURE_CONTAINER:
            let val = (structure.store.getUsedCapacity / structure.store.getCapacity());
            break;
        case STRUCTURE_EXTENSION:
            val = 0.5;
            break;
        case STRUCTURE_RAMPART:
            val = 0.75;
            break;
        case STRUCTURE_ROAD:
            val = 0.25;
            break;
        case STRUCTURE_SPAWN:
            val = 2;
            break;
        case STRUCTURE_TOWER:
            val = 0.75;
            break;
        case STRUCTURE_WALL:
            val = 0.25;
            break;
        default:
            val = 0.5;
            console.log(type + " has no defined weighting value.")
    }
    return val;

}
var ticksPerCtlrLevel = [1, 20000, 10000, 20000, 40000, 80000, 120000, 150000, 200000]

//This figure is the amount of energy work that the colony needs at any moment.

module.exports = {
    ticksPerCtlrLevel,
    getStructureTypeValue
}