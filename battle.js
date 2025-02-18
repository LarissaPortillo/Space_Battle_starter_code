const btnExt=document.querySelector('.button')
const btn=document.querySelector('button.start')
const retreat=document.querySelector('button.retreat')
const playerStats=document.querySelector('.playerStats')
const alienStats=document.querySelector('.enemyStats')
const attackbtn=document.querySelector('button.attack')
const enemyHit=document.querySelector(".enemyImage")
const playerHit=document.querySelector(".playerImage")
const numAliens=document.querySelector('.enemyName')

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
const playerMisssesMessages=['Enemy dodged your attack.','Oh no! The alien ship survived!','You missed! So close! But not close enough!','Complete Miss! Not even close to the enemy ship!','Oops! Failed attack.']
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

let setBoard=(player,alien,array)=>{
    playerStats.innerHTML=`Hull: ${player.hull} <br> Firepower: ${player.firepower} <br> Accuracy: ${player.accuracy}`
    alienStats.innerHTML=`Ships: ${array.length} <br> Hull: ${alien.hull} <br> Firepower: ${alien.firepower} <br> Accuracy: ${alien.accuracy}`
}

console.log('%c spacebattle', 'font-size: 40px');
//start game
let start=(e)=>{
    enemyHit.style.backgroundImage="url(images/enemy.gif)"
    playerHit.style.backgroundImage="url(images/space_hero.gif)"
    
    //USS Assembly ship has prefixed numbers
    const USSAssembly = new Ship(20,5,.7)

    //Create array of 6 alien ships
    let alienFleet=[]
    for(i=1;i<=6;i++){
        alienFleet.push(new Ship(getRandomNumber(3,6,0),getRandomNumber(2,4,0),getRandomNumber(.6,.8,1)))
    }
    //set first alien to be targetted
    let alien=alienFleet[0]
    
    //set stats board
    setBoard(USSAssembly,alien,alienFleet)

    confirm('Good day soldier. Today, you will go into space battle and attempt to defeat '+alienFleet.length+' alien ships. Be warned this is a matter of life and death. You may not come out of this alive. Good luck and may the universe have mercy on your soul.')
   
    btn.disabled=true
    btnExt.innerHTML="Click the attack button to attack the alien!"
    attackbtn.disabled=false
    
    attackbtn.addEventListener('click',function(e){
        enemyHit.style.backgroundImage="url(images/enemy.gif)"
        playerHit.style.backgroundImage="url(images/space_hero.gif)"

        setBoard(USSAssembly,alien,alienFleet)
        let proceed=true;
        retreat.disabled=false

        enemyHit.style.animation='none'
        playerHit.style.animation='none'

        while(proceed==true && alienFleet.length > 0 && USSAssembly.hull > 0 ){
            enemyHit.style.animation='none'
            playerHit.style.animation='none'
            
            //call attack method, player attacks
            attack(alien,USSAssembly) 
            console.log('%c You are attacking an alien!', 'color: green;');
            //if alien receives damage: it either can be destroyed or can survive the damage 
            if(alien.hit==true){ 
                console.log('%c You HIT the alien! ', 'color: red');
                console.log('%c You have done ' + USSAssembly.firepower + ' damage ', 'font-style: italic; border: 1px solid grey;');
                console.log('%c Alien has ' +alien.hull+ " hull remaining.", 'font-style: italic');
             
                if(alien.hull <= 0 ){ //alien is destroyed
                    if(alienFleet.length-1==0){ //last alien in the array is destroyed so print message and decrement alienFleet array to end while loop
                        setBoard(USSAssembly,alien,alienFleet)
                        console.log('%c Fleet Destroyed.', 'font-style: italic');
                        alert(`Entire enemy fleet destroyed. \nYour ${USSAssembly.firepower} damage brought the last enemy's hull to ${alien.hull}. \nYOU WIN!`)
                        
                        enemyHit.style.animation='blink .5s 2'
                        playerHit.style.animation='win .5s 2'
                        enemyHit.style.backgroundImage=("url(https://th.bing.com/th/id/R.b40448e4f2f40a855d6e7628b6cd7664?rik=sDSkz9l%2fGhfrkQ&riu=http%3a%2f%2f25.media.tumblr.com%2ffeb6ead616cb7fb2733bcb2d8fb8523e%2ftumblr_n1fgwuLS3K1qedb29o1_500.gif&ehk=%2bglcwMkeYTFWWGA60M%2fpsrY%2fduHMMJn%2fkLqoIpjsVE4%3d&risl=&pid=ImgRaw&r=0")
                     
                        btnExt.textContent='Winner!'    
                        retreat.disabled=true
                        attackbtn.disabled=true
                        btn.disabled=false
                        alienFleet.shift()  
                        alien=alienFleet[0]  
                    }
                    else{//alien is destroyed but there a still more aliens so print message and give player option to retreat(end loop) or attack(begin loop from beginning)
                        
                        btnExt.textContent='Choose either to retreat or attack'
                        retreat.disabled=false
                        btn.disabled=true
                        setBoard(USSAssembly,alien,alienFleet)
                        console.log('%c Alien Destroyed.', 'font-style: italic');
                        console.log('Retreat or Attack')
                        alert(`${alienDestroyed[getRandomNumber(0,(alienDestroyed.length-1),0)]} \nYour ${USSAssembly.firepower} damage brought the alien's hull to ${alien.hull}.  \nThere are ${alienFleet.length-1} ships remaining. `)
                        enemyHit.style.animation='blink .5s 2'
                         alienFleet.shift()  
                        alien=alienFleet[0]  
                        proceed=false;
        
                    }
                }
                else{ //alien ship survives despite damage so it'll attack
                    attack(USSAssembly,alien) 
                   if(USSAssembly.hit==true){ //player receives damage so they can either be destroyed or survive the damage
                        if(USSAssembly.hull <= 0 ){//player destroyed and loses game so while loop ends
                            console.log('%c Alien is attacking you! ', 'color: green');
                            console.log('%c Alien HITS you! ', 'color: red');
                            console.log('%c Alien did ' + alien.firepower + ' damage ', 'font-style: italic; border: 1px solid grey;');
                            console.log('%c Game over for you.', 'font-style: italic');
                        
                            attackbtn.ariaDisabled=true;
                            alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining.`)
                            enemyHit.style.animation='blink .5s 2'
                            alert(`Enemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]} \nYOU LOSE. `)
                            playerHit.style.animation='blink .5s 2'
                            enemyHit.style.animation='win .5s 2'
                            playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
                            setBoard(USSAssembly,alien,alienFleet)
                            attackbtn.disabled=true
                            retreat.disabled=true
                            btn.disabled=false
                        }
                        else{ //player survives damage so loop will start back up
                            setBoard(USSAssembly,alien,alienFleet)
                            
                            console.log('%c Alien is attacking you! ', 'color: green');
                            console.log('%c Alien HITS you! ', 'color: red');
                            console.log('%c Alien did ' + alien.firepower + ' damage ', 'font-style: italic; border: 1px solid grey;');
                            console.log('%c You have '+USSAssembly.hull+' hull remaining.', 'font-style: italic');
                        
                            alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining. `)
                            enemyHit.style.animation='blink .5s 2'
                            alert(`Enemy strikes back. \n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} \nAlien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.`)
                            playerHit.style.animation='blink .5s 2'
                            btnExt.innerHTML="Click the attack button to attack the alien!"
                            attackbtn.disabled=false;
                            retreat.disabled=true;
                            btn.disabled=true
                            proceed=false;
                        }
                    }
                    else{ //player doesn't receive damage so it attacks and loop starts back up 
                        console.log('%c Alien is attacking you! ', 'color: green');
                        console.log('%c Alien MISSES you! ', 'color: orange');
                        console.log('%c You have '+USSAssembly.hull+' hull remaining.', 'font-style: italic');
                    
                     
                        alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining. `)
                        enemyHit.style.animation='blink .5s 2'
                        alert(`Enemy strikes back.\n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]}  \nYou have ${USSAssembly.hull} hulls remaining.`) 
                        btnExt.innerHTML="Click the attack button to attack the alien!"

                        attackbtn.disabled=false;
                        btn.disabled=true
                        retreat.disabled=true;
                        proceed=false;
                    }
                }     
            }
            else{//alien does not receive damage so it will attack
                attack(USSAssembly,alien)
                console.log('%c You MISS the alien! ', 'color: orange');
                console.log('%c Alien has ' +alien.hull+ " hull remaining.", 'font-style: italic');
                 
             
                if(USSAssembly.hit==true){ //player receives damage can either be destroyed or survive
                    
                    if(USSAssembly.hull <= 0 ){//player  destroyed
                        console.log('%c Alien is attacking you! ', 'color: green');
                        console.log('%c Alien HITS you! ', 'color: red');
                        console.log('%c Alien did ' + alien.firepower + ' damage ', 'font-style: italic; border: 1px solid grey;');
                        console.log('%c You are dead.', 'font-style: italic');
                        
                        setBoard(USSAssembly,alien,alienFleet)
                        alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                        alert(`Enemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]}. \nAlien's ${alien.firepower} damage brought your hull number to ${USSAssembly.hull}.\nYOU LOSE.  `)
                        playerHit.style.animation='blink .5s 2'
                        enemyHit.style.animation='win .5s 2'
                        playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
                         
                        btnExt.textContent='Loser'
                        retreat.disabled=true
                        attackbtn.disabled=true
                        btn.disabled=false
                    }
                    else{ //player survives so loops start back up 
                        console.log('%c Alien is attacking you! ', 'color: green');
                        console.log('%c Alien HITS you! ', 'color: red');
                        console.log('%c Alien did ' + alien.firepower + ' damage ', 'font-style: italic; border: 1px solid grey;');
                        console.log('%c You have '+USSAssembly.hull+' hull remaining.', 'font-style: italic');
                        
                        setBoard(USSAssembly,alien,alienFleet)
                        alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                        alert(`Enemy strikes back.\n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} \nAlien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.`)
                        playerHit.style.animation='blink .5s 2'
                        
                        btnExt.innerHTML="Click the attack button to attack the alien!"
                        attackbtn.disabled=false;
                        retreat.disabled=true;
                        btn.disabled=true
                        proceed=false;

                    }
                }
                else{//player doesn't receive damge so loops starts back up
                    console.log('%c Alien is attacking you! ', 'color: green');
                    console.log('%c Alien MISSES you! ', 'color: orange');
                    console.log('%c You have '+USSAssembly.hull+' hull remaining.', 'font-style: italic');
                
                    setBoard(USSAssembly,alien,alienFleet)
                    alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                    alert(`Enemy strikes back. \n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]} \nYou still have ${USSAssembly.hull} hulls.`)
                    btnExt.innerHTML="Click the attack button to attack the alien!"
                    attackbtn.disabled=false;
                    retreat.disabled=true;
                    btn.disabled=true
                    proceed=false;
                }
            } 
        }
    } )

    retreat.addEventListener('click',function(e){
        btnExt.textContent="You chose retreat. End of Game"
        attackbtn.disabled=true;
        retreat.disabled=true;
        btn.disabled=false;
        console.log('Retreated')
        
    })

 
   
}

//when player clicks button the game starts
btn.addEventListener('click',start)