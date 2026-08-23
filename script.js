/* =========================================
   ELEMENTS
========================================= */

const inviteScreen =
  document.getElementById("inviteScreen");

const yesScreen =
  document.getElementById("yesScreen");

const calendarScreen =
  document.getElementById("calendarScreen");

const finalScreen =
  document.getElementById("finalScreen");


const yesButton =
  document.getElementById("yesButton");

const noButton =
  document.getElementById("noButton");

const chooseDateButton =
  document.getElementById("chooseDateButton");

const confirmDate =
  document.getElementById("confirmDate");

const startOver =
  document.getElementById("startOver");


const hint =
  document.getElementById("hint");

const buttonZone =
  document.getElementById("buttonZone");

const calendarGrid =
  document.getElementById("calendarGrid");

const monthLabel =
  document.getElementById("monthLabel");

const selectedDateText =
  document.getElementById("selectedDate");

const finalDate =
  document.getElementById("finalDate");

const prevMonth =
  document.getElementById("prevMonth");

const nextMonth =
  document.getElementById("nextMonth");

const petals =
  document.getElementById("petals");


/* =========================================
   NO BUTTON
========================================= */

let noMoves = 0;

let lastMoveTime = 0;

let currentX = 0;

let currentY = 0;

let noIsMoving = false;


/*
  Small, eye-trackable movement.
*/

const MIN_MOVE = 65;

const MAX_MOVE = 105;

const MOVE_COOLDOWN = 450;


/*
  Central movement area.

  NO can NEVER wander across
  the whole screen.
*/

const SAFE_ZONE_WIDTH = 340;

const SAFE_ZONE_HEIGHT = 170;


/* =========================================
   HINTS
========================================= */

const hints = [

  "Are you sure?",

  "Hmm... try again.",

  "Xadicha, really?",

  "That button doesn't seem to work.",

  "Even the cat disagrees.",

  "You can keep trying...",

  "I think we both know the answer.",

  "NO is becoming a little difficult, isn't it?"

];


/* =========================================
   SCREEN SWITCHING
========================================= */

function showScreen(screen) {

  const screens = [

    inviteScreen,

    yesScreen,

    calendarScreen,

    finalScreen

  ];


  screens.forEach(
    current => {

      if (current === screen) {

        current.hidden = false;

        current.classList.remove(
          "active"
        );

        void current.offsetWidth;

        current.classList.add(
          "active"
        );

      } else {

        current.hidden = true;

      }

    }
  );

}


/* =========================================
   INITIAL POSITION
========================================= */

function rememberNoPosition() {

  const rect =
    noButton.getBoundingClientRect();


  currentX =
    rect.left;


  currentY =
    rect.top;

}


/* =========================================
   NO SAFE AREA
========================================= */

function getSafeZone() {

  const buttonRect =
    noButton.getBoundingClientRect();


  const zoneRect =
    buttonZone.getBoundingClientRect();


  const centerX =
    zoneRect.left +
    zoneRect.width / 2;


  const centerY =
    zoneRect.top +
    zoneRect.height / 2;


  const halfWidth =
    Math.min(
      SAFE_ZONE_WIDTH / 2,
      window.innerWidth / 2 - 20
    );


  const halfHeight =
    Math.min(
      SAFE_ZONE_HEIGHT / 2,
      window.innerHeight / 2 - 20
    );


  return {

    minX:
      centerX -
      halfWidth,

    maxX:
      centerX +
      halfWidth -
      buttonRect.width,

    minY:
      centerY -
      halfHeight,

    maxY:
      centerY +
      halfHeight -
      buttonRect.height

  };

}


/* =========================================
   MOVE NO
========================================= */

function moveNoButton(
  pointerX,
  pointerY
) {

  const now =
    Date.now();


  if (
    now - lastMoveTime <
    MOVE_COOLDOWN
  ) {

    return;

  }


  if (noIsMoving) {

    return;

  }


  noIsMoving = true;

  lastMoveTime = now;


  const rect =
    noButton.getBoundingClientRect();


  const centerX =
    rect.left +
    rect.width / 2;


  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    centerX -
    pointerX;


  let dy =
    centerY -
    pointerY;


  if (
    Math.abs(dx) < 8 &&
    Math.abs(dy) < 8
  ) {

    const angle =
      Math.random() *
      Math.PI *
      2;

    dx =
      Math.cos(angle);

    dy =
      Math.sin(angle);

  }


  const length =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  dx /= length;

  dy /= length;


  const moveDistance =
    MIN_MOVE +
    Math.random() *
    (
      MAX_MOVE -
      MIN_MOVE
    );


  /*
    Slight randomness.
  */

  const randomAngle =
    (
      Math.random() -
      .5
    ) * .35;


  const cos =
    Math.cos(randomAngle);

  const sin =
    Math.sin(randomAngle);


  const finalDX =
    dx * cos -
    dy * sin;


  const finalDY =
    dx * sin +
    dy * cos;


  /*
    IMPORTANT:

    Only move inside the
    central safe zone.
  */

  const zone =
    getSafeZone();


  let newX =
    currentX +
    finalDX *
    moveDistance;


  let newY =
    currentY +
    finalDY *
    moveDistance;


  newX =
    Math.max(
      zone.minX,
      Math.min(
        newX,
        zone.maxX
      )
    );


  newY =
    Math.max(
      zone.minY,
      Math.min(
        newY,
        zone.maxY
      )
    );


  /*
    If movement was too small,
    choose another safe point.
  */

  if (
    Math.abs(
      newX - currentX
    ) < 35 &&
    Math.abs(
      newY - currentY
    ) < 35
  ) {

    newX =
      Math.max(
        zone.minX,
        Math.min(
          currentX -
          finalDX *
          moveDistance,
          zone.maxX
        )
      );


    newY =
      Math.max(
        zone.minY,
        Math.min(
          currentY -
          finalDY *
          moveDistance,
          zone.maxY
        )
      );

  }


  currentX =
    newX;


  currentY =
    newY;


  noButton.style.position =
    "fixed";


  noButton.style.left =
    `${newX}px`;


  noButton.style.top =
    `${newY}px`;


  const rotation =
    (
      Math.random() -
      .5
    ) * 7;


  noButton.style.transform =
    `rotate(${rotation}deg)`;


  noMoves++;


  showHint();


  lastMoveTime =
    Date.now();


  setTimeout(
    () => {

      noIsMoving = false;

    },
    390
  );

}


/* =========================================
   MOUSE
========================================= */

document.addEventListener(
  "mousemove",
  event => {

    const rect =
      noButton.getBoundingClientRect();


    const centerX =
      rect.left +
      rect.width / 2;


    const centerY =
      rect.top +
      rect.height / 2;


    const distance =
      Math.sqrt(
        Math.pow(
          event.clientX -
          centerX,
          2
        ) +
        Math.pow(
          event.clientY -
          centerY,
          2
        )
      );


    if (
      distance < 115
    ) {

      moveNoButton(
        event.clientX,
        event.clientY
      );

    }

  }
);


/* =========================================
   TOUCH
========================================= */

noButton.addEventListener(
  "touchstart",
  event => {

    event.preventDefault();


    const touch =
      event.touches[0];


    if (!touch) {
      return;
    }


    moveNoButton(
      touch.clientX,
      touch.clientY
    );

  },
  {
    passive: false
  }
);


/* =========================================
   NO CLICK
========================================= */

noButton.addEventListener(
  "click",
  event => {

    event.preventDefault();

    showHint();

  }
);


/* =========================================
   HINT
========================================= */

function showHint() {

  const index =
    Math.min(
      noMoves,
      hints.length - 1
    );


  hint.textContent =
    hints[index];


  hint.classList.remove(
    "show"
  );


  void hint.offsetWidth;


  hint.classList.add(
    "show"
  );

}


/* =========================================
   YES
========================================= */

yesButton.addEventListener(
  "click",
  () => {

    showScreen(
      yesScreen
    );

  }
);


/* =========================================
   CHOOSE DATE
========================================= */

chooseDateButton.addEventListener(
  "click",
  () => {

    showScreen(
      calendarScreen
    );


    initializeCalendar();

  }
);


/* =========================================
   CALENDAR
========================================= */

const today =
  new Date();


today.setHours(
  0,
  0,
  0,
  0
);


let calendarMonth =
  new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );


let chosenDate =
  null;


/* =========================================
   FORMAT
========================================= */

const monthFormatter =
  new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      year: "numeric"
    }
  );


const fullDateFormatter =
  new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  );


/* =========================================
   CALENDAR INITIALIZE
========================================= */

function initializeCalendar() {

  calendarMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  chosenDate =
    null;


  confirmDate.disabled =
    true;


  selectedDateText.textContent =
    "Choose a day above";


  renderCalendar();

}


/* =========================================
   RENDER
========================================= */

function renderCalendar() {

  calendarGrid.innerHTML =
    "";


  monthLabel.textContent =
    monthFormatter.format(
      calendarMonth
    );


  const year =
    calendarMonth.getFullYear();


  const month =
    calendarMonth.getMonth();


  /*
    JavaScript Sunday = 0.

    Convert to Monday = 0.
  */

  const firstDay =
    new Date(
      year,
      month,
      1
    );


  const startingDay =
    (
      firstDay.getDay() +
      6
    ) % 7;


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  /*
    Empty spaces.
  */

  for (
    let i = 0;
    i < startingDay;
    i++
  ) {

    const empty =
      document.createElement(
        "div"
      );


    calendarGrid.appendChild(
      empty
    );

  }


  /*
    Days.
  */

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.className =
      "day";


    button.type =
      "button";


    button.textContent =
      day;


    const date =
      new Date(
        year,
        month,
        day
      );


    date.setHours(
      0,
      0,
      0,
      0
    );


    /*
      No past dates.
    */

    if (
      date < today
    ) {

      button.disabled =
        true;

    }


    /*
      Selected date.
    */

    if (
      chosenDate &&
      date.getTime() ===
      chosenDate.getTime()
    ) {

      button.classList.add(
        "selected"
      );

    }


    button.addEventListener(
      "click",
      () => {

        selectDate(
          date
        );

      }
    );


    calendarGrid.appendChild(
      button
    );

  }


  /*
    Can't go before
    current month.
  */

  const currentMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  prevMonth.disabled =
    calendarMonth <=
    currentMonth;

}


/* =========================================
   SELECT DATE
========================================= */

function selectDate(
  date
) {

  chosenDate =
    date;


  selectedDateText.textContent =
    fullDateFormatter.format(
      date
    );


  confirmDate.disabled =
    false;


  renderCalendar();

}


/* =========================================
   MONTH NAVIGATION
========================================= */

prevMonth.addEventListener(
  "click",
  () => {

    const currentMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    const previous =
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1
      );


    if (
      previous >=
      currentMonth
    ) {

      calendarMonth =
        previous;

      renderCalendar();

    }

  }
);


nextMonth.addEventListener(
  "click",
  () => {

    calendarMonth =
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1
      );


    renderCalendar();

  }
);


/* =========================================
   CONFIRM DATE
========================================= */

confirmDate.addEventListener(
  "click",
  () => {

    if (!chosenDate) {
      return;
    }


    finalDate.textContent =
      fullDateFormatter.format(
        chosenDate
      );


    showScreen(
      finalScreen
    );


    createCelebration();

  }
);


/* =========================================
   FINAL CELEBRATION
========================================= */

function createCelebration() {

  for (
    let i = 0;
    i < 28;
    i++
  ) {

    setTimeout(
      createPetal,
      i * 80
    );

  }

}


/* =========================================
   PETALS
========================================= */

function createPetal() {

  const petal =
    document.createElement(
      "div"
    );


  petal.className =
    "petal";


  petal.textContent =
    Math.random() > .5
      ? "♡"
      : "✦";


  petal.style.left =
    `${Math.random() * 100}vw`;


  petal.style.fontSize =
    `${8 + Math.random() * 9}px`;


  petal.style.setProperty(
    "--drift",
    `${Math.random() * 180 - 90}px`
  );


  petal.style.animationDuration =
    `${6 + Math.random() * 5}s`;


  petals.appendChild(
    petal
  );


  setTimeout(
    () => {

      petal.remove();

    },
    12000
  );

}


function startBackgroundPetals() {

  for (
    let i = 0;
    i < 7;
    i++
  ) {

    setTimeout(
      createPetal,
      i * 900
    );

  }


  setInterval(
    createPetal,
    1800
  );

}


/* =========================================
   START OVER
========================================= */

startOver.addEventListener(
  "click",
  () => {

    noButton.style.position =
      "relative";


    noButton.style.left =
      "";


    noButton.style.top =
      "";


    noButton.style.transform =
      "";


    noMoves =
      0;


    hint.textContent =
      "";


    hint.classList.remove(
      "show"
    );


    setTimeout(
      rememberNoPosition,
      100
    );


    showScreen(
      inviteScreen
    );

  }
);


/* =========================================
   RESIZE
========================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      noButton.style.position ===
      "fixed"
    ) {

      const zone =
        getSafeZone();


      currentX =
        Math.max(
          zone.minX,
          Math.min(
            currentX,
            zone.maxX
          )
        );


      currentY =
        Math.max(
          zone.minY,
          Math.min(
            currentY,
            zone.maxY
          )
        );


      noButton.style.left =
        `${currentX}px`;


      noButton.style.top =
        `${currentY}px`;

    }

  }
);


/* =========================================
   LOAD
========================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      rememberNoPosition,
      100
    );


    startBackgroundPetals();

  }
);
