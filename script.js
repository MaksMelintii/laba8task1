const cardsContainer = document.getElementById('cardsContainer');
const onlyCards = document.getElementById('cards');
const cards4x4 = document.getElementById('cards4x4');
const cards6x6 = document.getElementById('cards6x6');
const startGameButton = document.getElementById('startGameButton');
const timerElement = document.getElementById('timer');
const startGameButtom = document.getElementById('startGameButton');
const newGameButton = document.getElementById('newGameButton');
const difficulty = document.getElementById('difficulty');
const fieldSizeSelect = document.getElementById('fieldSize');

let minutes = 0;
let seconds = 0;
let intervalId;

let countGuessed = 0;

const cardElements_4x4 = ["img/1.svg", "img/2.svg", "img/3.svg", "img/4.svg", "img/5.svg", "img/6.svg", "img/7.svg", "img/8.svg"];

const cardElements_6x6 = cardElements_4x4.concat(["img/9.svg", "img/10.svg", "img/11.svg", "img/12.svg", "img/13.svg", "img/14.svg", "img/15.svg", "img/16.svg", "img/17.svg", "img/18.svg"]);

const cardsAmount_4x4 = 16;
const cardsAmount_6x6 = 36;

let openCards = [];
let visibleCards = [];
let checkingPairsFlag = true;

function StartGame(){
    clearField();
    const selectedSizeValue = fieldSizeSelect.value;
    if(selectedSizeValue === "4x4"){
      countGuessed = 0;
      const cardValues = randomGenerateCards(cardElements_4x4, cardsAmount_4x4);
      cardValues.forEach(renderCard4X4AndClick);
    }
    if(selectedSizeValue === "6x6"){
      countGuessed = 0;
      const cardValues = randomGenerateCards(cardElements_6x6, cardsAmount_6x6);
      cardValues.forEach(renderCard6X6AndClick);
    }

}

function randomGenerateCards(arr, fieldSize){

    const randomArray = [];
    const elementCounts = {};
  
    for (const item of arr) {
      elementCounts[item] = 0;
    }
  
    while (randomArray.length < fieldSize) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      const randomElement = arr[randomIndex];
  
      if (elementCounts[randomElement] < 2) {
        randomArray.push(randomElement);
        elementCounts[randomElement]++;
      }
    }
  
    return randomArray;
}

function renderCard4X4AndClick(cardPicture = "") {
  const frontCard_4x4 = document.createElement('img');
  frontCard_4x4.classList.add('frontCard_4x4');
  frontCard_4x4.src = "img/front.png"

  const backCard_4x4 = document.createElement('img');
  backCard_4x4.classList.add('backCard_4x4');
  backCard_4x4.src = cardPicture;

  const cardInner_4x4 = document.createElement('div');
  cardInner_4x4.classList.add('cardInner_4x4');
  cards4x4.appendChild(cardInner_4x4);
  cardInner_4x4.appendChild(frontCard_4x4);
  cardInner_4x4.appendChild(backCard_4x4);

  cardInner_4x4.addEventListener('click', () => {
    // Перевірка, чи картка вже не вгадана і не відкрита
    if (!checkingPairsFlag || openCards.includes(cardInner_4x4) || visibleCards.includes(cardInner_4x4)) return;

    cardInner_4x4.style.transform = "rotateY(180deg)";
    openCards.push(cardInner_4x4);
    if (openCards.length === 2) {
      checkPairs(openCards);
    }
  });

  frontCard_4x4.addEventListener('click', () => {
    if (!checkingPairsFlag || visibleCards.includes(cardInner_4x4)) return;
    cardInner_4x4.style.transform = "rotateY(0deg)";
    const index = openCards.indexOf(cardInner_4x4);
    if (index !== -1) {
      openCards.splice(index, 1); // Видаляю картку з масиву openCards, якщо вона була відкрита
    }
  });
}


function renderCard6X6AndClick(cardPicture = "") {
  const frontCard_6x6 = document.createElement('img');
  frontCard_6x6.classList.add('frontCard_6x6');
  frontCard_6x6.src = "img/front.png";

  const backCard_6x6 = document.createElement('img');
  backCard_6x6.classList.add('backCard_6x6');
  backCard_6x6.src = cardPicture;

  const cardInner_6x6 = document.createElement('div');
  cardInner_6x6.classList.add('cardInner_6x6');
  cards6x6.appendChild(cardInner_6x6);
  cardInner_6x6.appendChild(frontCard_6x6);
  cardInner_6x6.appendChild(backCard_6x6);

  cardInner_6x6.addEventListener('click', () => {
    if (!checkingPairsFlag || openCards.includes(cardInner_6x6) || visibleCards.includes(cardInner_6x6)) return;

    cardInner_6x6.style.transform = "rotateY(180deg)";
    openCards.push(cardInner_6x6);
    if (openCards.length === 2) {
      checkPairs(openCards);
    }
  });

  frontCard_6x6.addEventListener('click', () => {
    if (!checkingPairsFlag || visibleCards.includes(cardInner_6x6)) return;
    cardInner_6x6.style.transform = "rotateY(0deg)";
    const index = openCards.indexOf(cardInner_6x6);
    if (index !== -1) {
      openCards.splice(index, 1); 
    }
  });
}


function checkPairs(openCards) {
  checkingPairsFlag = false;
  const [card1, card2] = openCards;
  let card1Value, card2Value;
  const selectedSizeValue  = fieldSizeSelect.value;
  if(selectedSizeValue === "4x4"){
     card1Value = card1.querySelector('.backCard_4x4').src;
     card2Value = card2.querySelector('.backCard_4x4').src;
  }
  
  if(selectedSizeValue === "6x6"){
    card1Value = card1.querySelector('.backCard_6x6').src;
    card2Value = card2.querySelector('.backCard_6x6').src;
  }
  
  if (card1Value === card2Value) {
      visibleCards.push(card1, card2);
      openCards.length = 0;
      checkingPairsFlag = true;
      countGuessed++;
      
      const selectedSize = fieldSizeSelect.value;
      if (selectedSize === "4x4"){

          if (countGuessed === 8) {
            
            setTimeout(() => {
                resultGame(countGuessed);
                stopGame();
            }, 500); 
        }
      }
      if (selectedSize === "6x6"){

            if (countGuessed === 18) {
                
              setTimeout(() => {
                  resultGame(countGuessed);
                  stopGame();
              }, 500); 
          }
      }
      
  } else {
      setTimeout(() => {
          card1.style.transform = "rotateY(0deg)";
          card2.style.transform = "rotateY(0deg)";
          openCards.length = 0;
          checkingPairsFlag = true;
      }, 1000);
  }
}



function Timer(minutes, seconds) {
  clearInterval(intervalId);
  timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (minutes === 0 && seconds === 0) {
    return;
  }

  intervalId = setInterval(() => {
    if (seconds === 0) {
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    Timer(minutes, seconds);

    if (minutes === 0 && seconds === 0) {
      clearInterval(intervalId);
      resultGame(countGuessed);
      stopGame();
    }
  }, 1000);
}


function clearField(){

  const cardInner_4x4Elements = document.querySelectorAll('.cardInner_4x4');
  cardInner_4x4Elements.forEach(card => {
    card.remove();
  });

  const cardInner_6x6Elements = document.querySelectorAll('.cardInner_6x6');
  cardInner_6x6Elements.forEach(card => {
    card.remove();
  });
}


function resultGame(count) {
  const selectedSize = fieldSizeSelect.value;
  if(selectedSize === "4x4"){
      if (count === 8) {
       alert(`Вітаю ви виграли! Ваш резултат:  ${count} `);
      } else {
        alert(`Ви програли! Ваш резултат:  ${count}`);
      }
  }
  
  if(selectedSize === "6x6"){
      if (count === 18) {
        alert(`Вітаю ви виграли! Ваш резултат:  ${count} `);
      } else {
        alert(`Ви програли! Ваш резултат:  ${count}`);
      }
  }
}


function stopGame(){
  Timer(0, 0);
  clearInterval(intervalId);
  clearField();
  countGuessed = 0; 
}




newGameButton.addEventListener('click', stopGame);
    

startGameButtom.addEventListener('click', () =>{
    StartGame();
    const selectedValue = difficulty.value;
    let duration;
    if(selectedValue === 'easy'){
      duration = 180;
      countGuessed = 0;
    } else if(selectedValue === 'normal'){
      duration = 120;
      countGuessed = 0;
    } else if(selectedValue === 'hard'){
      duration = 60;
      countGuessed = 0;
    }

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

  Timer(minutes, seconds);
});


Timer(0, 0);




// window.addEventListener('wheel', function(event) {
//     const delta = event.deltaY; 
//     if (delta < 0) {
        
//         window.scrollBy(0, -80); 
//     } else {
        
//         window.scrollBy(0, 80); 
//     }
//     event.preventDefault();
// });

