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

      calcValue(lastCard, "dealer", "deal");
      dealer.hand.push(lastCard);
    }
  } else {
    createCard(
      "playerCard",
      `../cards/${lastCard.value}-${lastCard.suit}.png`,
      playerCards
    );
    calcValue(lastCard, "player", "deal");
    player.hand.push(lastCard);
  }

  setTimeout(function () {
    dealCards(num, i + 1);
  }, 500);

  count.textContent = `${deck.cards.length} cards`;
  if (i === 3) {
    btns[0].style.display = "inline-block";
    btns[1].style.display = "inline-block";
  }
}

function checkDealer() {
  let lastCard = deck.cards.pop();

  createCard(
    "enemyCard",
    `../cards/${lastCard.value}-${lastCard.suit}.png`,
    dealerCards
  );
  calcValue(lastCard, "dealer", "stand");
  dealer.hand.push(lastCard);
  if (dealer.points < 17) {
    setTimeout(function () {
      checkDealer();
    }, 500);
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
  calcValue(lastCard, "player", "hit");
  player.hand.push(lastCard);
  count.textContent = `${deck.cards.length} cards`;
}

function playStand() {
  let unturnedCard = dealerCards.children[0];
  unturnedCard.classList.add("turnCard");
  new Promise(function (resolve, reject) {
    setTimeout(() => {
      unturnedCard.children[0].src = `../cards/${dealer.hand[0].value}-${dealer.hand[0].suit}.png`;
      calcValue(dealer.hand[0], "dealer", "stand");
      resolve();
    }, 300);
  }).then(() => {
    if (dealer.points < 17) {
      setTimeout(() => {
        checkDealer();
      }, 500);
    }
  });
}

function showDealerHand() {
  let unturnedCard = dealerCards.children[0];
  unturnedCard.classList.add("turnCard");
  unturnedCard.children[0].src = `../cards/${dealer.hand[0].value}-${dealer.hand[0].suit}.png`;
}

function calcWinner(place) {
  if (place === "deal") {
    if (player.points === 21) {
      playerScore.textContent = `Player: WIN`;
      showDealerHand()
    } else if (player.points > 21) {
      dealerScore.textContent = `Dealer: WIN`;
      showDealerHand()
    } else if (dealer.points > 21) {
      playerScore.textContent = `Player: WIN`;
      showDealerHand()
    }
  } else if (place === "stand") {
    if (player.points > 21) {
      console.log("Player > 21");
      dealerScore.textContent = `Dealer: WIN`;
      showDealerHand()
    } else if (dealer.points > 21) {
      console.log("Dealer > 21");
      playerScore.textContent = `Player: WIN`;
      showDealerHand()
    } else if (player.points === 21) {
      console.log("Player == 21");
      playerScore.textContent = `Player: WIN`;
      showDealerHand()
    } else if (dealer.points === 21) {
      console.log("Dealer == 21");
      dealerScore.textContent = `Dealer: WIN`;
      showDealerHand()
    } else if (player.points >= dealer.points) {
      console.log("Player > Dealer");
      playerScore.textContent = `Player: WIN`;
      showDealerHand()
    } else {
      dealerScore.textContent = `Dealer: WIN`;
      showDealerHand()
    }
  } else {
    if (player.points > 21) {
      console.log("Hit?");
      dealerScore.textContent = `Dealer: WIN`;
      showDealerHand()
    } else if (player.points === 21) {
      playerScore.textContent = `Player: WIN`;
      showDealerHand()
    }
  }
}

function calcValue(card, type, from) {
  if (player.hasAce && player.points > 21) {
    player.hasAce = false;
    player.points -= 10;
  }
  if (dealer.hasAce && dealer.points > 21) {
    dealer.hasAce = false;
    dealer.points -= 10;
  }
  if (type === "player") {
    if (!isNaN(card.value)) {
      player.points += parseInt(card.value);
    } else if (card.value === "A") {
      player.hasAce = true;
      player.points += 11;
    } else {
      player.points += 10;
    }
  } else {
    if (!isNaN(card.value)) {
      dealer.points += parseInt(card.value);
    } else if (card.value === "A") {
      dealer.hasAce = true;
      dealer.points += 11;
    } else {
      dealer.points += 10;
    }
  }
  playerScore.textContent = `Player: ${player.points}`;
  dealerScore.textContent = `Dealer: ${dealer.points}`;
  calcWinner(from);
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
