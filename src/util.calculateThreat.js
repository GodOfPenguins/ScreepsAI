function calculateRoomThreat(room){
    if(room.controller.my){ // Only for rooms that I control
        let enemyCreeps = room.find(FIND_HOSTILE_CREEPS);
        let attackTot = 0;
        let rAttackTot = 0;
        let toughTot = 0;
        let healTot = 0;
            for(let c in enemyCreeps){
                let body = enemyCreeps[c].body;
                for(let p in body){
                    let partType = body[p].type;
                    switch (partType){
                        case 'attack':
                            attackTot++
                            break;
                        case 'ranged_attack':
                            rAttackTot++;
                            break;
                        case 'tough':
                            toughTot++;
                            break;
                        case 'heal':
                            healTot++;
                            break;
                    }
                }
            }
        let atk = attackTot * 80;
        let ratk = rAttackTot * 150;
        let tgh = toughTot * 10;
        let hl = healTot * 250;
        let threat = atk + ratk + tgh + hl;
        return threat;   
    }
}

// [{"type":"work","hits":100},{"type":"carry","hits":100},{"type":"move","hits":100}]

module.exports = {
    calculateRoomThreat
}