let step = true, 
	playerCountBalls = 10,
	compCountBalls = 10,
	playBtn = document.querySelector('.play'),
	playerBag = document.querySelector('.player-bag'),
	compImg = document.querySelector('.comp-img'),
	playerImg = document.querySelector('.player-img'),
	playerCount = document.querySelector('.player__count'),
	playerCountBtn = document.querySelector('.player__count-btn'),
	evenBtn = document.querySelector('.even'),
	oddBtn = document.querySelector('.odd'),
	playText = document.querySelector('.play__text'),
	results = document.querySelector('.game__results'),
	guessCompBalls,
	guessPlayerBalls,
	compEvenOdd,
	messages = {
		'wrong_bet': 'Wrong bet',
		'step_456': 'Player No. 456 is playing! <br>Make a bet and choose Odd/Even',
		'win_456': 'Game over! Player No. 456 won!',
		'res_456': 'Player No. 456 made a bet',
		'step_001': 'Player No. 001 is playing! <br>Make a bet',
		'win_001': 'Game over! Player No. 001 won!',
		'res_001': 'Player No. 001 made a bet'
	};

let compTotal = document.querySelector('.comp__total'),
	playerTotal = document.querySelector('.player__total');



playBtn.addEventListener('click', play);
function play() {
	playBtn.classList.add('hide');
	playerCountBalls = 10;
	compCountBalls = 10;
	results.innerHTML = '';
	compImg.setAttribute('src', 'img/001-sad.jpg');
	playerImg.setAttribute('src', 'img/456-sad.jpg');
	playerCountBtn.removeAttribute('disabled');
	playerCount.removeAttribute('disabled');
	evenBtn.setAttribute('disabled', 'disabled');
	oddBtn.setAttribute('disabled', 'disabled');
	createBalls(playerCountBalls, compCountBalls);
	stepPlayers(step);
}

//перерасчет шариков и смена картинки мешка
function createBalls(playerCount, compCount) {
	playerCount >= 20 || playerCount <= 0 ?
		playerBag.setAttribute('src', 'img/empty.png') :
		playerBag.setAttribute('src', `img/${playerCount}.png`);

	//compTotal.innerHTML = compCount;
	//playerTotal.innerHTML = playerCount;
}

function compGuess() {
	guessCompBalls = Math.round(Math.random() * (compCountBalls - 1) + 1);
	compEvenOdd = Math.round(Math.random());
	console.log('The computer bet - ' + guessCompBalls);
	if (compEvenOdd) console.log('The computer bet odd');
	else console.log('The computer bet even');
}


function stepPlayers(step) {
	console.log(step);
	compGuess(); 
	if (step) {  
		playText.innerHTML = messages.step_456;
		playerCountBtn.addEventListener('click', function st_pl() {
			guessPlayerBalls = +playerCount.value; 
			if (guessPlayerBalls == 0 || guessPlayerBalls > playerCountBalls || isNaN(guessPlayerBalls)) {
				playText.innerHTML = messages.wrong_bet;
				setTimeout(() => {
					playText.innerHTML = messages.step_456;
					playerCount.value = '';
				}, 2000);
			}
			else { //если прошли валидацию
				playerCountBtn.setAttribute('disabled', 'disabled');
				playerCount.setAttribute('disabled', 'disabled');
				evenBtn.removeAttribute('disabled');
				oddBtn.removeAttribute('disabled');
				playerCount.value = '';
				this.removeEventListener('click', st_pl);
			}
		});
	}
	else { 
		playText.innerHTML = messages.step_001;
		evenBtn.setAttribute('disabled', 'disabled');
		oddBtn.setAttribute('disabled', 'disabled');
		playerCountBtn.removeAttribute('disabled');
		playerCount.removeAttribute('disabled');

		playerCountBtn.addEventListener('click', function st_cp() {
			guessPlayerBalls = +playerCount.value; 
			if (guessPlayerBalls == 0 || guessPlayerBalls > playerCountBalls || isNaN(guessPlayerBalls)) {
				playText.innerHTML = messages.wrong_bet;
				setTimeout(() => {
					playText.innerHTML = messages.step_456;
					playerCount.value = '';
				}, 2000);
			}
			else { 
				writeBets(messages.res_001, guessCompBalls, compEvenOdd);
				checkWinner(guessCompBalls, guessPlayerBalls, compEvenOdd, step);
				playerCount.value = '';
				this.removeEventListener('click', st_cp);
			}
		});
	}
}


//выбор игрока
evenBtn.addEventListener('click', function () {
	checkWinner(guessCompBalls, guessPlayerBalls, 0, step);
	writeBets(messages.res_456, guessPlayerBalls, 0);
});
oddBtn.addEventListener('click', function () {
	checkWinner(guessCompBalls, guessPlayerBalls, 1, step);
	writeBets(messages.res_456, guessPlayerBalls, 1);
});


function writeBets(messBet, countBalls, choices) {
	let item = document.createElement('div');
	item.innerHTML = `${messBet} <strong>${countBalls}</strong> and chose ${choices ? 'odd' : 'even'}`;
	results.append(item);
}

function writeResultStep(mess, countBalls) {
	let item = document.createElement('div');
	item.innerHTML = `${mess} <strong>${countBalls}</strong> balls`;
	results.append(item);
}

function disabledButtons() {
	playerCountBtn.setAttribute('disabled', 'disabled');
	playerCount.setAttribute('disabled', 'disabled');
	evenBtn.setAttribute('disabled', 'disabled');
	oddBtn.setAttribute('disabled', 'disabled');
}

function checkWinner(valueComp, valuePlayer, check, step) {
	if ((valueComp % 2 == check && step) || (valuePlayer % 2 != check && !step)) {
		playerCountBalls += valuePlayer; 
		compCountBalls -= valuePlayer; 
		createBalls(playerCountBalls, compCountBalls);
		playerImg.setAttribute('src', 'img/456-happy.jpg');
		compImg.setAttribute('src', 'img/001-sad.jpg');
		//условие окончания игры
		if (playerCountBalls >= 20) {
			playText.innerHTML = messages.win_456;
			playBtn.classList.remove('hide');
			disabledButtons();
			return;
		}
		if (compCountBalls >= 20) {
			playText.innerHTML = messages.win_001;
			playBtn.classList.remove('hide');
			disabledButtons();
			return;
		}
		setTimeout(() => {
			writeResultStep('456 won', valuePlayer);
		}, 500);

	}
	else {
		playerCountBalls -= valueComp;
		compCountBalls += valueComp; 
		createBalls(playerCountBalls, compCountBalls);
		playerImg.setAttribute('src', 'img/456-sad.jpg');
		compImg.setAttribute('src', 'img/001-happy.jpg');
		if (playerCountBalls >= 20) {
			playText.innerHTML = messages.win_456;
			playBtn.classList.remove('hide');
			disabledButtons();
			return;
		}
		if (compCountBalls >= 20) {
			playText.innerHTML = messages.win_001;
			playBtn.classList.remove('hide');
			disabledButtons();
			return;
		}
		//сообщение в таблицу о результате
		setTimeout(() => {
			writeResultStep('001 won', valuePlayer);
		}, 500);

	}
	step = !step; //меняю ход
	stepPlayers(step); //запуск нового хода
}