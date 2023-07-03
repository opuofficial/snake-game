
class Snake {
    constructor() {
        this.snakeBody = [{x: 5, y: 10}, {x: 6, y: 10}, {x: 7, y: 10}];
        this.drawSnake();
        this.currentFoodPosition = {};
        this.generateFood();
        this.direction = 'right';
        this.snakeTail = {};
        this.moveSnake();
        this.gameOver = false;
        this.speed = 100;
        this.score = 0;
    }


    moveSnake() {
        let snakeHead = this.snakeBody[this.snakeBody.length - 1];
        let newSnakeHead = {};

        if(this.direction == 'right') {
            newSnakeHead = { x: snakeHead.x + 1, y: snakeHead.y }
        } else if(this.direction == 'left') {
            newSnakeHead = { x: snakeHead.x - 1, y: snakeHead.y } 
        } else if(this.direction == 'up') {
            newSnakeHead = { x: snakeHead.x, y: snakeHead.y - 1 } 
        } else if(this.direction == 'down') {
            newSnakeHead = { x: snakeHead.x, y: snakeHead.y + 1 } 
        }

        this.snakeBody.push(newSnakeHead);
        this.snakeTail = this.snakeBody.shift();

        this.checkBoundary();
        this.checkCollision();

        if(!this.gameOver) {
            this.drawSnake();
            let atefood = this.checkFood();
            
            if(atefood) {
                this.snakeBody.unshift(this.currentFoodPosition);
            }

            setTimeout(() => {
                this.moveSnake();
            }, this.speed);
        } else {
            let score = document.querySelector('.score');
            score.innerHTML = 'Game Over!! Score: ' + this.score;
        }
    }
    

    checkCollision() {
        let snakeHead = this.snakeBody[this.snakeBody.length - 1];

        for(let i=0; i<this.snakeBody.length - 1; i++) {
            if(snakeHead.x == this.snakeBody[i].x && snakeHead.y == this.snakeBody[i].y) {
                this.gameOver = true;
            }
        }
    }


    checkFood() {
        let snakeHead = this.snakeBody[this.snakeBody.length - 1];

        if(snakeHead.x == this.currentFoodPosition.x && snakeHead.y == this.currentFoodPosition.y) {
            this.score++;
            this.updateScore();
            this.removeFood();
            this.generateFood();

            return true;
        }
    }


    removeFood() {
        let foodElement = document.querySelector(`[data-row="${this.currentFoodPosition.y}"][data-col="${this.currentFoodPosition.x}"]`);
        foodElement.classList.remove('food');
    }


    updateScore() {
        document.querySelector('.score').innerHTML = 'Score: ' + this.score;
    }


    checkBoundary() {
        let snakeHead = this.snakeBody[this.snakeBody.length - 1];

        if(snakeHead.x > 25 ||
            snakeHead.x < 1 ||
            snakeHead.y > 25 ||
            snakeHead.y < 1) {
            this.gameOver = true;
        }
    }


    changeDirection(changeTo) {
        if((this.direction == 'right' && changeTo == 'left') ||
            (this.direction == 'left' && changeTo == 'right') ||
            (this.direction == 'up' && changeTo == 'down') ||
            (this.direction == 'down' && changeTo == 'up')) {
            return;
        }

        this.direction = changeTo;
    }


    drawSnake() {
        if(this.snakeTail != undefined) {
            let snakeTail = document.querySelector(`[data-row="${this.snakeTail.y}"][data-col="${this.snakeTail.x}"]`);
            snakeTail.classList.remove('snake__body');
        }

        this.snakeBody.forEach(axis => {
            let snakeBody = document.querySelector(`[data-row="${axis.y}"][data-col="${axis.x}"]`);
            snakeBody.classList.add('snake__body');
        })
    }


    generateFood() {
        let { randomX: x, randomY: y } = this.generateRandomAxis();
        this.currentFoodPosition = { x, y };

        this.drawFood();
    }

    
    drawFood() {
        let foodElement = document.querySelector(`[data-row="${this.currentFoodPosition.y}"][data-col="${this.currentFoodPosition.x}"]`);
        foodElement.classList.add('food');
    }
    

    generateRandomAxis() {
        let randomX = Math.floor(Math.random() * 25) + 1;
        let randomY = Math.floor(Math.random() * 25) + 1;

        for(let i=0; i<this.snakeBody.length; i++) {
            if(this.snakeBody[i].x == randomX && this.snakeBody[i].y == randomY) {
                return this.generateRandomAxis();
            }
        }

        return { randomX, randomY }
    }
}


window.addEventListener('load', createSnakeBoard);

function createSnakeBoard() {
    let snakeBoard = document.querySelector('.snake__board');
    let row = 25;
    let col = 25;

    for(let i=1; i<=row; i++) {
        for(let j=1; j<=col; j++) {
            snakeBoard.appendChild(createBox(i, j));
        }
    }

    initSnake();
}


function createBox(row, col) {
    let box = document.createElement('div');
    box.setAttribute('data-row', row);
    box.setAttribute('data-col', col);

    return box;
}


function initSnake() {
    let snake = new Snake();
    let prevBtnPress;

    document.addEventListener('keydown', e => {
        if(prevBtnPress) {
            let now = Date.now();

            if(now - prevBtnPress < 100) {
                return;
            } else {
                prevBtnPress = now;
            }
        } else {
            prevBtnPress = Date.now();
        }
        
        switch(e.key) {
            case 'ArrowRight':
                snake.changeDirection('right');
                break;
            case 'ArrowLeft':
                snake.changeDirection('left');
                break;
            case 'ArrowUp':
                snake.changeDirection('up');
                break;
            case 'ArrowDown':
                snake.changeDirection('down');
                break;
        }
    })
}
