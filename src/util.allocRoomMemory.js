function allocRoomMemory(){
    for (let s in Game.spawns){
        let spawn = Game.spawns[s];
        let roomMem = spawn.room.memory;
        if (roomMem.sourceAlloc == null){
            roomMem.sourceAlloc = [0, 0, 0, 0];
        }
        if (roomMem.beCommit == null){
            roomMem.beCommit = 0;
        }
        if (roomMem.heCommit == null){
            roomMem.heCommit = 0;
        }
        if (roomMem.rpCommit == null){
            roomMem.rpCommit = 0;
        }
        getRoomSourceOpenSpaceArray(spawn.room);
    }
    Memory.updateRoomMemorySettings = false;
}

function getRoomSourceOpenSpaceArray(room){
    let sources = room.find(FIND_SOURCES);
    let sourceSlots = []
    for (let i = 0; i < sources.length; i++){
        let val = checkSourceSlots(sources[i]);
        sourceSlots[i] = val;
    }
    room.memory.maxSpotsPerSource = sourceSlots;
}

function checkSourceSlots(source){
    // Establish where to look
    const terrain = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x -1,
        source.pos.y + 1,
        source.pos.x + 1
    );
    const structures = source.room.lookForAtArea(
        LOOK_STRUCTURES,
        source.pos.y - 1,
        source.pos.x -1,
        source.pos.y + 1,
        source.pos.x + 1
    )
    var keys = Object.keys(terrain);
    const structKeys = Object.keys(structures)
    let count = 0;
    // Scan the area for Plains or Marsh tiles
    for (let i = 0; i < keys.length; i++) {
        let item = keys[keys[i]];
        let k = Object.keys(item);
        for (let j = 0; j < k.length; j++) {
            if (item[k[j]] == 'plain' || item[k[j]] == 'marsh'){
                count++;
            }
            else if(item[k[j]] == 'wall'){
                sItem = structKeys[structKeys[i]];
                sK = Object.keys(sItem);
                if(sItem[sK[j]] == 'road'){
                    continue;
                }

            }
        }
    }
    // Scan for roads

module.exports = {
    allocRoomMemory
}