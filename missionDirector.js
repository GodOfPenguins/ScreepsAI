var harvestPriority = 0;
var constructPriority = 0;





function getBuBRoles(){ // This is a helper function to get how many BUBs are working in each role.
    harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log("BUB role allocation: " + harvesters.length + ", " + upgraders.length+ ", " + builders.length)
}