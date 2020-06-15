// This should be a stable unit AI for the BUB line of workers
// The BUB should choose a role based on priority weighting of committed energy towards needed maintainance tasks
// The BUB should harvest enery from the Source from the least traffic
// Once full, the BUB should determine the priority of all tasks
// Based on the priority, the BUB should pick a task and report the energy that it is committing to the task
// Once the task is completed, the BUB should report the task complete and remove the committed energy from the task cue
var harvestEngCommit = Memory.heCommit; // Not really using these here, just making a note of them so I can find them later.
var buildEngCommit = Memory.beCommit;
var sourceAlloc = Memory.sourceAlloc;
var nextSource = Memory.nextSource[0];
var getNextSource = require(util.sourceAllocator);

var bubBasicAI = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
    }
};

module.exports = bubBasicAI;