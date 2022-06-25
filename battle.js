
//template for all ships
class Ship{
    constructor(hull,firepower,accuracy){
        this.hull=hull
        this.firepower=firepower
        this.accuracy=accuracy
        this.hit=false;
    }
    //call this method when ship is attacked to decrease hull based on damage amount (damage=firepower number of opposing ship)
    attacked(damage){
        this.hull=this.hull-damage
        this.hit=true;
    }
}

//function that picks a random number with the amount of decimal places of your choosing from a given range, bounds are included
let getRandomNumber=(min,max,decimal)=> (Math.random()*(max-min)+min).toFixed(decimal)

//USS Assembly ship has prefixed numbers
const USSAssembly = new Ship(20,5,.7)

//Create array of 6 alien ships
let alienFleet=[]
for(i=1;i<=6;i++){
    alienFleet.push(new Ship(getRandomNumber(3,6,0),getRandomNumber(2,4,0),getRandomNumber(.6,.8,1)))
}

//alienFleet.shift()//remove first index permenantly and alter the array

//array of possible messages player will see for different scenarios
const missMessages=['Miss! Enemy dodged your attack.','Miss! Very close! But not close enough!','Way off! Complete Miss! Not even close to enemy ship!','Oops! Failed attack.']
const hitMessages=['BULLSEYE!',"Automatic HIT","Success!"]
const loseMessages=['Oh no! Your ship succummed to all the damages!','Unfortunately, you could not escape death.', 'Mayday-Mayday! Ship crashed!', 'Ship in complete shambles!', 'You attained to much damage.']

const alienMissMessages=['Enemy misses you by an inch!','Complete miss from enemy ship!','You managed to dodge their attack!']
const alienHitMessages=["You've been hit!","Dodge attempt failed.", "You flew right into enemy fire!", "Oh no!"]
const alienDestroyed=['Enemy suffered complete annihilation.','You downed the enemy.','CRITICAL HIT! Enemy destroyed.']


//function to execute when you want player to attack 
let USSAssemblyAttack = (alienShip)=>{
    if(USSAssembly.accuracy > Math.random()){ 
        //decrements alien's hull
        alienShip.attacked()
        //selects random message notifying player that they hit the alien ship 
        console.log(`${hitMessages[getRandomNumber(0,(hitMessages.length-1),0)]} You caused ${USSAssembly.firepower} damage.`)
        checkAlienHull(alienShip)
    }
    else{
        alienShip.hit=false
        //selects random message when they do not hit the alien ship 
        console.log(`${missMessages[getRandomNumber(0,(missMessages.length-1),0)]}`)
        checkAlienHull(alienShip)
    }
}

//function to excute when you want the alien to attack 
let alienAttack = (alienShip) =>{
    if (alienShip.accuracy > Math.random()){
        //decrements player's hull
        USSAssembly.attacked()
        //selects random message when alien hits ship
        console.log(`${alienHitMessages[getRandomNumber(0,(alienHitMessages.length-1),0)]}. You received ${alienShip.firepower} damage.`)
        checkHull()
    }
    else{
        USSAssembly.hit=false
        //selects tandom message when alien misses ship
        console.log(`${alienMissMessages[getRandomNumber(0,(alienMissMessages.length-1),0)]} `)
        checkHull()
    }
}


//checks how many hulls the player has
let checkHull=()=>{
    if(USSAssembly.hull<=0){
        console.log(`You have ${USSAssembly.hull} hulls`)
        console.log(`${loseMessages[getRandomNumber(0,(loseMessages.length-1),0)]}.`)
        console.log('YOU LOSE')
    }
    else if(USSAssembly.hull==1){
        console.log(`You have ${USSAssembly.hull} hull remaining`)
    }
    else{
        console.log(`You have ${USSAssembly.hull} hulls remaining`)
    }
}

//checks how many hulls alien ship has
let checkAlienHull=(alienShip)=>{
    if(alienShip.hull<=0){
        console.log(`${alienShip.hull} hulls`)
        console.log(`${alienDestroyed[getRandomNumber(0,(alienDestroyed.length-1),0)]}`)
        
    }
    else if(USSAssembly.hull==1){
        console.log(`${alienShip.hull} hull remaining`)
    }
    else{
        console.log(`${alienShip.hull} hulls remaining`)
    }
}

//space game 
let game=(e)=>{
    //pick out our first enemy alien
    let opponent=alienFleet[0]
    //the game will continue while the fleet still exists
    while(alienFleet.length!=0){
        USSAssemblyAttack(opponent)
        while(opponent.hit==true){
            USSAssemblyAttack(opponent);
        }
        if(opponent.hull<=0){
            //delete first index of alienFleet array
            alienFleet.shift()
            //rereat button
            
        }
        alienAttack(opponent)
        while(USSAssembly.hit==true){
            alienAttack(opponent)
        }
        if(USSAssembly.hull<=0){
            console.log(`${loseMessages[getRandomNumber(0,(loseMessages.length-1),0)]}`)
        }

    }
    console.log('Entire enemy fleet destroyed. YOU WIN!')
}

