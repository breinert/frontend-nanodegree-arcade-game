'use strict';
//Declare variables for DOM manipulation
const currentScore = document.querySelector('.score');
const endScore = document.querySelector('.modalScore');
const myModal = document.getElementById('modal');
const currentLives = document.querySelector('.lives');
const currentTime = document.querySelector('.timer');
//Declare variables for game play
let score = 0;
let lives = 3;
let sec = 15;
let timer;
let time;
let elapsed;
let start;
let playing = false;
let paused = false;

// Enemies our player must avoid
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.enemySpeed = ((Math.random() * 3) + 0.5);
        this.sprite = 'images/enemy-bug.png';
    }
    //When enemy reaches right side, reset to the left side
    update(dt) {
        this.isOutOfBoundsX = this.x > 5;
        this.isOutOfBoundsY = this.y < 1;
        if (this.isOutOfBoundsX) {
            this.x = -1;
        }
        else {
            this.x += (dt * this.enemySpeed);
        }
    }
    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
    }
}

//Class for player
class Player {
    constructor() {
        this.x = 2;
        this.y = 5;
        this.sprite = 'images/char-boy.png';
        this.moving = false;
        this.win = false;
    }
    update() {
        //If player is at top, add to score and reset position and time
        this.isOutOfBoundsX = this.x > 5;
        this.isOutOfBoundsY = this.y < 1;
        if (this.isOutOfBoundsY && !this.moving && !this.win) {
            score += 20;
            this.x = 2;
            this.y = 5;
            playing = false;
            clearTimer();
            initialClick();
        }
        //If time runs out, take away a life and reset position and time
        if (sec === 0) {
            this.x = 2;
            this.y = 5;
            playing = false;
            clearTimer();
            initialClick();
            lives -= 1;
            sec = 15;
            if (lives <= 0) {
                openModal();
            }
        }
        //update scoreboard on page
        currentScore.innerHTML = score;
        currentLives.innerHTML = lives;
        currentTime.innerHTML = sec;
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
        this.moving = false;
    }
    handleInput(input) {
        switch (input) {
            case 'left':
                this.x = this.x > 0 ? this.x - 1 : this.x;
                break;
            case 'up':
                this.y = this.y > 0 ? this.y - 1 : this.y;
                break;
            case 'right':
                this.x = this.x < 4 ? this.x + 1 : this.x;
                break;
            case 'down':
                this.y = this.y < 5 ? this.y + 1 : this.y;
                break;
            default:
                break;
        }
        this.moving = true;
    }
}

//instantiate enemies and player
const allEnemies = [...Array(3)].map((_,i)=>new Enemy(i, i+1));
const player = new Player();

//Listener for movement
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode])
});

//Listener for initial movement to start timer
document.addEventListener('keydown', initialClick);

//Function for initial movement to start timer
function initialClick() {
    if (playing === false) {
        start = new Date().getTime();
        setTimer();
        playing = true;
    }
}

//Timer function
function setTimer() {
    timer = setInterval(function() {
        time = ((new Date().getTime()) - start);
        elapsed = Math.floor(time / 100) / 10;
        sec = 15  - (parseInt(elapsed%60));
    }, 100);
}

//Function to stop the timer
function clearTimer() {
    clearInterval(timer);
}

//End of game modal
function openModal() {
    paused = true;
    myModal.style.display = 'block';
    endScore.innerHTML = score;
    document.getElementsByClassName('play-again')[0].addEventListener('click', reset);
    document.getElementsByClassName('quit')[0].addEventListener('click', clearModal);
}

//Function to reset game after modal display
function reset() {
    clearModal();
    lives = 3;
    score = 0;
    sec = 15;
    currentTime.innerHTML = sec;
    allEnemies.forEach(function(enemy) {
        enemy.enemySpeed = ((Math.random() * 3) + 0.5);
    });
    clearTimer();
    playing = false;
    paused = false;
}

//Function to clear the modal from the screen
function clearModal() {
    myModal.style.display = 'none';
}

//Function to check if the player and the enemies are colliding
function checkCollisions() {
    allEnemies.forEach(function(enemy) {
        if (enemy.y === player.y) {
            if (enemy.x >= player.x - 0.5 && enemy.x <= player.x + 0.5) {
                player.y = 5;
                player.x = 2;
                lives -= 1;
                if (lives <= 0) {
                    openModal();
                }
                playing = false;
                clearTimer();
                initialClick();
            }
        }
    });
}
