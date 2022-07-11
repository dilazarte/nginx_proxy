const express = require('express')
const {Router} = express
const { fork } = require('child_process');


const randomsNum = Router()

randomsNum.get('/', (req, res) => {
    let num = parseInt(req.query.cant) || 100000000;
    const forked = fork('src/utils/randomsNum.js');

    forked.send(num);
        forked.on('message', data => {
            res.json({data: `PID ${process.pid}`, randoms: data})
    })
    // if(num){
    //     forked.send(num);
    //     forked.on('message', data => {
    //         res.json(data)
    //     })
    // } else {
    //     forked.send(100000000);
    //     forked.on('message', data => {
    //         res.json(data)
    //     })
    // }
})

module.exports= randomsNum