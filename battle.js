const btnExt=document.querySelector('.button')
const btn=document.querySelector('button.start')
const retreat=document.querySelector('button.retreat')
const playerStats=document.querySelector('.playerStats')
const alienStats=document.querySelector('.enemyStats')
const attackbtn=document.querySelector('button.attack')
const enemyHit=document.querySelector(".enemyImage")
const playerHit=document.querySelector(".playerImage")
const numAliens=document.querySelector('.enemyName')
const attackMom=document.querySelector('button.mom')
const missile=document.querySelector('.missileNum')
const launch=document.querySelector('.launch')
const box=document.querySelector('#launch')
const mSelection=document.querySelector('.missileSelection')
const missPow=document.querySelector(".missilePow")


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

class player extends Ship{ 
    constructor(hull,firepower,accuracy){
        super(hull,firepower,accuracy)
        this.missile=getRandomNumber(2,4,0)
        this.missilePower=getRandomNumber(firepower+2,firepower+4,0)
    }
    missileLaunch(){
        this.missile=this.missile-1
    }
}

class alienShip extends Ship{
    constructor(hull,firepower,accuracy,name){
        super(hull,firepower,accuracy)
        this.name=name
    }
}

class megaShip extends Ship{
    constructor(hull,firepower,accuracy,pods){
        super(hull,firepower,accuracy) 
        this.pods=pods
    }
    attacked(damage){
        if(this.pods.length==0){
            this.hull=this.hull-damage
            this.hit=true
        }
        else{
            this.pods[0].attkd(damage)
        }
    }
}

class weaponPod{
    constructor(maxResistance,firepower, accuracy){
        this.maxResistance=maxResistance
        this.firepower=firepower
        this.accuracy=accuracy
        this.hit=false
    }
    attkd(damage){
        this.maxResistance=this.maxResistance-damage
        this.hit=true
    }
}


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

let useMissile=(victim,attacker)=>{
    if(attacker.accuracy > Math.random()){ 
        //call on attacked method 
        victim.attacked(attacker.missilePower)
        attacker.missileLaunch()
    }
    else{ 
        //not attacked 
        victim.hit=false
        attacker.missileLaunch()
    }
}


//set stats on page
let setBoard=(player,alien,array)=>{
    playerStats.innerHTML=`Hull: ${player.hull} <br> Firepower: ${player.firepower} <br> Accuracy: ${player.accuracy}`
    alienStats.innerHTML=`Ships: ${array.length} <br>Hull: ${alien.hull} <br> Firepower: ${alien.firepower} <br> Accuracy: ${alien.accuracy}`
}


let setBoard2=(player,alien,array)=>{
    playerStats.innerHTML=`Hull: ${player.hull} <br> Firepower: ${player.firepower} <br> Accuracy: ${player.accuracy}`
    alienStats.innerHTML=`Pods: ${array.length} <br>Life: ${alien.maxResistance} <br> Firepower: ${alien.firepower}  <br> Accuracy: ${alien.accuracy}`
}

let setBoard3=(player,alien)=>{
    playerStats.innerHTML=`Hull: ${player.hull} <br> Firepower: ${player.firepower} <br> Accuracy: ${player.accuracy}`
    alienStats.innerHTML=`Hull: ${alien.hull} <br> Firepower: ${alien.firepower} <br> Accuracy: ${alien.accuracy}`

}



attackMom.style.display='none'
attackbtn.style.display='none'
retreat.style.display='none'
box.style.display='none'
mSelection.style.display='none'


 
//start game
let start=(e)=>{
    box.style.display='block'
    mSelection.style.display='block'
    enemyHit.style.backgroundImage="url(images/enemy.gif)"
    playerHit.style.backgroundImage="url(images/space_hero.gif)"
    
    let deployMissile

    //USS Assembly ship has prefixed numbers
    const USSAssembly = new player(20,5,.7)
    console.log(USSAssembly)
    
    //Create array of random number of  alien ships
    let fleetLength=getRandomNumber(6,8,0)
    let alienFleet=[]
    for(i=1;i<=fleetLength;i++){
        alienFleet.push(new alienShip(getRandomNumber(3,6,0),getRandomNumber(2,4,0),getRandomNumber(.6,.8,1),`alien${i}`))
    }
    console.log(alienFleet)
 
    //set first alien to be targetted
    let alien=alienFleet[0]
    
    //set up the mothership and create it's weapon pods
    let numOfPods=getRandomNumber(2,3,0)
    let pods=[]
    for(i=1;i<=numOfPods; i++){
        pods.push(new weaponPod(getRandomNumber(4,6,0),getRandomNumber(3,5,0),getRandomNumber(.6,.8,1)))
    }
    let motherShip = new megaShip(getRandomNumber(8,12,0),getRandomNumber(4,6,0),getRandomNumber(.6,.8,1),pods)

    //set stats board
    setBoard(USSAssembly,alien,alienFleet)
    missile.innerHTML=`${USSAssembly.missile}`
    missPow.textContent=`${USSAssembly.missilePower}`

    confirm('Good day soldier. Today, you will go into space battle and attempt to defeat '+alienFleet.length+' alien ships. Be warned this is a matter of life and death. You may not come out of this alive. Good luck and may the universe have mercy on your soul.')
   
    btn.style.display='none'
    btnExt.innerHTML="Click the attack button to attack the alien!"
    attackbtn.style.display='block'
    attackbtn.disabled=false
    retreat.disabled=true
    retreat.style.display='block'
    console.log(deployMissile)

    launch.addEventListener('change', e=>{
        if(e.target.checked){
            deployMissile=true;
        }
        else{
            deployMissile=false;
        }
    })

    console.log(deployMissile)
    
    let pressAttack=(e)=>{
        console.log(deployMissile)
        enemyHit.style.backgroundImage="url(images/enemy.gif)"
        playerHit.style.backgroundImage="url(images/space_hero.gif)"
    
   
        setBoard(USSAssembly,alien,alienFleet)
        let proceed=true;
        retreat.disabled=false

        enemyHit.style.animation='none'
        playerHit.style.animation='none'

        while(proceed==true && alienFleet.length>0 && USSAssembly.hull > 0 ){
            enemyHit.style.animation='none'
            playerHit.style.animation='none'
            
            //call attack method, player attacks
            if(deployMissile==true){
                useMissile(alien,USSAssembly)
                missile.textContent=USSAssembly.missile
               
                if(USSAssembly.missile==0){
                    
                    mSelection.style.display='none'
                    box.style.display='none'
                    deployMissile=false
                }
                //if alien receives damage: it either can be destroyed or can survive the damage 
                if(alien.hit==true){ 
                    if(alien.hull <= 0 ){ //alien is destroyed
                        if(alienFleet.length-1==0){ //last alien in the array is destroyed so print message and decrement alienFleet array to end while loop
                            setBoard(USSAssembly,alien,alienFleet)

                            alert(`Entire enemy fleet destroyed. \nYour ${USSAssembly.missilePower} missile damage brought the last enemy's hull to ${alien.hull}. `)
                            
                            alert(`Looks like you're not done yet! You've greavely upset the MotherShip! She's decided to come wreak havoc on earth. Face her wrath and stop her! The world is depending on you.`)
                            enemyHit.style.animation='blink .5s 2'
                            btnExt.textContent='Choose to attack the MotherShip or retreat'    
                            retreat.disabled=false
                            //attackbtn.disabled=true
                            attackbtn.style.display='none'
                            attackMom.disabled=false
                            attackMom.style.display='block'
                            //btn.disabled=false
                            alienFleet.shift()  
                            alien=alienFleet[0]  
                            proceed=false

                            
                        }
                        else{//alien is destroyed but there a still more aliens so print message and give player option to retreat(end loop) or attack(begin loop from beginning)
                            
                            btnExt.textContent='Choose either to retreat or attack'
                            retreat.disabled=false
                            setBoard(USSAssembly,alien,alienFleet)
                            
                            alert(`${alienDestroyed[getRandomNumber(0,(alienDestroyed.length-1),0)]} \nYour ${USSAssembly.missilePower} missile damage brought the alien's hull to ${alien.hull}.  \nThere are ${alienFleet.length-1} ships remaining. `)
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
                                
                                btnExt.textContent='Loser'
                                
                                alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.missilePower} missile damage. Alien survives with ${alien.hull} hulls remaining.`)
                                enemyHit.style.animation='blink .5s 2'
                                alert(`Enemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]} \nYOU LOSE. `)
                                playerHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='win .5s 2'
                                playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
                                setBoard(USSAssembly,alien,alienFleet)
                                attackbtn.disabled=true;
                                retreat.disabled=true;
                                attackbtn.style.display='none'
                                retreat.style.display='none'
                                btn.style.display='block'
                            }
                            else{ //player survives damage so loop will start back up
                                setBoard(USSAssembly,alien,alienFleet)
                                
                                
                                alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.missilePower} missiledamage. Alien survives with ${alien.hull} hulls remaining. `)
                                enemyHit.style.animation='blink .5s 2'
                                alert(`Enemy strikes back. \n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} \nAlien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.`)
                                playerHit.style.animation='blink .5s 2'
                                btnExt.innerHTML="Click the attack button to attack the alien!"
                                attackbtn.disabled=false;
                                retreat.disabled=true;
                                proceed=false;
                            }
                        }
                        else{ //player doesn't receive damage so it attacks and loop starts back up 
                            alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.missilePower} missile damage. Alien survives with ${alien.hull} hulls remaining. `)
                            enemyHit.style.animation='blink .5s 2'
                            alert(`Enemy strikes back.\n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]}  \nYou have ${USSAssembly.hull} hulls remaining.`) 
                            btnExt.innerHTML="Click the attack button to attack the alien!"

                            attackbtn.disabled=false;
                            retreat.disabled=true;
                            proceed=false;
                        }
                    }     
                }
                else{//alien does not receive damage so it will attack
                    attack(USSAssembly,alien)
                    if(USSAssembly.hit==true){ //player receives damage can either be destroyed or survive
                        
                        if(USSAssembly.hull <= 0 ){//player  destroyed
                            
                            setBoard(USSAssembly,alien,alienFleet)
                            alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                            alert(`Enemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]}. \nAlien's ${alien.firepower} damage brought your hull number to ${USSAssembly.hull}.\nYOU LOSE.  `)
                            playerHit.style.animation='blink .5s 2'
                            enemyHit.style.animation='win .5s 2'
                            playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                            btnExt.textContent='Loser'
                            retreat.disabled=true;
                            attackbtn.disabled=true;
                        }
                        else{ //player survives so loops start back up 
                            
                            setBoard(USSAssembly,alien,alienFleet)
                            alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                            alert(`Enemy strikes back.\n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} \nAlien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.`)
                            playerHit.style.animation='blink .5s 2'
                            
                            btnExt.innerHTML="Click the attack button to attack the alien!"
                            attackbtn.disabled=false;
                            retreat.disabled=true;
                            proceed=false;

                        }
                    }
                    else{//player doesn't receive damge so loops starts back up
                        setBoard(USSAssembly,alien,alienFleet)
                        alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                        alert(`Enemy strikes back. \n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]} \nYou still have ${USSAssembly.hull} hulls.`)
                        btnExt.innerHTML="Click the attack button to attack the alien!"
                        attackbtn.disabled=false;
                        retreat.disabled=true;
                        proceed=false;
                    }
                } 
            }
            else{
                attack(alien,USSAssembly) 
                     //if alien receives damage: it either can be destroyed or can survive the damage 
                if(alien.hit==true){ 
                    if(alien.hull <= 0 ){ //alien is destroyed
                        if(alienFleet.length-1==0){ //last alien in the array is destroyed so print message and decrement alienFleet array to end while loop
                            setBoard(USSAssembly,alien,alienFleet)

                            alert(`Entire enemy fleet destroyed. \nYour ${USSAssembly.firepower} damage brought the last enemy's hull to ${alien.hull}. `)
                            
                            alert(`Looks like you're not done yet! You've greavely upset the MotherShip! She's decided to come wreak havoc on earth. Face her wrath and stop her! The world is depending on you.`)
                            enemyHit.style.animation='blink .5s 2'
                            btnExt.textContent='Choose to attack the MotherShip or retreat'    
                            retreat.disabled=false
                            //attackbtn.disabled=true
                            attackbtn.style.display='none'
                            attackMom.disabled=false
                            attackMom.style.display='block'
                            //btn.disabled=false
                            alienFleet.shift()  
                            alien=alienFleet[0]  
                            proceed=false

                            
                        }
                        else{//alien is destroyed but there a still more aliens so print message and give player option to retreat(end loop) or attack(begin loop from beginning)
                            
                            btnExt.textContent='Choose either to retreat or attack'
                            retreat.disabled=false
                            setBoard(USSAssembly,alien,alienFleet)
                            
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
                                
                                btnExt.textContent='Loser'
                                
                                alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining.`)
                                enemyHit.style.animation='blink .5s 2'
                                alert(`Enemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]} \nYOU LOSE. `)
                                playerHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='win .5s 2'
                                playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
                                setBoard(USSAssembly,alien,alienFleet)
                                attackbtn.disabled=true;
                                retreat.disabled=true;
                                attackbtn.style.display='none'
                                retreat.style.display='none'
                                btn.style.display='block'
                            }
                            else{ //player survives damage so loop will start back up
                                setBoard(USSAssembly,alien,alienFleet)
                                
                                
                                alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining. `)
                                enemyHit.style.animation='blink .5s 2'
                                alert(`Enemy strikes back. \n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} \nAlien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.`)
                                playerHit.style.animation='blink .5s 2'
                                btnExt.innerHTML="Click the attack button to attack the alien!"
                                attackbtn.disabled=false;
                                retreat.disabled=true;
                                proceed=false;
                            }
                        }
                        else{ //player doesn't receive damage so it attacks and loop starts back up 
                            alert(`${playerHitsMessages[getRandomNumber(0,(playerHitsMessages.length-1),0)]} \nYou caused ${USSAssembly.firepower} damage. Alien survives with ${alien.hull} hulls remaining. `)
                            enemyHit.style.animation='blink .5s 2'
                            alert(`Enemy strikes back.\n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]}  \nYou have ${USSAssembly.hull} hulls remaining.`) 
                            btnExt.innerHTML="Click the attack button to attack the alien!"

                            attackbtn.disabled=false;
                            retreat.disabled=true;
                            proceed=false;
                        }
                    }     
                }
                else{//alien does not receive damage so it will attack
                    attack(USSAssembly,alien)
                    if(USSAssembly.hit==true){ //player receives damage can either be destroyed or survive
                        
                        if(USSAssembly.hull <= 0 ){//player  destroyed
                            
                            setBoard(USSAssembly,alien,alienFleet)
                            alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                            alert(`Enemy strikes back.\n${playerDestroyed[getRandomNumber(0,(playerDestroyed.length-1),0)]}. \nAlien's ${alien.firepower} damage brought your hull number to ${USSAssembly.hull}.\nYOU LOSE.  `)
                            playerHit.style.animation='blink .5s 2'
                            enemyHit.style.animation='win .5s 2'
                            playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                            btnExt.textContent='Loser'
                            retreat.disabled=true;
                            attackbtn.disabled=true;
                        }
                        else{ //player survives so loops start back up 
                            
                            setBoard(USSAssembly,alien,alienFleet)
                            alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                            alert(`Enemy strikes back.\n${alienHitsMessages[getRandomNumber(0,(alienHitsMessages.length-1),0)]} \nAlien caused ${alien.firepower} damage. You have ${USSAssembly.hull} hulls remaining.`)
                            playerHit.style.animation='blink .5s 2'
                            
                            btnExt.innerHTML="Click the attack button to attack the alien!"
                            attackbtn.disabled=false;
                            retreat.disabled=true;
                            proceed=false;

                        }
                    }
                    else{//player doesn't receive damge so loops starts back up
                        setBoard(USSAssembly,alien,alienFleet)
                        alert(`${playerMisssesMessages[getRandomNumber(0,(playerMisssesMessages.length-1),0)]} \nAlien still has ${alien.hull} hulls.`)
                        alert(`Enemy strikes back. \n${alienMissesMessages[getRandomNumber(0,(alienMissesMessages.length-1),0)]} \nYou still have ${USSAssembly.hull} hulls.`)
                        btnExt.innerHTML="Click the attack button to attack the alien!"
                        attackbtn.disabled=false;
                        retreat.disabled=true;
                        proceed=false;
                    }
                } 
            }
            
        }
    }

    
     

    attackMom.addEventListener('click', function(e){
        enemyHit.style.backgroundImage="url(https://cdn.dribbble.com/users/2071833/screenshots/4099324/media/1e810299b32e6aef5ee3e3f3f9f7f4f1.gif)"
    
        let pod
        if(motherShip.pods.length!=0){
            pod=motherShip.pods[0]
            setBoard2(USSAssembly,pod,pods)
        }
        else{
            setBoard3(USSAssembly,motherShip)
        }
        console.log(pod)
        console.log(motherShip)
        console.log(pods)

        let proceed=true;
        retreat.disabled=false
        enemyHit.style.animation='none'
        playerHit.style.animation='none'

        while(proceed==true && motherShip.hull > 0 && USSAssembly.hull > 0 ){
            enemyHit.style.animation='none'
            playerHit.style.animation='none'
            
            //call attack method, player attacks
            if(deployMissile==true){
                useMissile(motherShip,USSAssembly)
                missile.textContent=USSAssembly.missile
            
                if(USSAssembly.missile==0){
                    
                    box.style.display='none'
                    mSelection.style.display='none'
                    deployMissile=false
                }
                if(motherShip.pods.length==0){//all pods are destroyed so you can now attack the motherShip
                    if(motherShip.hit==true){//mothership was hit so it might be destroyed or might have survived
                        if(motherShip.hull <= 0){//mothership destroyed so player wins the game and loop ends
                            setBoard3(USSAssembly,motherShip)
                            attackMom.style.display='none'
                            retreat.style.display='none'
                            btn.style.display='block'
                            btnExt.textContent='Winner'
                            alert(`Congratulations! You destroyed the Mothership!\nYour ${USSAssembly.missilePower} missile damage brought the mothership's hull down to ${motherShip.hull}. \nYOU WIN! `)
                            enemyHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
                            enemyHit.style.animation='blink .5s 2'
                            playerHit.style.animation='win .5s 2'
                            
                            proceed=false
                        }
                        else{//motherShip survives hit so she'll attack and she can either miss or hit
                            attack(USSAssembly,motherShip)
                        
                            if(USSAssembly.hit==true){//mothership's attack is successful, so player could die or survive
                                
                                if(USSAssembly.hull<=0){//player dies
                                    setBoard3(USSAssembly,motherShip)
                                    retreat.disabled=true
                                    attackMom.disabled=true
                                    retreat.style.display='none'
                                    attackMom.style.display='none'
                                    btn.style.display='block'
                                    btn.disabled=false
                                    btnExt.textContent="Loser"
                                    
                                    alert(`Automatic hit! You caused ${USSAssembly.missilePower} missile damage.\nMothership has ${motherShip.hull} hulls remaining.`)
                                    alert(`Mothership retaliates.\nYou have been eliminated! \nMothership's ${motherShip.firepower} damage brought your hull number to ${USSAssembly.hull}.\nYOU LOSE.`)
                                    playerHit.style.animation='blink .5s 2'
                                    enemyHit.style.animation='blink .5s 2'
                                    enemyHit.style.animation='win .5s 2'
                                    playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                                    
                                    proceed=false
                                }
                                else{//player survives
                                    setBoard3(USSAssembly,motherShip)
                                    btnExt.textContent="Attack the Mothership!"
                                    retreat.disabled=true
                                    attackMom.disabled=false
                                    alert(`Bullseye! You caused ${USSAssembly.missilePower} missile damage.\nMothership has ${motherShip.hull} hulls remaining.`)
                                    alert(`Mothership retaliates.\nYou've been hit! You received ${motherShip.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining. `)
                                    playerHit.style.animation='blink .5s 2'
                                    enemyHit.style.animation='blink .5s 2'
                                    
                                    proceed=false

                                }  
                                
                            }
                            else{//mothership attack attempt failed, while loop ends
                                setBoard3(USSAssembly,motherShip)
                                retreat.disabled=true
                                attackMom.disabled=false
                                btnExt.textContent="Attack the Mothership!"
                                alert(`Success! You caused ${USSAssembly.missilePower} missiledamage.\nMothership has ${motherShip.hull} hulls remaining.`)
                                alert(`Mothership retaliates.\nMothership's attack was unsuccessful. \nYou still have ${USSAssembly.hull} hulls remaining. `)
                                enemyHit.style.animation='blink .5s 2'
                                proceed=false
                            }
                        }
                    }
                    else{ //mothership is not hit so she'll attack and she can either miss of hit
                        attack(USSAssembly,motherShip)
                        if(USSAssembly.hit==true){ //player is hit so can either be destroyed or survive
                            if(USSAssembly.hull<=0){//player dies
                                setBoard3(USSAssembly,motherShip)
                                attackMom.style.display='none'
                                retreat.style.display='none'
                                btn.style.display='block'
                                btnExt.textContent='Loser'
                                alert(`Your fire flew right past the mothership!\nMothership still has ${motherShip.hull} hulls.`)
                                alert(`Mothership retaliates. \nOh no your ship succumbed to all the damages! \nMothership's ${motherShip.firepower} damage brought your hull to ${USSAssembly.hull}.\n YOU LOSE.`)
                                enemyHit.style.animation='win .5s 2'
                                playerHit.style.animation='blink .5s 2'
                                playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                                proceed=false
                            }
                            else{//player survives
                                setBoard3(USSAssembly,motherShip)
                                attackMom.disabled=false
                                retreat.disabled=true
                                alert(`Mothership was unaffected by your attack! \nMothership still has ${motherShip.hull} hulls.`)
                                alert(`Mothership retaliates. \nAnd she hits! Mothership caused ${motherShip.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining.`)
                                playerHit.style.animation='blink .5s 2'
                                proceed=false
                            }

                        }
                        else{//player is not hit so while loop ends
                            setBoard3(USSAssembly,motherShip)
                            retreat.disabled=true
                            attackMom.disabled=false
                            btnExt.textContent='Attack the Mothership!'
                            alert(`Oh no! Mothership survived your attack.\nMothership still has ${motherShip.hull} hulls.`)
                            alert(`Mothership retaliates.\nYou dodged Mothership's attack!\nYou still have ${USSAssembly.hull} hulls remaining`)
                            proceed=false
                        }
                        
                    }

                }
                else{ //there are still some pods remaining
                    if(pod.hit==true){//pod was hit so it might be destroyed or might have survived
                        if(pod.maxResistance <= 0){//pod destroyed player have to check if all pods destroyed or not
                            if(motherShip.pods.length-1==0){//all pods destroyed
                                setBoard2(USSAssembly,pod,pods)
                                attackMom.disabled=false
                                retreat.disabled=false
                                btnExt.textContent='Choose to attack the defenseless Mothership or retreat'
                                alert(`All weapon pods have been destroyed. \nYour ${USSAssembly.missilePower} missile damage brought last pod's life force to ${pod.maxResistance}. \nMothership is now defenseless without her weapon pods!`)
                                enemyHit.style.animation='blink .5s 2'
                                pods.shift()
                                pod=motherShip.pods[0]
                                proceed=false

                            }
                            else{//pods remaining
                                setBoard2(USSAssembly,pod,pods)
                                attackMom.disabled=false
                                retreat.disabled=false
                                btnExt.textContent='Choose to retreat or attack'
                                alert(`Woo hoo! Weapon pod down! \nYour ${USSAssembly.missilePower} missile damage brought the weapon pod's life force to ${pod.maxResistance}. \nRemaining active weapon pods = ${motherShip.pods.length}.`)  
                                enemyHit.style.animation='blink .5s 2'
                                pods.shift()
                                pod=motherShip.pods[0]
                                proceed=false
                            }     
                    }
                    else{//pod survives so pod will attack and can either miss or hit
                        attack(USSAssembly,pod)
                        
                        if(USSAssembly.hit==true){//pods attack is successful, so player could die or survive
                            
                            if(USSAssembly.hull<=0){//player dies 
                                setBoard2(USSAssembly,pod,pods)
                                retreat.disabled=true
                                attackMom.disabled=true
                                retreat.style.display='none'
                                attackMom.style.display='none'
                                btn.style.display='block'
                                btn.disabled=false
                                btnExt.textContent="Loser"
                                
                                alert(`That's a hit! \nYou caused ${USSAssembly.missilePower} missile damage.\n Weapon pod's life force is ${pod.maxResistance}.`)
                                alert(`Pod aims and shoots.\nBoom! You are dead! \nWeapon pod's ${pod.firepower} damage brought your hull number down to ${USSAssembly.hull}.\nYOU LOSE.`)
                                playerHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='win .5s 2'
                                playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                                
                                proceed=false
                            }
                            else{//player survives
                                setBoard2(USSAssembly,pod,pods)
                                btnExt.textContent="Attack the weapon pod!"
                                retreat.disabled=true
                                attackMom.disabled=false
                                alert(`Direct hit! \nYou caused ${USSAssembly.missilePower} missile damage. \nWeapon pod's life force is ${pod.maxResistance}.`)
                                alert(`Weapon pod aims and fires.\nOh no! You received ${pod.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining. `)
                                playerHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='blink .5s 2'
                                
                                proceed=false

                            }  
                            
                        }
                        else{//pod attack attempt failed, while loop ends
                            setBoard2(USSAssembly,pod,pods)
                            retreat.disabled=true
                            attackMom.disabled=false
                            btnExt.textContent="Attack the weapon pod!"
                            alert(`A hit! You caused ${USSAssembly.missilePower} missile damage. Weapon pod's remaining life force is ${pod.maxResistance}.`)
                            alert(`Weapon pod aims and fires.\nYou came out unscathed. You still have ${USSAssembly.hull} hulls remaining. `)
                            enemyHit.style.animation='blink .5s 2'
                            proceed=false
                        }
                    }
                }
                else{ //pod is not hit so pod attacks and can either miss or hit
                    attack(USSAssembly,pod)
                    if(USSAssembly.hit==true){ //player is hit so can either be destroyed or survive
                        if(USSAssembly.hull<=0){//player dies
                            setBoard2(USSAssembly,pod,pods)
                            attackMom.style.display='none'
                            retreat.style.display='none'
                            btn.style.display='block'
                            alert(`You completely missed the weapon pod.\nWeapon pod still has a life force of ${pod.maxResistance}.`)
                            alert('Weapon pod aims and fires. \nOh no! Your ship is destroyed!\n YOU LOSE.')
                            enemyHit.style.animation='win .5s 2'
                            playerHit.style.animation='blink .5s 2'
                            playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                            proceed=false
                        }
                        else{//player survives
                            setBoard2(USSAssembly,pod,pods)
                            attackMom.disabled=false
                            retreat.disabled=true
                            btnExt.textContent='Attack the Weapon pod!'
                            alert(`Fire flew right past the weapon pod! \nWeapon pod still has a life force of ${pod.maxResistance}.`)
                            alert(`Weapon pod aims and fires. \nAnd you're hit! Weapon pod caused ${pod.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining.`)
                            playerHit.style.animation='blink .5s 2'
                            proceed=false
                        }

                    }
                    else{//player is not hit so while loop ends
                        setBoard2(USSAssembly,pod,pods)
                        retreat.disabled=true
                        attackMom.disabled=false
                        btnExt.textContent='Attack the Weapon pod!'
                        alert(`Weapon pod was unaffected by attack.\nWeapon pod still has a life force of ${pod.maxResistance}.`)
                        alert(`Weapon pod aims and fires.\nYou deflected the fire!\nYou still have ${USSAssembly.hull} hulls remaining`)
                        proceed=false
                    }
                    
                }


                }

            }
            else{
                attack(motherShip,USSAssembly) 
                
                if(motherShip.pods.length==0){//all pods are destroyed so you can now attack the motherShip
                    if(motherShip.hit==true){//mothership was hit so it might be destroyed or might have survived
                        if(motherShip.hull <= 0){//mothership destroyed so player wins the game and loop ends
                            setBoard3(USSAssembly,motherShip)
                            attackMom.style.display='none'
                            retreat.style.display='none'
                            btn.style.display='block'
                            btnExt.textContent='Winner'
                            alert(`Congratulations! You destroyed the Mothership!\nYour ${USSAssembly.firepower} damage brought the mothership's hull down to ${motherShip.hull}. \nYOU WIN! `)
                            enemyHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
                            enemyHit.style.animation='blink .5s 2'
                            playerHit.style.animation='win .5s 2'
                            
                            proceed=false
                        }
                        else{//motherShip survives hit so she'll attack and she can either miss or hit
                            attack(USSAssembly,motherShip)
                        
                            if(USSAssembly.hit==true){//mothership's attack is successful, so player could die or survive
                                
                                if(USSAssembly.hull<=0){//player dies
                                    setBoard3(USSAssembly,motherShip)
                                    retreat.disabled=true
                                    attackMom.disabled=true
                                    retreat.style.display='none'
                                    attackMom.style.display='none'
                                    btn.style.display='block'
                                    btn.disabled=false
                                    btnExt.textContent="Loser"
                                    
                                    alert(`Automatic hit! You caused ${USSAssembly.firepower} damage.\nMothership has ${motherShip.hull} hulls remaining.`)
                                    alert(`Mothership retaliates.\nYou have been eliminated! \nMothership's ${motherShip.firepower} damage brought your hull number to ${USSAssembly.hull}.\nYOU LOSE.`)
                                    playerHit.style.animation='blink .5s 2'
                                    enemyHit.style.animation='blink .5s 2'
                                    enemyHit.style.animation='win .5s 2'
                                    playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                                    
                                    proceed=false
                                }
                                else{//player survives
                                    setBoard3(USSAssembly,motherShip)
                                    btnExt.textContent="Attack the Mothership!"
                                    retreat.disabled=true
                                    attackMom.disabled=false
                                    alert(`Bullseye! You caused ${USSAssembly.firepower} damage.\nMothership has ${motherShip.hull} hulls remaining.`)
                                    alert(`Mothership retaliates.\nYou've been hit! You received ${motherShip.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining. `)
                                    playerHit.style.animation='blink .5s 2'
                                    enemyHit.style.animation='blink .5s 2'
                                    
                                    proceed=false

                                }  
                                
                            }
                            else{//mothership attack attempt failed, while loop ends
                                setBoard3(USSAssembly,motherShip)
                                retreat.disabled=true
                                attackMom.disabled=false
                                btnExt.textContent="Attack the Mothership!"
                                alert(`Success! You caused ${USSAssembly.firepower} damage.\nMothership has ${motherShip.hull} hulls remaining.`)
                                alert(`Mothership retaliates.\nMothership's attack was unsuccessful. \nYou still have ${USSAssembly.hull} hulls remaining. `)
                                enemyHit.style.animation='blink .5s 2'
                                proceed=false
                            }
                        }
                    }
                    else{ //mothership is not hit so she'll attack and she can either miss of hit
                        attack(USSAssembly,motherShip)
                        if(USSAssembly.hit==true){ //player is hit so can either be destroyed or survive
                            if(USSAssembly.hull<=0){//player dies
                                setBoard3(USSAssembly,motherShip)
                                attackMom.style.display='none'
                                retreat.style.display='none'
                                btn.style.display='block'
                                btnExt.textContent='Loser'
                                alert(`Your fire flew right past the mothership!\nMothership still has ${motherShip.hull} hulls.`)
                                alert(`Mothership retaliates. \nOh no your ship succumbed to all the damages! \nMothership's ${motherShip.firepower} damage brought your hull to ${USSAssembly.hull}.\n YOU LOSE.`)
                                enemyHit.style.animation='win .5s 2'
                                playerHit.style.animation='blink .5s 2'
                                playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                                proceed=false
                            }
                            else{//player survives
                                setBoard3(USSAssembly,motherShip)
                                attackMom.disabled=false
                                retreat.disabled=true
                                alert(`Mothership was unaffected by your attack! \nMothership still has ${motherShip.hull} hulls.`)
                                alert(`Mothership retaliates. \nAnd she hits! Mothership caused ${motherShip.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining.`)
                                playerHit.style.animation='blink .5s 2'
                                proceed=false
                            }

                        }
                        else{//player is not hit so while loop ends
                            setBoard3(USSAssembly,motherShip)
                            retreat.disabled=true
                            attackMom.disabled=false
                            btnExt.textContent='Attack the Mothership!'
                            alert(`Oh no! Mothership survived your attack.\nMothership still has ${motherShip.hull} hulls.`)
                            alert(`Mothership retaliates.\nYou dodged Mothership's attack!\nYou still have ${USSAssembly.hull} hulls remaining`)
                            proceed=false
                        }
                        
                    }

                }
                else{ //there are still some pods remaining
                    if(pod.hit==true){//pod was hit so it might be destroyed or might have survived
                        if(pod.maxResistance <= 0){//pod destroyed player have to check if all pods destroyed or not
                            if(motherShip.pods.length-1==0){//all pods destroyed
                                setBoard2(USSAssembly,pod,pods)
                                attackMom.disabled=false
                                retreat.disabled=false
                                btnExt.textContent='Choose to attack the defenseless Mothership or retreat'
                                alert(`All weapon pods have been destroyed. \nYour ${USSAssembly.firepower} damage brought last pod's life force to ${pod.maxResistance}. \nMothership is now defenseless without her weapon pods!`)
                                enemyHit.style.animation='blink .5s 2'
                                pods.shift()
                                pod=motherShip.pods[0]
                                proceed=false

                            }
                            else{//pods remaining
                                setBoard2(USSAssembly,pod,pods)
                                attackMom.disabled=false
                                retreat.disabled=false
                                btnExt.textContent='Choose to retreat or attack'
                                alert(`Woo hoo! Weapon pod down! \nYour ${USSAssembly.firepower} damage brought the weapon pod's life force to ${pod.maxResistance}. \nRemaining active weapon pods = ${motherShip.pods.length}.`)  
                                enemyHit.style.animation='blink .5s 2'
                                pods.shift()
                                pod=motherShip.pods[0]
                                proceed=false
                            }     
                    }
                    else{//pod survives so pod will attack and can either miss or hit
                        attack(USSAssembly,pod)
                        
                        if(USSAssembly.hit==true){//pods attack is successful, so player could die or survive
                            
                            if(USSAssembly.hull<=0){//player dies 
                                setBoard2(USSAssembly,pod,pods)
                                retreat.disabled=true
                                attackMom.disabled=true
                                retreat.style.display='none'
                                attackMom.style.display='none'
                                btn.style.display='block'
                                btn.disabled=false
                                btnExt.textContent="Loser"
                                
                                alert(`That's a hit! \nYou caused ${USSAssembly.firepower} damage.\n Weapon pod's life force is ${pod.maxResistance}.`)
                                alert(`Pod aims and shoots.\nBoom! You are dead! \nWeapon pod's ${pod.firepower} damage brought your hull number down to ${USSAssembly.hull}.\nYOU LOSE.`)
                                playerHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='win .5s 2'
                                playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                                
                                proceed=false
                            }
                            else{//player survives
                                setBoard2(USSAssembly,pod,pods)
                                btnExt.textContent="Attack the weapon pod!"
                                retreat.disabled=true
                                attackMom.disabled=false
                                alert(`Direct hit! \nYou caused ${USSAssembly.firepower} damage. \nWeapon pod's life force is ${pod.maxResistance}.`)
                                alert(`Weapon pod aims and fires.\nOh no! You received ${pod.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining. `)
                                playerHit.style.animation='blink .5s 2'
                                enemyHit.style.animation='blink .5s 2'
                                
                                proceed=false

                            }  
                            
                        }
                        else{//pod attack attempt failed, while loop ends
                            setBoard2(USSAssembly,pod,pods)
                            retreat.disabled=true
                            attackMom.disabled=false
                            btnExt.textContent="Attack the weapon pod!"
                            alert(`A hit! You caused ${USSAssembly.firepower} damage. Weapon pod's remaining life force is ${pod.maxResistance}.`)
                            alert(`Weapon pod aims and fires.\nYou came out unscathed. You still have ${USSAssembly.hull} hulls remaining. `)
                            enemyHit.style.animation='blink .5s 2'
                            proceed=false
                        }
                    }
                }
                else{ //pod is not hit so pod attacks and can either miss or hit
                    attack(USSAssembly,pod)
                    if(USSAssembly.hit==true){ //player is hit so can either be destroyed or survive
                        if(USSAssembly.hull<=0){//player dies
                            setBoard2(USSAssembly,pod,pods)
                            attackMom.style.display='none'
                            retreat.style.display='none'
                            btn.style.display='block'
                            alert(`You completely missed the weapon pod.\nWeapon pod still has a life force of ${pod.maxResistance}.`)
                            alert('Weapon pod aims and fires. \nOh no! Your ship is destroyed!\n YOU LOSE.')
                            enemyHit.style.animation='win .5s 2'
                            playerHit.style.animation='blink .5s 2'
                            playerHit.style.backgroundImage="url(https://images.squarespace-cdn.com/content/v1/544ff970e4b0c2f7a273e9b6/1558280595707-9VRDRGOVXX877H4TGYDN/Tomb-eyes-loop.gif)"
    
                            proceed=false
                        }
                        else{//player survives
                            setBoard2(USSAssembly,pod,pods)
                            attackMom.disabled=false
                            retreat.disabled=true
                            btnExt.textContent='Attack the Weapon pod!'
                            alert(`Fire flew right past the weapon pod! \nWeapon pod still has a life force of ${pod.maxResistance}.`)
                            alert(`Weapon pod aims and fires. \nAnd you're hit! Weapon pod caused ${pod.firepower} damage. \nYou have ${USSAssembly.hull} hulls remaining.`)
                            playerHit.style.animation='blink .5s 2'
                            proceed=false
                        }

                    }
                    else{//player is not hit so while loop ends
                        setBoard2(USSAssembly,pod,pods)
                        retreat.disabled=true
                        attackMom.disabled=false
                        btnExt.textContent='Attack the Weapon pod!'
                        alert(`Weapon pod was unaffected by attack.\nWeapon pod still has a life force of ${pod.maxResistance}.`)
                        alert(`Weapon pod aims and fires.\nYou deflected the fire!\nYou still have ${USSAssembly.hull} hulls remaining`)
                        proceed=false
                    }
                    
                }


                }
            }
            

        
           
        }
        
    })
    
  
    attackbtn.addEventListener('click', pressAttack )

    retreat.addEventListener('click',function(e){
        btnExt.textContent="You chose retreat. End of Game"
        //attackbtn.disabled=true;
        attackbtn.style.display='none'
        //retreat.disabled=true;
        retreat.style.display='none'
        btn.style.display='block'
        attackMom.style.display='none'
        
        //btn.disabled=false;
        
    })


 
   
}

//when player clicks button the game starts
btn.addEventListener('click',start)