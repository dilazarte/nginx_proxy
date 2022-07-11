function getRandomNumObj (num){
    let random = 0;
    let arrNums = [];
    let obj = {};
    for (let i = 0; i < num; i++) {
        random = randomNum(1, num);
        arrNums.push(random);
    }
    arrNums.forEach(num => {
        obj[num] = (obj[num] || 0) + 1;
    });
    return obj;
}

function randomNum(min, max){
    return Math.floor((Math.random() * (max - min + 1)) + min);
}


process.on("message", num => {
    let sum = getRandomNumObj(num)
    process.send(sum);
});