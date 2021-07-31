const ship = require('./myscript');

test('Ship has length property', () => {
  expect(ship.createShip(4).shipLength).toBe(4);
});

test('Ship has isSunk property', () =>{
    expect(ship.createShip(4).sunk).toBe(false);
})


test('Ship takes hits', () => {
    let ship1 = ship.createShip(4)
    expect(ship1.hit()).toBe(1);
})

test('Checks if ship is sunk', () => {
    let ship1 = ship.createShip(4)
    for(i=0; i < ship1.shipLength; i++){
        ship1.hit()
    }
    expect(ship1.isSunk()).toBe(true);
})

let gameBoard1 = ship.createGameBoard();


test('GameBoard exists',() => {
    expect(gameBoard1.gameBoard).toStrictEqual([])
})

test("Creates GameBoard",() => {
    gameBoard1.makeBoard();
    expect(gameBoard1.gameBoard.length).toBe(100);
})

test("GameBoard array items have Rows & Columns", () => {
    expect(gameBoard1.gameBoard[0].row).toBe('A');
    expect(gameBoard1.gameBoard[0].column).toBe(1);
})