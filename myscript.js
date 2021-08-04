function createShip(length, type, row, column, orientation) {
    return {
        shipType: type,
        row: row,
        column: column,
        orientation: orientation,
        shipLocations: [],
        shipLength: length,
        hitsTaken: 0,
        sunk: false,
        hit() {
            return ++this.hitsTaken;
        },
        isSunk() {
            if (this.shipLength <= this.hitsTaken) {
                return this.sunk = true;
            }
            else {
                return this.sunk = false;
            }
        }
    }
}

function createGameBoard(player, opponentTracker, display, opponent, info, name) {
    return {
        player: player,
        chosenOrientation: "Horizontal",
        gameBoardColumns: 10,
        playerTurn: true,
        gameBoardRows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        gameBoard: [],
        attacks: [],
        allShipsPlaced: false,
        gameOver: false,
        shipTypes: [
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
        makeBoard() {
            this.gameBoardRows.forEach(element => {
                for (i = 0; i < this.gameBoardColumns; i++) {
                    this.gameBoard.push({
                        row: element,
                        column: i
                    })
                }
            })

        },
        makeShips(row, column, element, orientation) {
            let coordinates = {
                row: row,
                column: column
            }
            let randomOrientation = this.randomOrientation();
            let newRow = this.gameBoardRows[Math.floor(Math.random() * (this.gameBoardRows.length))];
            let newColumn = Math.floor(Math.random() * this.gameBoardColumns);
            let index = this.gameBoard.findIndex(cells =>
                cells.row === coordinates.row && cells.column === coordinates.column)
            try {
                if (this.gameBoard[index].ship == undefined) {
                    if (orientation == 'Vertical') {
                        if (this.gameBoard[index + (element.length * 10)] != undefined) {
                            let verticalCheck = true;
                            for (i = 1; i < element.length; i++) {
                                if (this.gameBoard[index + (i * 10)].ship != undefined) {
                                    verticalCheck = false;
                                }
                            }
                            if (verticalCheck == true) {
                                let newShip = createShip(element.length, element.name, row, column)
                                this.gameBoard[index].ship = newShip.shipType;
                                for (i = 1; i < newShip.shipLength; i++) {
                                    this.gameBoard[index + (i * 10)].ship = newShip.shipType;
                                }
                                this.ships.push(newShip);
                                this.shipCount++
                            } else {
                                throw error;
                            }
                        } else {
                            throw error;
                        }

                    } else if (orientation == "Horizontal") {
                        if (column + element.length <= 10) {
                            let horizontalCheck = true;
                            for (i = 1; i < element.length; i++)
                                if (this.gameBoard[index + i].ship != undefined) {
                                    horizontalCheck = false
                                }
                            if (horizontalCheck == true) {
                                let newShip = createShip(element.length, element.name, row, column)
                                this.gameBoard[index].ship = newShip.shipType;
                                for (i = 1; i < element.length; i++) {
                                    this.gameBoard[index + i].ship = newShip.shipType;
                                }
                                this.ships.push(newShip);
                                this.shipCount++;
                            } else {
                                throw error;
                            }

                        } else {
                            throw error;
                        }
                    }
                } else {
                    throw error;
                }
            } catch (error) {
                if(this.player == "Computer"){
                    this.makeShips(newRow, newColumn, element, randomOrientation)
                } 
            }
        },
        receiveAttack(row, column) {
            let coordinates = {
                row: row,
                column: column
            }
            let index = this.gameBoard.findIndex(cells => cells.row === coordinates.row && cells.column === coordinates.column)
            let thisShip = (this.gameBoard[index].ship)
            function findShip(ships) {
                return ships.shipType == thisShip;
            }
            if (this.gameBoard[index].ship != undefined && this.gameBoard[index].attacked == undefined) {
                this.gameBoard[index].attacked = true;
                this.gameBoard[index].hit = true;
                let shipIndex = this.ships.findIndex(findShip)
                this.ships[shipIndex].hit()
                this.ships[shipIndex].isSunk()
                if (this.ships[shipIndex].isSunk() == true) {
                    this.updateSunkShips();
                    this.shipTracker();
                    if(this.player == "Computer"){
                        display.innerHTML = "Direct Hit!"
                        info.innerHTML = "You've sunk their " + thisShip + "!"
                    }else{
                        display.innerHTML = "Direc Hit"
                        info.innerHTML = "They've sunk your <br>" + thisShip + "!";
                    }
                    if (this.ships.every(item => item.sunk == true)) {
                        if(this.player == "Computer"){
                            info.innerHTML = "Victory! You've sent those rust buckets crying to their motherboards"
                        }else{
                            info.innerHTML = "01011001 01101111 01110101 00100000 01001100 01101111 01110011 01100101"
                        }
                            this.gameOver = true;
                        this.showGameOver();
                    }
                }
                else {
                    display.innerHTML = "Direct Hit!"
                }

            } else if (this.gameBoard[index].attacked == undefined) {
                this.gameBoard[index].attacked = true;
                display.innerHTML = "Miss!"
            } 
        },
        populateShips() {
            this.shipTypes.forEach(element => {
                let randomRow = this.gameBoardRows[Math.floor(Math.random() * (this.gameBoardRows.length))];
                let randomColumn = Math.floor(Math.random() * this.gameBoardColumns);
                let randomOrientation =this.randomOrientation();
                this.makeShips(randomRow, randomColumn, element, randomOrientation)

            })
            this.shipTracker();
        },
        placeShips() {
            let divs = document.querySelectorAll('.newDiv' + this.player)
            this.hoverShips(divs);
            divs.forEach(element => {
                element.addEventListener('click', () => {
                    if (this.shipCount < this.shipTypes.length) {
                        let item = this.gameBoard[element.id]
                        this.makeShips(item.row, item.column, this.shipTypes[this.shipCount], this.chosenOrientation)
                        this.showShips('.newDiv' + this.player);
                        if (this.shipTypes[this.shipCount] != undefined) {
                            info.innerHTML = this.player + " , Place Your " + this.shipTypes[this.shipCount].name;
                        }
                        if (this.shipCount == 5) {
                            this.allShipsPlaced = true;
                            this.shipTracker();
                            info.innerHTML = "Ready to Battle"
                            this.removeHover(divs);
                        }
                    }
                })
            })
        },
        hoverShips(div){
            div.forEach(element => {
               element.addEventListener('mouseenter', () => {
                   if(this.allShipsPlaced == false){
                        let index = parseInt(element.id)
                        let column = this.gameBoard[index].column;
                        let length = this.shipTypes[this.shipCount].length
                        if (this.chosenOrientation == 'Vertical') {
                            if (this.gameBoard[index + (length * 10)] != undefined) {
                                let verticalCheck = true;
                                for (i = 0; i < length; i++) {
                                    if (this.gameBoard[index + (i * 10)].ship != undefined) {
                                        verticalCheck = false;
                                    }
                                }
                                if (verticalCheck == true) {
                                    for (i = 0; i < length; i++) {
                                        div[index + (i * 10)].classList.add('placeShip')
                                    }
                                } 
                            } 
                    
                        } else if (this.chosenOrientation == "Horizontal") {
                            if (column + length <= 10) {
                                let horizontalCheck = true;
                                for (i = 0; i < length; i++)
                                    if (this.gameBoard[index + i].ship != undefined) {
                                        horizontalCheck = false
                                    }
                                if (horizontalCheck == true) {
                                    for (i = 0; i < length; i++) {
                                        div[index + i].classList.add('placeShip')
                                    }
                                } 
                            } 
                        }
                   }
               })
               element.addEventListener('mouseleave', () => {
                   div.forEach(item => {
                       item.classList.remove('placeShip');
                   })
               })
           })
       },
        showShips(selectClass) {
            let divs = document.querySelectorAll(selectClass)
            this.gameBoard.forEach(element => {
                if (element.ship != undefined) {
                    let index = this.gameBoard.indexOf(element)
                    divs[index].classList.add("playerShip")
                }
            })
        },
        newBoard(item) {
            let divId = 0;
            this.gameBoard.forEach(element => {
                let newDiv = document.createElement('div');
                newDiv.classList.add("hover");
                newDiv.setAttribute('id', divId)
                newDiv.classList.add('newDiv' + this.player)
                if (this.player != "Computer") {
                    newDiv.classList.add('player')
                }
                if (element.ship != undefined) {
                    newDiv.classList.add(this.player + "Ship")
                }
                item.appendChild(newDiv);
                divId++
            })
        },
        playerAttack() {
            let divs = document.querySelectorAll('.newDiv' + this.player)
            divs.forEach(element => {
                element.addEventListener('click', () => {
                    if (this.gameOver == false) {
                        this.sendAttack(element);
                    }

                })
            })
        },
        sendAttack(element) {
            if (opponent.allShipsPlaced == true) {
                if (this.playerTurn == true) {
                    if (this.attacks.includes(element.id) == false) {
                        this.playerTurn = false;
                        let item = this.gameBoard[element.id]
                        this.receiveAttack(item.row, item.column, display)
                        this.attacks.push(element.id)
                        if (item.ship != undefined) {
                            element.classList.add('hit');
                        }
                        else {
                            element.classList.add('attacked');
                        }
                        this.nextAttack();
                    }
                }
            } else { info.innerHTML = "Please place all ships" }
        },
        computerAttack() {
            this.assignProbability();
            this.viableShipPlacement();
            let randomIndex = this.determinHighestProbability();
            let divs = document.querySelectorAll('.newDiv' + this.player)
            if (this.attacks.includes(randomIndex) == false) {
                let randomRow = this.gameBoard[randomIndex].row;
                let randomColumn = this.gameBoard[randomIndex].column;
                if(this.gameOver == false){
                    this.receiveAttack(randomRow, randomColumn, display)
                    this.attacks.push(randomIndex)
                    divs.forEach(element => {
                        if (element.id == randomIndex) {
                            let item = this.gameBoard[randomIndex]
                            if (item.ship != undefined) {
                                element.classList.add('hit');
                            }
                            else {
                                element.classList.add('attacked');
                            }
                        }
                    })
                }
            } else {
                this.computerAttack();
            }
        },
        nextAttack() {
            setTimeout(() => {
                opponent.computerAttack();
                this.playerTurn = true;
            }, 500);
        },
        changeOrientation() {
            if (this.chosenOrientation == "Horizontal") {
                this.chosenOrientation = "Vertical"
            } else {
                this.chosenOrientation = "Horizontal"
            }
        },
        shipTracker() {
            let shipTotal = 0;
            this.ships.forEach(element => {
                if (element.sunk == false) {
                    shipTotal++
                }
            })
            opponentTracker.innerHTML = "Ships: " + shipTotal;
        },
        removeHover(board) {
            board.forEach(element => {
                element.classList.remove('hover');
            })
        },
        showGameOver() {
            let playerDivs = document.querySelectorAll('.newDiv' + this.player)
            let computerDivs = document.querySelectorAll('.newDivComputer')
            this.removeHover(playerDivs);
            this.removeHover(computerDivs);

        },
        setName() {
            name.textContent = this.player;
        },
        setMessage(){
            info.textContent = this.player +", Place your Carrier"
        },
        updateScreens(){
            this.setName();
            this.setMessage();
        },
        randomOrientation(){
            let randomOrientation = Math.floor(Math.random() * 2)
            
            if (randomOrientation == 0) {
                randomOrientation = "Vertical"
            } else {
                randomOrientation = "Horizontal";
            }
            return randomOrientation;
        },
        assignProbability(){
            let totalHits = 0
            this.ships.forEach(element => {
                totalHits = element.hitsTaken + totalHits;
            })
            let shipsLeft = 17-totalHits
            let spacesLeft = 100 - this.attacks.length;
            let baseProbability = shipsLeft/spacesLeft;

            this.gameBoard.forEach(element => {
                element.probability = 0;
                if(element.attacked == undefined){
                    let index = this.gameBoard.indexOf(element);
                    element.probability = baseProbability;
                    if(index +1 <= 99 && this.gameBoard[index].row == this.gameBoard[index+1].row){
                        if(this.gameBoard[index+1].hit == true && this.gameBoard[index+1].isSunk == undefined){
                            element.probability += .25;
                        }
                    }
                    if(index + 2 <=99 && this.gameBoard[index].row == this.gameBoard[index+2].row){
                        if(this.gameBoard[index+2].hit != undefined && this.gameBoard[index+2].isSunk == undefined){
                            element.probability += .1;
                        }
                    }
                    if(index + 3 <=99 && this.gameBoard[index].row == this.gameBoard[index+3].row){
                        if(this.gameBoard[index+3].hit == true && this.gameBoard[index+3].isSunk == undefined){
                            element.probability += .05;
                        }
                    }
                    if(index + 4 <=99 && this.gameBoard[index].row == this.gameBoard[index+4].row){
                        if(this.gameBoard[index+4].hit == true && this.gameBoard[index+4].isSunk == undefined){
                            element.probability += .025;
                        }
                    }
                    if(index-1>=0 && this.gameBoard[index].row == this.gameBoard[index-1].row){
                        if(this.gameBoard[index-1].hit ==true && this.gameBoard[index-1].isSunk == undefined){
                            element.probability += .25;
                        }
                    }
                    if(index -2 >= 0 && this.gameBoard[index].row == this.gameBoard[index-2].row){
                        if(this.gameBoard[index-2].hit == true && this.gameBoard[index-2].isSunk == undefined){
                            element.probability += .1;
                        }
                    }
                    if(index -3>=0 && this.gameBoard[index].row == this.gameBoard[index-3].row){
                        if(this.gameBoard[index-3].hit == true && this.gameBoard[index-3].isSunk == undefined){
                            element.probability += .05;
                        }
                    }
                    if(index -4 >= 0 && this.gameBoard[index].row == this.gameBoard[index-4].row){
                        if(this.gameBoard[index-4].hit == true && this.gameBoard[index-4].isSunk == undefined){
                            element.probability += .025;
                        }
                    } 
                    if(index+10 <= 99){
                        if(this.gameBoard[index+10].hit ==true && this.gameBoard[index+10].isSunk == undefined){
                            element.probability += .25;
                        }
                    }
                    if(index + 20 <=99){
                        if(this.gameBoard[index+20].hit == true && this.gameBoard[index+20].isSunk == undefined){
                            element.probability += .1;
                        }
                    }
                    if(index + 30 <=99){
                        if(this.gameBoard[index+30].hit == true && this.gameBoard[index+30].isSunk == undefined){
                            element.probability += .05;
                        }
                    }
                    if(index + 40 <=99){
                        if(this.gameBoard[index+40].hit == true && this.gameBoard[index+40].isSunk == undefined){
                            element.probability += .025;
                        }
                    }
                    if(index-10>=0){
                        if(this.gameBoard[index-10].hit ==true && this.gameBoard[index-10].isSunk == undefined){
                            element.probability += .25;
                        }
                    }
                    if(index -20 >= 0){
                        if(this.gameBoard[index-20].hit == true && this.gameBoard[index-20].isSunk == undefined){
                            element.probability += .1;
                        }
                    }
                    if(index -30>=0){
                        if(this.gameBoard[index-30].hit == true && this.gameBoard[index-30].isSunk == undefined){
                            element.probability += .05;
                        }
                    }
                    if(index -40 >= 0){
                        if(this.gameBoard[index-40].hit == true && this.gameBoard[index-40].isSunk == undefined){
                            element.probability += .025;
                        }
                    }
                } 
            })
        },
        determinHighestProbability(){
            let highestProbability = 0;
            let allProbabilities = []
            function checkProbabilities (probability){
                    return probability == highestProbability
            }
            let index
            this.gameBoard.forEach(element => {
                if(element.probability != 0){
                    allProbabilities.push(element.probability)
                }
                if(element.probability > highestProbability){
                    highestProbability = element.probability
                    index = this.gameBoard.indexOf(element)
                }
            })
            if(allProbabilities.every(checkProbabilities)){
                index = Math.floor(Math.random() * this.gameBoard.length);
            }
            return index
        },
        updateSunkShips(){
            this.ships.forEach(element =>{
                if(element.isSunk() == true){
                    this.gameBoard.forEach(item => {
                        if(item.ship == element.shipType){
                            item.isSunk = true;
                        }
                    })
                }
            })
        },
        viableShipPlacement(){
            let longestShip = this.longestShip();
            console.log(longestShip)
            this.gameBoard.forEach(element => {
                let horizontalTiles = 1;
                let verticalTiles = 1;
                let index = this.gameBoard.indexOf(element)
                if(this.gameBoard[index].attacked ==undefined){
                    if(index +1 <= 99 && this.gameBoard[index].row == this.gameBoard[index+1].row){
                        if(this.gameBoard[index+1].attacked == undefined || this.gameBoard[index+1].hit == true && this.gameBoard[index+1].isSunk == undefined){
                            horizontalTiles++
                            if(index + 2 <=99 && this.gameBoard[index].row == this.gameBoard[index+2].row){
                                if(this.gameBoard[index+2].attacked == undefined || this.gameBoard[index+2].hit == true && this.gameBoard[index+2].isSunk == undefined){
                                    horizontalTiles++
                                    if(index + 3 <=99 && this.gameBoard[index].row == this.gameBoard[index+3].row){
                                        if(this.gameBoard[index+3].attacked == undefined || this.gameBoard[index+3].hit == true && this.gameBoard[index+3].isSunk == undefined){
                                            horizontalTiles++
                                            if(index + 4 <=99 && this.gameBoard[index].row == this.gameBoard[index+4].row){
                                                if(this.gameBoard[index+4].attacked == undefined || this.gameBoard[index+4].hit == true && this.gameBoard[index+4].isSunk == undefined){
                                                    horizontalTiles++ 
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(index-1>=0 && this.gameBoard[index].row == this.gameBoard[index-1].row){
                        if(this.gameBoard[index-1].attacked == undefined || this.gameBoard[index-1].hit == true && this.gameBoard[index+1].isSunk == undefined){
                            horizontalTiles++
                            if(index-2>=0 && this.gameBoard[index].row == this.gameBoard[index-2].row){
                                if(this.gameBoard[index-2].attacked == undefined || this.gameBoard[index-2].hit == true && this.gameBoard[index-2].isSunk == undefined){
                                    horizontalTiles++
                                    if(index-3>=0 && this.gameBoard[index].row == this.gameBoard[index-3].row){
                                        if(this.gameBoard[index-3].attacked == undefined || this.gameBoard[index-3].hit == true && this.gameBoard[index-3].isSunk == undefined){
                                            horizontalTiles++
                                            if(index-4>=0 && this.gameBoard[index].row == this.gameBoard[index-4].row){
                                                if(this.gameBoard[index-4].attacked == undefined || this.gameBoard[index-4].hit == true && this.gameBoard[index-4].isSunk == undefined){
                                                    horizontalTiles++
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(index+10 <= 99){
                        if(this.gameBoard[index+10].attacked == undefined || this.gameBoard[index+10].hit == true && this.gameBoard[index+10].isSunk == undefined){
                            verticalTiles++
                            if(index+20 <= 99){
                                if(this.gameBoard[index+20].attacked == undefined || this.gameBoard[index+20].hit == true && this.gameBoard[index+20].isSunk == undefined){
                                    verticalTiles++
                                    if(index+30 <= 99){
                                        if(this.gameBoard[index+30].attacked == undefined || this.gameBoard[index+30].hit == true && this.gameBoard[index+30].isSunk == undefined){
                                            verticalTiles++
                                            if(index+40 <= 99){
                                                if(this.gameBoard[index+40].attacked == undefined || this.gameBoard[index+40].hit == true && this.gameBoard[index+40].isSunk == undefined){
                                                    verticalTiles++
                                                    
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(index-10>=0){
                        if(this.gameBoard[index-10].attacked == undefined || this.gameBoard[index-10].hit == true && this.gameBoard[index-10].isSunk == undefined){
                            verticalTiles++
                            if(index-20>=0){
                                if(this.gameBoard[index-20].attacked == undefined || this.gameBoard[index-20].hit == true && this.gameBoard[index-20].isSunk == undefined){
                                    verticalTiles++
                                    if(index-30>=0){
                                        if(this.gameBoard[index-30].attacked == undefined || this.gameBoard[index-30].hit == true && this.gameBoard[index-30].isSunk == undefined){
                                            verticalTiles++
                                            if(index-40>=0){
                                                if(this.gameBoard[index-40].attacked == undefined || this.gameBoard[index-40].hit == true && this.gameBoard[index-40].isSunk == undefined){
                                                    verticalTiles++
                                                    
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if(verticalTiles < longestShip && horizontalTiles < longestShip){
                    element.probability = 0;
                }     
            }) 
        },
        longestShip(){
            let longestShip = 2
            this.ships.forEach(element => {
                if(element.isSunk() ==false){
                    if(element.shipLength > longestShip){
                        longestShip = element.shipLength
                    }
                }
            })  
            return longestShip
        }
    }
}




function startGame() {
    let modal = document.getElementById("modal")
    let game = document.getElementById("game")
    let modalButton = document.getElementById("modalSubmit")
    let modalInput = document.getElementById("modalAnswer")
    let screen = document.getElementById('display')
    let playerName = document.getElementById('playerName');
    let computerName = document.getElementById('computerName')
    let computerScreen = document.getElementById('screenTwo')
    let playerScreen = document.getElementById('screenOne')
    let playerTracker = document.getElementById('computerTracker');
    let computerTracker = document.getElementById('playerTracker');
    let orientationDiv = document.getElementById('orientation');
    let orientationButton = document.getElementById('orientationBtn')
    let orientationDisplay = document.getElementById('showOrientation')
    let player = document.getElementById('playerBoard');
    let computer = document.getElementById('computerBoard');
    let computerGame = document.getElementById('computer')

    modalButton.addEventListener('click', () => {
        modal.style.display = "none"
        game.style.display = "inline";
        let name = modalInput.value;
        let playerBoard = createGameBoard(name, computerTracker, computerScreen, undefined, screen, playerName);
        let computerBoard = createGameBoard("Computer", playerTracker, playerScreen, playerBoard, screen, computerName);

        orientationButton.addEventListener('click', () => {
            playerBoard.changeOrientation();
            orientationDisplay.textContent = playerBoard.chosenOrientation;
        })
    document.addEventListener('click', () => {
        if(playerBoard.allShipsPlaced ==true){
            computerGame.style.display = "inline";
            orientationDiv.style.display = "none";

        }
    })
    
    playerBoard.makeBoard();
    computerBoard.makeBoard();
    playerBoard.newBoard(player);
    computerBoard.newBoard(computer);
    computerBoard.populateShips();
    playerBoard.placeShips();
    computerBoard.playerAttack();
    playerBoard.updateScreens();
    computerBoard. setName();
    })
    
}

startGame();

module.exports = { createShip, createGameBoard }

