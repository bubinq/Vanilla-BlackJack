const image = document.getElementById("source");
const btn = document.getElementById("drawBtn");
const count = document.getElementById("count");
const dealerCards = document.getElementById("dealerCards");
const playerCards = document.getElementById("playerCards");
const btns = document.getElementsByClassName("buttons");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const dealerScore = document.getElementById("dealerScore");
const playerScore = document.getElementById("playerScore");
const newGame = document.getElementById("newGame");

const suits = ["H", "D", "S", "C"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

const player = {
  points: 0,
  hasAce: false,
  hand: [],
};
const dealer = {
  points: 0,
  hasAce: false,
  hand: [],
};

class Deck {
  constructor() {
    this.cards = [];
  }
  makeDeck() {
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        this.cards.push(new Card(suits[i], values[j]));
      }
    }
  }

  shuffleDeck() {
    for (let i = 0; i < this.cards.length; i++) {
      const randomIdx = Math.floor(Math.random() * this.cards.length);
      [this.cards[i], this.cards[randomIdx]] = [
        this.cards[randomIdx],
        this.cards[i],
      ];
    }
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}
const deck = new Deck();
deck.makeDeck();
deck.shuffleDeck();

count.textContent = `${deck.cards.length} cards`;

btn.addEventListener("click", startDeal);
hitBtn.addEventListener("click", playHit);
standBtn.addEventListener("click", playStand);
newGame.addEventListener("click", () => {
  window.location.reload();
});

function startDeal() {
  playerScore.style.display = "block";
  dealerScore.style.display = "block";
  btn.style.display = "none";
  dealCards(4, 0);
}

function dealCards(num, i) {
  if (i >= num) return;
  let lastCard = deck.cards.pop();
  if (i % 2 === 0) {
    if (i === 0) {
      createCard(
        "enemyCard",
        "https://i.pinimg.com/originals/dc/09/f2/dc09f23b1c1f5ba66efe769edc04f5e3.png",
        dealerCards
      );
      dealer.hand.push(lastCard);
    } else {
      createCard(
        "enemyCard",
        `../cards/${lastCard.value}-${lastCard.suit}.png`,
        dealerCards
      );

      calcValue(lastCard, "dealer");
      dealer.hand.push(lastCard);
      calcWinner("deal");
    }
  } else {
    createCard(
      "playerCard",
      `../cards/${lastCard.value}-${lastCard.suit}.png`,
      playerCards
    );
    calcValue(lastCard, "player");
    player.hand.push(lastCard);
  }

  setTimeout(function () {
    dealCards(num, i + 1);
  }, 500);

  count.textContent = `${deck.cards.length} cards`;
  if (i === 3) {
    btns[0].style.display = "inline-block";
    btns[1].style.display = "inline-block";
    calcWinner("deal");
  }
}

function checkDealer() {
  let lastCard = deck.cards.pop();

  createCard(
    "enemyCard",
    `../cards/${lastCard.value}-${lastCard.suit}.png`,
    dealerCards
  );
  calcValue(lastCard, "dealer");
  dealer.hand.push(lastCard);
  if (dealer.points < 17) {
    setTimeout(function () {
      checkDealer();
    }, 500);
  } else {
    calcWinner("stand");
  }
  count.textContent = `${deck.cards.length} cards`;
}

function playHit() {
  let lastCard = deck.cards.pop();

  createCard(
    "playerCard",
    `../cards/${lastCard.value}-${lastCard.suit}.png`,
    playerCards
  );
  calcValue(lastCard, "player");
  player.hand.push(lastCard);
  calcWinner("hit");

  count.textContent = `${deck.cards.length} cards`;
}

function playStand() {
  let unturnedCard = dealerCards.children[0];
  unturnedCard.classList.add("turnCard");
  new Promise(function (resolve) {
    setTimeout(() => {
      unturnedCard.children[0].src = `../cards/${dealer.hand[0].value}-${dealer.hand[0].suit}.png`;
      calcValue(dealer.hand[0], "dealer");
      resolve();
    }, 300);
  }).then(() => {
    if (dealer.points < 17) {
      setTimeout(() => {
        checkDealer();
      }, 500);
    } else {
      calcWinner("stand");
    }
  });
}

function showDealerHand() {
  let unturnedCard = dealerCards.children[0];
  unturnedCard.classList.add("turnCard");
  unturnedCard.children[0].src = `../cards/${dealer.hand[0].value}-${dealer.hand[0].suit}.png`;
}

function hasWon(score, who, show) {
  score.textContent = `${who}: WIN`;
  newGame.style.display = "block";
  btns[0].style.display = "none";
  btns[1].style.display = "none";
  if (show) {
    showDealerHand();
  }
  return;
}

function calcWinner(place) {
  if (place === "deal") {
    if (player.points === 21) {
      hasWon(playerScore, "Player", true);
    } else if (dealer.points === 21) {
      hasWon(dealerScore, "Dealer", true);
    } else if (player.points > 21) {
      hasWon(dealerScore, "Dealer", true);
    } else if (dealer.points > 21) {
      hasWon(playerScore, "Player", true);
    }
  } else if (place === "stand") {
    if (dealer.points > 21) {
      hasWon(playerScore, "Player", false);
    } else if (player.points === 21) {
      if (dealer.points === 21) {
        playerScore.textContent = `Player: DRAW`;
        dealerScore.textContent = `Dealer: DRAW`;
        newGame.style.display = "block";
      } else {
        hasWon(playerScore, "Player", false);
      }
    } else if (dealer.points === 21) {
      hasWon(dealerScore, "Dealer", false);
    } else if (player.points > dealer.points) {
      hasWon(playerScore, "Player", false);
    } else if (player.points === dealer.points) {
      playerScore.textContent = `Player: DRAW`;
      dealerScore.textContent = `Dealer: DRAW`;
      newGame.style.display = "block";
    } else {
      hasWon(dealerScore, "Dealer", false);
    }
  } else {
    if (player.points > 21) {
      hasWon(dealerScore, "Dealer", true);
    } else if (player.points === 21) {
      hasWon(playerScore, "Player", true);
    }
  }
}

function checkAce(pts, obj) {
  debugger;
  if (obj.hasAce) {
    if (obj.points + pts > 21) {
      // 27
      obj.hasAce = false;
      obj.points -= 10;
      obj.points += pts;
    } else if (obj.points + pts === 21) {
      obj.points += pts;
      calcWinner("deal");
    } else {
      obj.points += pts;
    }
  } else {
    obj.points += pts;
  }
}

function calcValue(card, type) {
  if (type === "player") {
    if (!isNaN(card.value)) {
      checkAce(parseInt(card.value), player);
    } else if (card.value === "A") {
      player.hasAce = true;
      checkAce(11, player);
    } else {
      checkAce(10, player);
    }
  } else {
    debugger;
    if (!isNaN(card.value)) {
      checkAce(parseInt(card.value), dealer);
    } else if (card.value === "A") {
      dealer.hasAce = true;
      checkAce(11, dealer);
    } else {
      checkAce(10, dealer);
    }
  }

  playerScore.textContent = `Player: ${player.points}`;
  dealerScore.textContent = `Dealer: ${dealer.points}`;
}

function createCard(cls, imgSrc, parent) {
  let div = document.createElement("div");
  div.setAttribute("class", cls);
  div.classList.add(cls === "enemyCard" ? "animateDealer" : "animatePlayer");
  let img = document.createElement("img");
  img.src = imgSrc;
  div.appendChild(img);
  parent.appendChild(div);
}
