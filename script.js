const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const finalMessageRevealWord = document.getElementById('final-message-reveal-word');
const img_character = document.getElementById('img_character');
const figureParts = document.querySelectorAll('.figure-part'); /* lista (nodelist) de todos los elementos del documento que tienen la clase figure-part.*/
let playable = true;
const correctLetters = [];
const wrongLetters = [];
let selectedCharacter;

async function getRandomIndex(array) {
	let min = 0;
	let max = array.length - 1;
	return Math.floor(Math.random() * (max - min + 1) + min); /* Un index random desde el primer hasta el ultimo elemento del array */
}

/* API publica de Rick & Morty, solo se toma el nombre y la imagen.*/
async function fechCharacters() {
	try {
		const response = await fetch('https://rickandmortyapi.com/api/character');
		const data = await response.json();
		return data.results.map(character =>({
			name: character.name,
			image: character.image
		}));
	} catch (error) {
		alert('Ha ocurrido un error al obtener los datos.');
		console.log(error);
	}
}

async function getRandomCharacter(){
	try {
		const characters = await fechCharacters();
		const randomIndex = await getRandomIndex(characters);
		const selectedCharacter = characters[randomIndex];
		return selectedCharacter;
	} catch (error) {
		alert('Ha ocurrido un error al obtener los datos.');
		console.log(error);
	}
}

async function displayWord() {

	wordEl.innerHTML = 
	`${selectedCharacter.name
		.split('')
		.map
		(
			letter => 
			`<span class="letter">
				${correctLetters.includes(letter) ? letter : ''}
			</span>`
		)
		.join('')}`;

	const innerWord = wordEl.innerText.replace(/\s\n /g, '-');

	if (innerWord === selectedCharacter.name) {
		finalMessage.innerText = '¡Felicidades! ¡Ganaste! 😃';
		finalMessageRevealWord.innerText = '';
		popup.style.display = 'flex';
		playable = false;
	}
}

// Muestra la notificación
function showNotification() {
	notification.classList.add('show');
	setTimeout(() => {
		notification.classList.remove('show');
	}, 3000);
}

function updateWrongLettersEl() {
	// Mostrar letras incorrectas
	wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Incorrecto:</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
	`;

	figureParts.forEach((part, index) => {
		const errors = wrongLetters.length;
		if (index < errors) {
			part.style.display = 'block';
		} else {
			part.style.display = 'none';
		}
	});
	
	if (wrongLetters.length === figureParts.length) {
		finalMessage.innerText = 'Desafortunadamente perdiste. 😕';
		finalMessageRevealWord.innerText = `...la palabra era: ${selectedCharacter.name}`;
		popup.style.display = 'flex';
		playable = false;
	}
}

// Letra tecleada
window.addEventListener('keydown', e => {
	let aA = 65; 
	let zZ = 90; 
	let dash = 109; //Los espacios los reemplazo por un guion, por ende esn ecesario evaluarlos
	if (playable) {
		if ((e.keyCode >= aA && e.keyCode <= zZ) || (e.keyCode == dash)) {
			const letter = e.key.toLowerCase();

			if (selectedCharacter.name.includes(letter)) {
				if (!correctLetters.includes(letter)) {
					correctLetters.push(letter);
					displayWord();
				} else {
					showNotification();
				}
			} else {
				if (!wrongLetters.includes(letter)) {
					wrongLetters.push(letter);
					updateWrongLettersEl();
				} else {
					showNotification();
				}
			}
		}
	}
});

async function play(){
	selectedCharacter = await getRandomCharacter();
	selectedCharacter.name = selectedCharacter.name.toLowerCase();
	selectedCharacter.name = selectedCharacter.name.replace(/\s/g, '-');
	img_character.setAttribute('src', selectedCharacter.image);
	img_character.setAttribute('alt', selectedCharacter.name);
	console.log(selectedCharacter);
	displayWord();
}

playAgainBtn.addEventListener('click', () => {
	playable = true;
	correctLetters.splice(0);
	wrongLetters.splice(0);
	play();
	updateWrongLettersEl();
	popup.style.display = 'none';
});

play();





