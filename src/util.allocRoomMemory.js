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
    }
    Memory.updateRoomMemorySettings = true;
}

function checkSpawnSlots(room){
    return
}


module.exports = {
    allocRoomMemory
}