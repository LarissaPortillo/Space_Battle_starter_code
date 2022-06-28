let btn=document.querySelector('.start')

//template for all ships
class Ship{
    constructor(hull,firepower,accuracy){
        this.hull=hull
        this.firepower=firepower
        this.accuracy=accuracy
        this.hit=false
    }
    //call this method when ship is attacked to decrease hull based on damage amount (damage=firepower number of opposing ship)
    attacked(damage){
        this.hull=this.hull-damage
        this.hit=true
    }
}


//function that picks a random number with the amount of decimal places of your choosing from a given range, bounds are included
let getRandomNumber=(min,max,decimal)=> (Math.random()*(max-min)+min).toFixed(decimal)


//array of possible messages player will see for different scenarios
const playerMisssesMessages=['You missed! Enemy dodged your attack.','Oh no! The alien ship survived!','You missed! So close! But not close enough!','Way off! Complete Miss! Not even close to the enemy ship!','Oops! Failed attack.']
const playerHitsMessages=['BULLSEYE!',"Automatic HIT!","Success!"]
const playerDestroyed=['Oh no! Your ship succummed to all the damages!','Unfortunately, you could not escape death.', 'Mayday-Mayday! Ship crashed!', 'Ship in complete shambles!', 'You attained too much damage.']

const alienMissesMessages=['Enemy misses you by an inch!','Alien completely misses your ship!',"You managed to dodge the alien's attack!"]
const alienHitsMessages=["You've been hit!","Your dodge attempt failed.", "You flew right into enemy fire!", "Oh no!"]
const alienDestroyed=['Enemy suffered complete annihilation.','You downed the enemy.','CRITICAL HIT! Enemy destroyed.']


//function to execute when you want attacker to attack it's victim
let attack = (victim,attacker)=>{
    if(attacker.accuracy > Math.random()){ 
        //call on attacked method 
        victim.attacked(attacker.firepower)
    }
    else{ 
        //not attacked 
        victim.hit=false
    }
}


//space game 
let game=(e)=>{
    let start=prompt('Type a for attack');
    //USS Assembly ship has prefixed numbers
    const USSAssembly = new Ship(20,5,.7)

    //Create array of 6 alien ships
    let alienFleet=[]
    for(i=1;i<=6;i++){
        alienFleet.push(new Ship(getRandomNumber(3,6,0),getRandomNumber(2,4,0),getRandomNumber(.6,.8,1)))
    }

    //set first alien to be targetted
    let alien=alienFleet[0]

    while(start=='a' && alienFleet.length > 0 && USSAssembly.hull > 0 ){
        //call attack method, player attacks
        attack(alien,USSAssembly) 
        
        //if alien receives damage: it either can be destroyed or can survive the damage 
        if(alien.hit==true){ 
            if(alien.hull <= 0 ){ //alien is destroyed
                if(alienFleet.length-1==0){ //last alien in the array is destroyed so print message and decrement alienFleet array to end while loop
                    start=confirm(`Entire enemy fleet destroyed. \nYour ${USSAssembly.firepower} damage brought the last enemy's hull to ${alien.hull}. \nYOU WIN!`)
                    alienFleet.shift()  
                    alien=alienFleet[0]  
                }
                else{//alien is destroyed but there a still more aliens so print message and give player option to retreat(end loop) or attack(begin loop from beginning)
                    start=prompt(`${alienDestroyed[getRandomNumber(0,(alienDestroyed.length-1),0)]} Your ${USSAssembly.firepower} damage brought the alien's hull to ${alien.hull}.  \nThere are ${alienFleet.length-1} ships remaining. \nType r to retreat or a to attack.`,'a or r')
                    alienFleet.shift()  
                    alien=alienFleet[0]   
                }
            }
            else{ //alien ship survives despite damage so it'll attack
                attack(USSAssembly,alien) 
                if(USSAssembly.hit==true){ //player receives damage so they can either be destroyed or survive the damage
                    if(USSAssembly.hull <= 0 ){//player destroyed and loses game so while loop ends
                        prompt(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} You caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining. \nEnemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]} \nYOU LOSE. `)
                    }
                    else{ //player survives damage so loop will start back up
                        prompt(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} You caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining. \nEnemy strikes back. \n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} Alien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.\nType a to attack`,'a')
                    }
                }
                else{ //player doesn't receive damage so it attacks and loop starts back up 
                    prompt(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} You caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining. \nEnemy strikes back.\n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]} \nType a to attack`,'a') 
                }
            }     
        }
        else{//alien does not receive damage so it will attack
            attack(USSAssembly,alien)
            if(USSAssembly.hit==true){ //player receives damage can either be destroyed or survive
                if(USSAssembly.hull <= 0 ){//player  destroyed
                    prompt(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} Alien still has ${alien.hull} hulls. \nEnemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]}. \nAlien's ${alien.firepower} damage brought your hull number to ${USSAssembly.hull}. YOU LOSE.  `)
                }
                else{ //player survives so loops start back up 
                    prompt(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} Alien still has ${alien.hull} hulls.\nEnemy strikes back.\n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} \nAlien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.\nType a to attack`,'a')
                }
            }
            else{//player doesn't receive damge so loops starts back up
                prompt(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} Alien still has ${alien.hull} hulls.  \nEnemy strikes back. \n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]} You still have ${USSAssembly.hull} hulls.\nType a to attack`,'a')
            }
        } 
    }
   
}

//when player clicks button the game starts
btn.addEventListener('click',game)