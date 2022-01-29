const express = require('express');
const SHA256 = require('crypto-js/sha256');
const firebase = require('firebase');
const router = express.Router();
const path = require('path');
const { append } = require('vary');
checkuser()
async function checkuser(){
var Auth = await firebase.auth();
console.log(Auth.currentUser);
}






//blockchain
class Block {
    constructor(timestamp, data, prevhash = '') {
        this.index = 0;
        this.timestamp = timestamp;
        this.data = data;
        this.prevhash = prevhash;
        this.hash = this.CalculateHash();
        this.noce = 0;
    }
    CalculateHash() {
        return SHA256(this.index + this.prevhash + this.timestamp + this.noce + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.noce++;
            this.hash = this.CalculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 4;
    }

    createBlock() {
        this.chain = [new Block(0, "01/01/2022", "Genisis", "0")];
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.prevhash = this.getLatestBlock().hash;
        newBlock.index = this.chain.length;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);


    }
    isChainvalid() {
        for (let i = 1; i < this.chain.length; i++) {
            const CurrentBlock = this.chain[i];
            const PrevioushHash = this.chain[i - 1];

            if (CurrentBlock.hash != CurrentBlock.CalculateHash()) {
                return false;
            }
            if (CurrentBlock.prevhash != PrevioushHash.hash) {
                return false;
            }
        }
        return true;
    }
    ittrate() {
        for (let i = 1; i < this.chain.length; i++) {
            console.log("Block" + i + " " + JSON.stringify(this.chain[i].data
            ))
        }
    }
}
// obj1.ittrate();

var chain = null;
const dbRef = firebase.database().ref();
var obj1 = null;

var starCountRef = firebase.database().ref('user');
starCountRef.on('value', (snapshot) => {
    dbRef.child("user").child("bc").get().then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            chain = snapshot.val();
            obj1 = new Blockchain();
            obj1.chain = chain
        } else {
            console.log("No data available");
            obj1 = new Blockchain();
            obj1.createBlock();
            firebase.database().ref('user').set({
                bc: obj1.chain
            });
        }
    }).catch((error) => {
        console.error(error);
    });
});




router.get('/addreport', (req, res) => {
    console.log("Adding block 6");
    obj1.addBlock(new Block("01/01/2027", { amount: 56 }))
    firebase.database().ref('user').push({
        bc: obj1.chain
    });
});
console.log()
module.exports = router;
