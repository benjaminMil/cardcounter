let deckId;
let count = 0;
let deckCount = 1;
const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const remainingText = document.getElementById("remaining");
const countText = document.getElementById("count-text");
const revealCountBtn = document.getElementById("reveal-count");
const lowBtn = document.getElementById("low");
const highBtn = document.getElementById("high");
const guessBtns = document.getElementById("guess-btns");
const threeDecks = document.getElementById("three-decks");
const sixDecks = document.getElementById("six-decks");
const oneDeck = document.getElementById("one-deck");

oneDeck.addEventListener("click", () => {
  deckCount = 1;
  handleClick();
});

threeDecks.addEventListener("click", () => {
  deckCount = 3;
  handleClick();
});

sixDecks.addEventListener("click", () => {
  deckCount = 6;
  handleClick();
});

revealCountBtn.addEventListener("click", () => {
  countText.style.visibility =
    countText.style.visibility === "visible" ? "hidden" : "visible";
  revealCountBtn.textContent =
    revealCountBtn.textContent === "Reveal Count"
      ? "Hide Count"
      : "Reveal Count";
});

fetch(
  `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`
)
  .then((res) => res.json())
  .then((data) => {
    remainingText.textContent = `Remaining cards: ${data.remaining}`;
    deckId = data.deck_id;
  });

function handleClick() {
  count = 0;
  countText.textContent = "Count: 0";
  fetch(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`
  )
    .then((res) => res.json())
    .then((data) => {
      remainingText.textContent = `Remaining cards: ${data.remaining}`;
      deckId = data.deck_id;
    });
  cardsContainer.children[0].innerHTML = `
                <img src="./img/backOfCard.svg" class="card" />
            `;
}

newDeckBtn.addEventListener("click", handleClick);

drawCardBtn.addEventListener("click", drawNewCard);
lowBtn.addEventListener("click", () => {
  drawNewCard();
  guessBtns.style.visibility = "hidden";
  drawCardBtn.disabled = false;
});

highBtn.addEventListener("click", () => {
  drawNewCard();
  guessBtns.style.visibility = "hidden";
  drawCardBtn.disabled = false;
});

function drawNewCard() {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    .then((res) => res.json())
    .then((data) => {
      remainingText.textContent = `Remaining cards: ${data.remaining}`;
      const totalCards = deckCount * 52;
      const interval = deckCount === 1 ? 10 : 52;
      if (
        data.remaining > 0 &&
        data.remaining % interval === 0 &&
        data.remaining < totalCards - 5
      ) {
        guessBtns.style.visibility = "visible";
        drawCardBtn.disabled = true;
      }
      cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].images.svg} class="card" />
            `;
      determineCount(data.cards[0].value);
    });
}

function determineCount(card) {
  const cardValues = {
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 0,
    8: 0,
    9: 0,
    10: -1,
    JACK: -1,
    QUEEN: -1,
    KING: -1,
    ACE: -1,
  };

  count += cardValues[card];
  countText.textContent = `Count: ${count}`;
}
