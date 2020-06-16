function energyAudit(){
    
}

function checkForNegativeCommits(room){
    let mem = room.memory;
    if (mem.heCommit < 0){
        mem.heCommit = 0
    }
    if (mem.beCommit < 0){
        mem.beCommit = 0
    }
    if (mem.rpCommit < 0){
        mem.rpCommit = 0
    }
}