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
        forked.send('exit')
    })
    
})

module.exports= randomsNum