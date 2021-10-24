// import all elements once
const cards = document.querySelectorAll(".single--card");
const level_item = document.querySelector(".ended-current-levels");
const coin = document.querySelector(".current--coins");
const loading = document.querySelector(".loading--container");
const gameBody = document.querySelector(".game--body");
const gameMsg = document.querySelector(".message--box");
const gameBodyHeader = document.querySelector(".game--body--header");
let bot = "player--2";
let user = "player--1";
let icon = "X";
let activeAction = true;
let level = 1;
let coins = 0;
let sounds = ["loser.mp3", "user.mp3", "bot.mp3", "done.mp3"];

window.onload = () => {
  checkLevel();
  cards.forEach((card) => {
    card.onclick = () => handleCard(card);
  });
};

// change element classes function in needed
function changeClasses(oldClasses, newClasses, element) {
  return (
    element.classList.add(...newClasses),
    element.classList.remove(...oldClasses)
  );
}

// check level function if added or not
function checkLevel() {
  let db = localStorage.getItem("level");
  if (db) {
    if (Number(db) <= 5) {
      level_item.innerHTML = db;
      changeClasses(["flex"], ["hidden"], loading);
      changeClasses(["hidden"], ["grid"], gameBody);
      changeClasses(["hidden"], ["flex"], gameBodyHeader);
      if (Number(db) === 5) {
      }
    } else {
      level_item.innerHTML = 5;
      changeClasses(["flex"], ["hidden"], loading);
      changeClasses(["grid"], ["hidden"], gameBody);
      changeClasses(["flex"], ["hidden"], gameBodyHeader);
      messageBoxContent(
        ["hidden"],
        ["flex"],
        "😢",
        "The number of opportunities specified for you has been completed. You can start over and get other opportunities after completing the countdown",
        true
      );
    }
    coins = Math.floor(Number(localStorage.getItem("coins")));
    coin.innerHTML = coinsConvertor(coins, 5);
  } else {
    localStorage.setItem("level", level);
    level_item.innerHTML = 1;
    coins = 0;
    localStorage.setItem("coins", coins);
    coin.innerHTML = coinsConvertor(coins, 5);
    changeClasses(["flex"], ["hidden"], loading);
    changeClasses(["hidden"], ["grid"], gameBody);
    changeClasses(["hidden"], ["flex"], gameBodyHeader);
  }
}

// handleCard function work when click on any card
function handleCard(current) {
  icon = "X";
  soundEffect(sounds[1]);
  changeClasses(
    ["bg-red-500"],
    ["bg-gray-100", user, "selected--card"],
    current
  );
  current.innerHTML = `<span class="relative w-full h-full block ${user}"></span>`;
  current.setAttribute("data-type", icon);
  current.setAttribute("data-name", "selected");

  selectedTheWinner();
  setTimeout(() => {
    botPlayer(activeAction);
  }, (Math.random() * 1000 + 300).toFixed());
}

// bot function
function botPlayer(active) {
  if (active) {
    soundEffect(sounds[2]);

    let arr = [];
    for (let c = 0; c < cards.length; c++) {
      if (cards[c].childElementCount === 0) {
        arr.push(c);
      }
    }
    let randomIndex = arr[Math.floor(Math.random() * arr.length)];
    if (arr.length > 0) {
      icon = "O";
      changeClasses(
        ["bg-red-500"],
        ["bg-gray-100", bot, "selected--card"],
        cards[randomIndex]
      );
      cards[randomIndex].setAttribute("data-type", icon);
      cards[randomIndex].setAttribute("data-name", "selected");
      cards[
        randomIndex
      ].innerHTML = `<span class="relative w-full h-full block ${bot}"></span>`;
    }
  }
}

// get selected item to selected the winner
function checkCards(ind) {
  return document.querySelectorAll(".single--card")[ind].dataset.type;
}

// check similar card index and it data type icon
function checkSimilarCard(arr, sign) {
  if (
    checkCards(arr[0]) === sign &&
    checkCards(arr[1]) === sign &&
    checkCards(arr[2]) === sign
  ) {
    // console.log(arr);
    return true;
  }
}

// Choosing the winner and moving to the second chance
function selectedTheWinner() {
  let array = [
    [0, 1, 2], // 0
    [3, 4, 5], // 1
    [6, 7, 8], // 2
    [0, 4, 8], // 3
    [2, 4, 6], // 4
    [0, 3, 6], // 5
    [1, 4, 7], // 6
    [2, 5, 8], // 7
  ];
  if (
    checkSimilarCard(array[0], icon) ||
    checkSimilarCard(array[1], icon) ||
    checkSimilarCard(array[2], icon) ||
    checkSimilarCard(array[3], icon) ||
    checkSimilarCard(array[4], icon) ||
    checkSimilarCard(array[5], icon) ||
    checkSimilarCard(array[6], icon) ||
    checkSimilarCard(array[7], icon)
  ) {
    if (icon === "O") {
      soundEffect(sounds[0]);
      messageBoxContent(
        ["hidden"],
        ["flex"],
        "🧐",
        ' " O " IS THE WINNER, TRY AGAIN MATE ',
        false
      );
    } else {
      soundEffect(sounds[3]);
      messageBoxContent(
        ["hidden"],
        ["flex"],
        "🎉😎",
        'OH YA " X " IS THE WINNER, GOOD JOB MATE',
        false
      );
    }
    if (Number(localStorage.getItem("level")) <= 5) {
      localStorage.setItem(
        "level",
        JSON.stringify(Number(localStorage.getItem("level")) + 1)
      );
      coins = Number(localStorage.getItem("level") - 1) * 10;
      localStorage.setItem("coins", coins);
      coinsConvertor(coins, 5);
    }
    if (Number(localStorage.getItem("level")) >= 5) {
      localStorage.setItem("date", new Date());
    }
    checkLevel();
    activeAction = false;
    botPlayer(activeAction);
    for (let ci = 0; ci < cards.length; ci++) {
      if (cards[ci].childElementCount === 0) {
        changeClasses(
          ["bg-red-500"],
          ["bg-gray-100", "selected--card"],
          cards[ci]
        );
        cards[
          ci
        ].innerHTML = `<span class="relative w-full h-full block unselected--card"></span>`;
      }
    }
    changeClasses(["grid"], ["hidden"], gameBody);
    changeClasses(["flex"], ["hidden"], gameBodyHeader);
  } else {
    let a = document.querySelectorAll('.single--card[data-name="selected"]');
    if (a.length === cards.length) {
      soundEffect(sounds[0]);
      messageBoxContent(
        ["hidden"],
        ["flex"],
        "😐",
        "Not all cards are matched, try again",
        false
      );
      changeClasses(["grid"], ["hidden"], gameBody);
      changeClasses(["flex"], ["hidden"], gameBodyHeader);
    }
  }
}

// coins convertor
function coinsConvertor(num, targetLength) {
  return num.toString().padStart(targetLength, "0");
}

// sounds function
function soundEffect(sound) {
  let audio = new Audio(`../sounds/${sound}`);
  audio.play();
}

// message box function to append any element
function messageBoxContent(oldClass, newClass, icon, content, action) {
  changeClasses(oldClass, newClass, gameMsg);
  gameMsg.querySelector("span").innerHTML = icon;
  gameMsg.querySelector("h3").innerHTML = content;
  if (localStorage.date)
    setInterval(() => {
      handleSelectedDate(localStorage.date, gameMsg.querySelector("h3"));
    }, 1000);
  if (action) {
    gameMsg.querySelector("button").setAttribute("disabled", "disabled");
  } else {
    gameMsg.querySelector("button").removeAttribute("disabled");
    gameMsg.querySelector("button").onclick = () => {
      if (Number(localStorage.getItem("level")) <= 5) {
        window.location.reload();
        localStorage.setItem(
          "coins",
          Math.floor(Number(localStorage.getItem("level") - 1) * 10)
        );
      } else {
        localStorage.setItem("level", 1);
        localStorage.setItem(
          "coins",
          Math.floor(Number(localStorage.getItem("level") - 1) * 10)
        );
      }
    };
  }
}

//  get next date function from that date added to locaestorage
function getNextDate(date) {
  let nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay;
}

// handle that current date from localestorage

function handleSelectedDate(d, elem) {
  let selectedDate = getNextDate(new Date(d));
  let currentDate = new Date();

  let time = selectedDate.getTime() - currentDate.getTime();

  let hrs = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let mins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  let secs = Math.floor((time % (1000 * 60)) / 1000);

  let finalTime = `<span class="inline-block  py-1 mx-2 px-4 rounded-lg bg-blue-50 text-blue-500 font-semibold">${
    hrs < 10 ? "0" + hrs : hrs
  }</span> : 
  <span class="inline-block  py-1 mx-2 px-4 rounded-lg bg-blue-50 text-blue-500 font-semibold">${
    mins < 10 ? "0" + mins : mins
  }</span> : 
  <span class="inline-block  py-1 mx-2 px-4 rounded-lg bg-blue-50 text-blue-500 font-semibold">${
    secs < 10 ? "0" + secs : secs
  }</span>`;
  document.querySelector(".msg").innerHTML = finalTime;
  if (hrs === 0 && mins === 0 && secs === 0) {
    localStorage.setItem("level", 1);
    localStorage.setItem("coins", 0);
    localStorage.removeItem("date");
    window.location.reload();
  }
}
