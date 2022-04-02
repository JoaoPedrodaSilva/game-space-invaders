//prevents scroll screen with keyboard
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

//initial screen
const initialScreen = document.querySelector('.initial-screen')
const anyDifficultButton = document.querySelectorAll('.difficult-button')
let difficult

//get ready screen
const getReadyScreen = document.querySelector('.get-ready-screen')
const getReadyDisplay = document.querySelector('.get-ready-display')

//game screen
const gameScreen = document.querySelector('.game-screen')
const gameGrid = document.querySelector('.game-grid')
const scoreDisplay = document.querySelector('.score')
let allSquares
let spaceInvadersTimer
let laserTimer
let laserCurrentPosition
let laserFired
let score
let shooterCurrentPosition
let spaceInvadersDirection
let lineWidth
let spaceInvaders
let spaceInvadersDestroyed

//post game screen
const postGameScreen = document.querySelector('.post-game-screen')
const finalScoreDisplay = document.querySelector('.final-score')
const messageDisplay = document.querySelector('.message')
const playAgainButton = document.querySelector('.play-again-button')


const prepareInitialScreen = () => {
    initialScreen.style.display = 'flex'
    getReadyScreen.style.display = 'none'
    gameScreen.style.display = 'none'
    postGameScreen.style.display = 'none'
    chooseDifficult()
}
const chooseDifficult = () => {
    anyDifficultButton.forEach(button => {
        button.addEventListener('click', event => {
            difficult = event.target.id
            getReady()
        })
    })
}
const getReady = () => {
    initialScreen.style.display = 'none'
    getReadyScreen.style.display = 'flex'
    getReadyDisplay.innerHTML = 3
    setTimeout( () => {getReadyDisplay.innerHTML = 2}, 500)
    setTimeout( () => {getReadyDisplay.innerHTML = 1}, 1000)
    setTimeout( () => {getReadyDisplay.innerHTML = 'GO!'}, 1500)
    setTimeout(startGame, 2000)
}
const startGame = () => {
    resetInitialParameters()
    createSquares()
    createSpaceInvaders()
    createShooter()
    
    document.addEventListener('keydown', moveShooterByKeyboard)
    document.addEventListener('keydown', shootLaserByKeyboard)
    if (difficult == 'easy') {
        spaceInvadersTimer = setInterval(autoMoveSpaceInvaders, 1000)   
    } else if (difficult == 'normal') {
        spaceInvadersTimer = setInterval(autoMoveSpaceInvaders, 750)
    } else {
        spaceInvadersTimer = setInterval(autoMoveSpaceInvaders, 500)   
    }    
}
const resetInitialParameters = () => {
    //screen settings
    getReadyScreen.style.display = 'none'
    gameScreen.style.display = 'flex'
    
    //shooter settings
    shooterCurrentPosition = 187
    laserCurrentPosition = shooterCurrentPosition
    laserFired = false
        
    //invader settings    
    spaceInvadersDirection = 1
    spaceInvadersDestroyed = []
    spaceInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]    
    
    //overall settings
    removeSquares()
    lineWidth = 15
    score = 0
    scoreDisplay.innerHTML = 0
    clearInterval(spaceInvadersTimer)
    clearInterval(laserTimer)
    messageDisplay.innerHTML = null
    messageDisplay.style.color = 'black'
    finalScoreDisplay.innerHTML = null    
}

const createSquares = () => {
    for (let i = 0; i < 225; i++) {
        const square = document.createElement('div')
        gameGrid.appendChild(square)
        square.classList.add('square')
    }
    allSquares = document.querySelectorAll('.square')
}
const removeSquares = () => {
    allSquares = document.querySelectorAll('.square')
    Array.from(allSquares).map( square => square.parentElement.removeChild(square))
}
const createSpaceInvaders = () => {    
    for (let i = 0; i < spaceInvaders.length; i++) {
        //only create the space invader if it has not been destroyed before
        if(!spaceInvadersDestroyed.includes(i)) {
            allSquares[spaceInvaders[i]].classList.add('space-invader')
        }        
    }
}
const removeSpaceInvaders = () => {
    for (let i = 0; i < spaceInvaders.length; i++) {
        allSquares[spaceInvaders[i]].classList.remove('space-invader')
    }
}
const createShooter = () => {
    allSquares[shooterCurrentPosition].classList.add('shooter')
}
const removeShooter = () => {
    allSquares[shooterCurrentPosition].classList.remove('shooter')
}

const moveShooterByKeyboard = (e) => {   
    if (e.key == 'ArrowLeft' && shooterCurrentPosition % lineWidth != 0) {
        removeShooter()
        shooterCurrentPosition -= 1
        createShooter()
    } else if (e.key =='ArrowRight' && shooterCurrentPosition % lineWidth < lineWidth - 1) {
        removeShooter()
        shooterCurrentPosition += 1
        createShooter()
    }
}
const moveShooterByClick = (direction) => {
    if (direction == 'left' && shooterCurrentPosition % lineWidth != 0) {
        removeShooter()
        shooterCurrentPosition -= 1
        createShooter()
    } else if (direction == 'right' && shooterCurrentPosition % lineWidth < lineWidth - 1) {
        removeShooter()
        shooterCurrentPosition += 1
        createShooter()
    }
} 
const shootLaserByKeyboard = (e) => {    
    if(e.key == 'ArrowUp' && !laserFired) {
        laserCurrentPosition = shooterCurrentPosition
        laserFired = true
        laserTimer = setInterval( () => {
            //remove the previous laser position            
            allSquares[laserCurrentPosition].classList.remove('laser')            
            
            //update laser position
            if(laserCurrentPosition >= lineWidth) {
                laserCurrentPosition -= lineWidth
                allSquares[laserCurrentPosition].classList.add('laser')
            }
            hitSpaceInvader()

        }, 50)
    }
}
const shootLaserByClick = () => {    
    if(!laserFired) { 
        laserCurrentPosition = shooterCurrentPosition
        laserFired = true      
        laserTimer = setInterval( () => {
            //remove the previous laser position            
            allSquares[laserCurrentPosition].classList.remove('laser')            
            
            //update laser position
            if(laserCurrentPosition >= lineWidth) {
                laserCurrentPosition -= lineWidth
                allSquares[laserCurrentPosition].classList.add('laser')
            }

            hitSpaceInvader()
        }, 50)
    }      
}
const autoMoveSpaceInvaders = () => {
    const spaceInvadersAtLeftEdge = spaceInvaders[0] % lineWidth == 0
    const spaceInvadersAtRightEdge = spaceInvaders[spaceInvaders.length - 1] % lineWidth == lineWidth - 1
    for (let i = 0; i < allSquares.length; i++) {
        allSquares[i].classList.remove('boom')        
    }

    removeSpaceInvaders()
    //move them down and change direction
    if(spaceInvadersAtRightEdge && spaceInvadersDirection == 1) {
        for (let i = 0; i < spaceInvaders.length; i++) {
            spaceInvaders[i] += lineWidth + 1            
        }  
        spaceInvadersDirection = -1      
    }
    if(spaceInvadersAtLeftEdge && spaceInvadersDirection == -1) {
        for (let i = 0; i < spaceInvaders.length; i++) {
            spaceInvaders[i] += lineWidth - 1            
        }  
        spaceInvadersDirection = 1      
    }
    //move them left or right
    for (let i = 0; i < spaceInvaders.length; i++) {
        spaceInvaders[i] += spaceInvadersDirection        
    }
    createSpaceInvaders()
    checkDefeat()
}
const hitSpaceInvader = () => {
    if (allSquares[laserCurrentPosition].classList.contains('space-invader')) {
        clearInterval(laserTimer)
        allSquares[laserCurrentPosition].classList.remove('laser')
        allSquares[laserCurrentPosition].classList.remove('space-invader')
        allSquares[laserCurrentPosition].classList.add('boom')          

        const spaceInvaderDestroyed = spaceInvaders.indexOf(laserCurrentPosition)
        spaceInvadersDestroyed.push(spaceInvaderDestroyed)

        score++
        scoreDisplay.innerHTML = score  
        laserFired = false
        
        checkWin()
    } else {
        missedShot()
    }
}
const missedShot = () => {
    if(laserCurrentPosition < 15) {
        clearInterval(laserTimer)
        allSquares[laserCurrentPosition].classList.remove('laser') 
        laserCurrentPosition = shooterCurrentPosition
        laserFired = false
    }    
}

const checkWin = () => {
    if (spaceInvadersDestroyed.length == spaceInvaders.length) {
        clearInterval(spaceInvadersTimer)
        clearInterval(laserTimer)
        document.removeEventListener('keydown', moveShooterByKeyboard)
        gameScreen.style.display = 'none'
        initialScreen.style.display = 'none'
        postGameScreen.style.display = 'flex'    
        messageDisplay.innerHTML = 'Nice! You won!<br>Can you do even better?'
        messageDisplay.style.color = 'blue'
        playAgain()
    }
}
const checkDefeat = () => {    
    for (let i = 0; i < spaceInvaders.length; i++) {
        if(spaceInvaders[spaceInvaders.length - 1] == 224) {
            gameOver()
        }        
    }
    if(allSquares[shooterCurrentPosition].classList.contains('space-invader')){
        gameOver()
    }
}
const gameOver = () => {
    clearInterval(spaceInvadersTimer)
    clearInterval(laserTimer)
    document.removeEventListener('keydown', moveShooterByKeyboard)
    gameScreen.style.display = 'none'
    initialScreen.style.display = 'none'
    postGameScreen.style.display = 'flex'    
    messageDisplay.innerHTML = 'Oh no...you lost.<br>Try again!'
    messageDisplay.style.color = 'red'
    finalScoreDisplay.innerHTML = `Final score: ${score}`
    playAgain()
}
const playAgain = () => {
    spaceInvadersDestroyed = []
    playAgainButton.addEventListener('click', () => {
        prepareInitialScreen()
    })
}

prepareInitialScreen()
