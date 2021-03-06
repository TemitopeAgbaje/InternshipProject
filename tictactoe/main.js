//Basic setup
var board;
const hPlayer = "X";
const aPlayer = "O";
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const space = document.querySelectorAll('.space');
startGame();

function startGame(){
    document.querySelector('.endgame').style.display = 'none'
    board = Array.from(Array(9).keys());
    for (var i = 0; i < space.length; i++){
        space[i].innerText ='';
        space[i].style.removeProperty('background-color');
        space[i].addEventListener('click', turnClick ,false);
    }
}
function turnClick(square){
    if (typeof board[square.target.id] =='number'){
        turn(square.target.id, hPlayer)
        if (!checkTie()) turn(bestSpot(), aPlayer);
    }
   
}

function turn(squareId, player){
    board[squareId] = player;
    document.getElementById(squareId).innerText =player;

    let gameWon = checkWin(board,player)
    if(gameWon) gameOver(gameWon)
}

function checkWin(oBoard, player) {
	let plays = oBoard.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
        }
    }
    return gameWon;
}
function gameOver(gameWon){
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == hPlayer ? "purple" : "blue";
    }
    for(var i = 0; i < space.length;i++){
        space[i].removeEventListener('click',turnClick,false);
    }

    declareWinner(gameWon.player == hPlayer ? "You win :)" : "You lose :(");
}
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return board.filter(s => typeof s == "number")
}

function bestSpot(){
    //return emptySquares()[0];
    return minimax(board, aPlayer).index;
}

function checkTie(){
    if(emptySquares().length == 0){
        for(var i = 0; i <space.length; i++){
            space[i].style.backgroundColor ="yellow";
            space[i].removeEventListener('click',turnClick,false);
        }

        declareWinner("Tie Game!")
        return true;
    }
    return false;
}


function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, hPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aPlayer) {
			var result = minimax(newBoard, hPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}