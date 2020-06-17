function getAcailableAccessSlots(source){
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
    const keys = Object.keys(terrain).concat(Object.keys(structures));
    let count = 0;
    // Scan the area for Plains or Marsh tiles
    for (let i = 0; i < keys.length; i++) {
        let item = area[keys[i]];
        let k = Object.keys(item);
        for (let j = 0; j < k.length; j++) {
            if (item[k[j]] == 'plain' || item[k[j]] == 'marsh' || item[k[j]] == 'road' ){
                count++;
            }
        }
    }
    return count;
}

// With credit fo Harkole for the suggestion.