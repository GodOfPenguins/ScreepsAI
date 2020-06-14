const sourceNumFreeSpots = [3, 3, 0, 1];
var sourceCounter = 0;
var nextSource = 0;

function getNextSource(){
    let val = nextSource;
    sourceCounter++;
    if(nextSource == sourceNumFreeSpots[sourceCounter]){
        nextSource++;
        sourceCounter = 0;
    }
    if(sourceNumFreeSpots[nextSource] === 0){ // I'll set a source's free spots to 0 if there is an enemy nearby.
        nextSource++;
    }
}

module.exports = {
    getNextSource
}
// I need to find a good way to programmatically determine how many free spots are next to any given source
// to make this code generalisable.