const express = require('express');
const SHA256 = require('crypto-js/sha256');
const firebase = require('firebase');
const router = express.Router();
const path = require('path');
const { append } = require('vary');

const firebaseConfig = {
    apiKey: "AIzaSyB6i_CTLfQh3vpBwV59sHxASXKSAf9wwB4",
    authDomain: "med-data-plus.firebaseapp.com",
    projectId: "med-data-plus",
    storageBucket: "med-data-plus.appspot.com",
    messagingSenderId: "772756370856",
    appId: "1:772756370856:web:b69242c1dc4e9f66ba599d"
};
firebase.initializeApp(firebaseConfig);

//blockchain
class Block{
    constructor(index, timestamp,data,prevhash=''){
        this.index =index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevhash = prevhash;
        this.hash =this.CalculateHash();
        this.noce = 0;
    }
    CalculateHash(){
        return SHA256(this.index+this.prevhash+this.timestamp+this.noce+JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
            this.noce++;
            this.hash = this.CalculateHash();
        }
        console.log("Block mined: "+this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createBlock()];
        this.difficulty = 4;
    }

    createBlock(){
        return new Block(0,"01/01/2022","Pradyumna","0",);
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.prevhash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);


    }
    isChainvalid(){
        for(let i=1; i < this.chain.length;i++){
            const CurrentBlock = this.chain[i];
            const PrevioushHash = this.chain[i - 1];

            if(CurrentBlock.hash != CurrentBlock.CalculateHash()){
                return false;
            }
            if(CurrentBlock.prevhash != PrevioushHash.hash){
                return false;
            }
        }
        return true;
    }
    ittrate(){
        for(let i=1; i< this.chain.length;i++){
            console.log("Block"+i+" "+JSON.stringify(this.chain[i].data
                )) 
        }
    }
}

let obj1 = new Blockchain();
console.log("Adding block 1");
obj1.addBlock(new Block(1,"01/01/2022",{amount:1}))
console.log("Adding block 2");
obj1.addBlock(new Block(2,"01/01/2023",{amount:5}))
console.log("Adding block 3");
obj1.addBlock(new Block(3,"01/01/2024",{amount:12}))
console.log("Adding block 4");
obj1.addBlock(new Block(4,"01/01/2025",{amount:45}))
console.log("Adding block 5");
obj1.addBlock(new Block(5,"01/01/2027",{amount:56}))

// console.log("Is Blockchain is valid ?"+obj1.isChainvalid());
// obj1.chain[1].data= {amount:100} 
// console.log("Is Blockchain is valid ?"+obj1.isChainvalid());

console.log(obj1.chain);
// obj1.ittrate();

module.exports = router;