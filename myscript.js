function createShip(length, type, row, column, orientation){
   return{
       shipType: type,
       row: row,
       column: column,
       orientation: orientation,
       shipLocations: [],
       shipLength: length,
       hitsTaken: 0,
       sunk: false,
       hit(){
           return ++this.hitsTaken;
       },
       isSunk() {
            if(this.shipLength <= this.hitsTaken){
                return this.sunk = true;
            }
            else{
                return this.sunk = false;
            }
       }
   }
}

function createGameBoard(player, opponentTracker, display,opponent, info){
    return{
        player: player,
        chosenOrientation: "Horizontal",
        gameBoardColumns: 10,
        playerTurn: true,
        gameBoardRows:["A","B","C","D","E","F","G","H","I","J"],
        gameBoard:[],
        attacks: [],
        allShipsPlaced: false,
        gameOver: false,
        shipTypes:[
            {
                name: "Carrier",
                length: 5
            },
            {
                name: "Battleship",
                length: 4
            },
            {
                name: "Submarine",
                length: 3
            },
            {
                name: "Destroyer",
                length: 3
            },
            {
                name: "Patrol Boat",
                length: 2
            }
        ],
        ships: [],
        shipCount: 0,
        makeBoard(){
            this.gameBoardRows.forEach(element=>{
                    for(i=0;i<this.gameBoardColumns;i++){
                        this.gameBoard.push({
                            row:element,
                            column:i
                        })
                    }
            })
            
        },
        makeShips(row,column,element, orientation){
            let coordinates = {
                row: row,
                column: column
            }
            let random = Math.floor(Math.random()*2)
                if(random == 0){
                    randomOrientation = "Vertical"
                }else{
                    randomOrientation = "Horizontal";
                }
            let newRow = this.gameBoardRows[Math.floor(Math.random()*(this.gameBoardRows.length))];
            let newColumn = Math.floor(Math.random()*this.gameBoardColumns); 
            let index = this.gameBoard.findIndex(cells => 
                cells.row === coordinates.row && cells.column === coordinates.column)
        try{      
            if(this.gameBoard[index].ship == undefined){
                if(orientation == 'Vertical'){
                    if(this.gameBoard[index + (element.length * 10)] != undefined){
                        let verticalCheck = true;
                        for(i=1; i< element.length; i++){
                            if(this.gameBoard[index + (i*10)].ship != undefined){
                                verticalCheck = false;
                            }
                        }
                        if(verticalCheck == true){
                            let newShip = createShip(element.length, element.name, row, column)
                            this.gameBoard[index].ship = newShip.shipType;
                            for(i=1; i<newShip.shipLength; i++){
                                this.gameBoard[index + (i*10)].ship = newShip.shipType;
                            }
                            this.ships.push(newShip);  
                        }else {
                            throw error;
                        }                                
                    }else{
                        throw error;
                    }

                } else if(orientation == "Horizontal"){
                    if(column + element.length <= 10){
                        let horizontalCheck = true;
                        for(i=1; i < element.length; i++)
                            if(this.gameBoard[index+i].ship != undefined){
                                horizontalCheck = false
                            }
                            if(horizontalCheck == true){
                                let newShip = createShip(element.length, element.name, row, column)
                                this.gameBoard[index].ship = newShip.shipType;
                                for(i=1; i < element.length; i++){
                                    this.gameBoard[index+i].ship = newShip.shipType;
                                }
                                this.ships.push(newShip);
                            }else{
                                throw error;
                            }
                        
                    }else{
                        throw error;
                    }
                }
            } else{
                throw error;
            }
        } catch(error){
            this.makeShips(newRow, newColumn, element, randomOrientation )
        }
    },
        receiveAttack(row,column){
            let coordinates = {
                row:row,
                column: column
            }
            let index = this.gameBoard.findIndex(cells => cells.row === coordinates.row && cells.column === coordinates.column)
            let thisShip = (this.gameBoard[index].ship)
            function findShip(ships){
                return ships.shipType == thisShip;
            }
            if(this.gameBoard[index].ship != undefined && this.gameBoard[index].attacked == undefined){
                this.gameBoard[index].attacked = true;
                let shipIndex = this.ships.findIndex(findShip)
                this.ships[shipIndex].hit()
                this.ships[shipIndex].isSunk()
                if(this.ships[shipIndex].isSunk() == true){
                    this.shipTracker();
                    display.innerHTML = "You've sunk their " + thisShip + "!"
                    if(this.ships.every(item => item.sunk == true)){
                        display.innerHTML = "You've sunk all of your opponents ships!"
                        this.gameOver = true;
                        this.showGameOver();
                    }
                }
                else{
                    display.innerHTML = "Direct Hit!"
                }

            }else if (this.gameBoard[index].attacked == undefined){
                this.gameBoard[index].attacked = true;
                display.innerHTML = "Miss!"
            }else{
                alert("Already attacked")
            }
        },
        populateShips(){
            this.shipTypes.forEach(element => {
                let randomRow = this.gameBoardRows[Math.floor(Math.random()*(this.gameBoardRows.length))];
                let randomColumn = Math.floor(Math.random()*this.gameBoardColumns);
                let random = Math.floor(Math.random()*2)
                if(random == 0){
                    randomOrientation = "Vertical"
                }else{
                    randomOrientation = "Horizontal";
                }         
                this.makeShips(randomRow,randomColumn , element, randomOrientation)
                
            })
            this.shipTracker();
        },
        placeShips(){
            let divs = document.querySelectorAll('.newDiv'+this.player)
            this.hoverShips(divs)
            divs.forEach(element =>{
                element.addEventListener('click', () => {
                    if(this.shipCount < this.shipTypes.length){
                        this.hoverShips(divs, this.shipCount)
                        let item = this.gameBoard[element.id]
                        this.makeShips(item.row, item.column, this.shipTypes[this.shipCount], this.chosenOrientation)
                        this.shipCount++
                        this.showShips('.newDiv' + this.player);
                        if(this.shipTypes[this.shipCount] != undefined){
                            info.innerHTML = this.player+ " , Place Your " + this.shipTypes[this.shipCount].name;
                        }
                        if(this.shipCount == 5){
                            this.allShipsPlaced = true;
                            this.shipTracker();
                            info.innerHTML = "Ready to Battle"
                            this.removeHover(divs);
                        }
                    }
                })
            })
        },
        hoverShips(board){
            board.forEach(div => {
                div.addEventListener('mouseenter', () => {
                    if(this.shipCount < 5){
                        if(this.chosenOrientation == 'Horizontal'){
                            let length = this.shipTypes[this.shipCount].length
                            console.log(length)
                            div.style.backgroundColor = "blue"

                        }
                    }
                })
                div.addEventListener('mouseleave', () => {
                    if(this.shipCount<5){
                        div.style.backgroundColor = "black";
                    }
                })
            })
        },
        showShips(selectClass){
            let divs = document.querySelectorAll(selectClass)
            this.gameBoard.forEach(element => {
                if(element.ship != undefined){
                    let index = this.gameBoard.indexOf(element)
                   divs[index].classList.add("playerShip")
                }
            })
        },
        newBoard( item){
            let divId = 0;
            this.gameBoard.forEach(element => {
                let newDiv = document.createElement('div');
                newDiv.classList.add("hover");
                newDiv.setAttribute('id', divId)
                newDiv.classList.add('newDiv'+this.player)
                if(this.player != "Computer"){
                    
                    newDiv.classList.add('player')
                }
                    if(element.ship !=undefined){
                        newDiv.classList.add(this.player + "Ship")
                    }
                item.appendChild(newDiv);
                divId++
            })
        },
        playerAttack(){
            let divs = document.querySelectorAll('.newDiv'+this.player)            
            divs.forEach(element => {
                element.addEventListener('click', () => {
                    if(this.gameOver == false){
                        this.sendAttack(element);
                    }
                    
                })
            })
        },
        sendAttack(element){
            if(opponent.allShipsPlaced == true){
                if(this.playerTurn == true){
                    if(this.attacks.includes(element.id) == false){
                        this.playerTurn = false;
                        let item = this.gameBoard[element.id]
                        this.receiveAttack(item.row, item.column, display)
                        this.attacks.push(element.id)
                            if(item.ship != undefined){
                                element.classList.add('hit');
                            }
                            else{
                                element.classList.add('attacked');
                            }
                    this.nextAttack();
                    }
                }
            }else{info.innerHTML = "Please place all ships"}
        },
        computerAttack(){
            let divs = document.querySelectorAll('.newDiv' + this.player)
            let randomIndex = Math.floor(Math.random()*this.gameBoard.length);
            if(this.attacks.includes(randomIndex) == false){
                let randomRow = this.gameBoard[randomIndex].row;
                let randomColumn = this.gameBoard[randomIndex].column;        
                this.receiveAttack(randomRow, randomColumn, display)
                this.attacks.push(randomIndex)
                divs.forEach(element => {
                    if(element.id == randomIndex){
                        let item = this.gameBoard[randomIndex]
                        if(item.ship != undefined){
                            element.classList.add('hit');     
                        }
                        else{
                            element.classList.add('attacked');
                        }
                    }
                }) 
            }else{
                this.computerAttack();
            }
        },
        nextAttack(){
            setTimeout(() => { 
                opponent.computerAttack();
                this.playerTurn = true;
            }, 500);
        },
        changeOrientation(){
            if(this.chosenOrientation == "Horizontal"){
                this.chosenOrientation = "Vertical"
            } else{
                this.chosenOrientation = "Horizontal"
            }
        },
        shipTracker(){
            let shipTotal = 0;
            console.log(this.ships)
            this.ships.forEach(element => {
                if(element.sunk == false){
                    shipTotal++
                }
            })
            opponentTracker.innerHTML = "Ships Left: " + shipTotal;
        },
        removeHover(board){
            board.forEach(element => {
                element.classList.remove('hover');
            })
        },
        showGameOver(){
            info.innerHTML = "Game Over"
            let playerDivs = document.querySelectorAll('.newDiv'+this.player)
            let computerDivs = document.querySelectorAll('.newDivComputer')
            this.removeHover(playerDivs);
            this.removeHover(computerDivs);

        }
    }
}




function startGame(){
    let screen = document.getElementById('display')
    let computerScreen = document.getElementById('screenTwo')
    let playerScreen = document.getElementById('screenOne')
    let playerTracker = document.getElementById('computerTracker');
    let computerTracker = document.getElementById('playerTracker');
    let orientationButton = document.getElementById('orientationBtn')
    let orientationDisplay = document.getElementById('showOrientation')
    let player = document.getElementById('playerBoard');
    let computer = document.getElementById('computerBoard');
    let playerBoard = createGameBoard("Cameron", computerTracker, playerScreen,undefined, screen);

    let computerBoard = createGameBoard("Computer", playerTracker, computerScreen,playerBoard, screen);
    
    orientationButton.addEventListener('click', () => {
    playerBoard.changeOrientation();
         orientationDisplay.textContent = playerBoard.chosenOrientation;
    })
    playerBoard.makeBoard();
    computerBoard.makeBoard();
    playerBoard.newBoard(player);
    computerBoard.newBoard(computer);
    computerBoard.populateShips();
    playerBoard.placeShips();
    computerBoard.playerAttack();
}

startGame();







module.exports = {createShip, createGameBoard}