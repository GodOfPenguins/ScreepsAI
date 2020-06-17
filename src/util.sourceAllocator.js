// This will eventually need to be managed at a per-room level... somehow
// Also might be nice to take transit-time towards a source into account.

function getNextSource(room){
    let index = null;
    let maxSpotsPerSource = room.memory.maxSpotsPerSource;
    let allocated = room.memory.sourceAlloc;
    let m;
    let n;
    let lON = 0;
    let lOS = 0; // "Least objectionable solution"
    let target = 0;
    for (let i = 0; i < maxSpotsPerSource.length; i++){
        m = maxSpotsPerSource[i];
        n = allocated[i];      
        if (n < m){ // If there is an open spot.
            index = i;
            break;
        }
        else{
            let test = m / (n + 1); // Basic test for how overcrowded any particular spot would be (predictive-ish), the closer to 1 the less overcrowded
            // The +1 is to bias towards sources that have more openings. 
            // It is easier for a source with 6 slots to accept a 7th, the a source with 1 to accept a 2nd... I think.
            if(lON < test){
                lON = test;
                lOS = i;
            }
        }
    }
    if (index){
        target = index;
    }
    else{
        target = lOS;
    }
    allocated[target]++;
    room.memory.sourceAlloc = allocated;
    return target
}

module.exports = {
    getNextSource
}
// I need to find a good way to programmatically determine how many free spots are next to any given source
// to make this code generalisable.