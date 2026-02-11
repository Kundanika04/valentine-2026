// ==========================================
// 1. CONFIGURATION
// ==========================================
const DEBUG_MODE = false;

function createBackgroundHearts() {
  const heart = document.createElement("div");
  heart.classList.add("bg-heart");
  heart.innerHTML = ["❤️", "💖", "💗", "💕", "🌸"][
    Math.floor(Math.random() * 5)
  ];
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = Math.random() * 3 + 5 + "s";
  heart.style.fontSize = Math.random() * 10 + 15 + "px";
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 8000);
}
setInterval(createBackgroundHearts, 500);

// --- MAGIC SPARKLE EFFECT (Mouse & Touch) ---
const createSparkle = (x, y) => {
  const sparkle = document.createElement("div");
  sparkle.innerHTML = "✨";
  sparkle.style.position = "fixed";
  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";
  sparkle.style.fontSize = "12px";
  sparkle.style.pointerEvents = "none";
  sparkle.style.zIndex = "5000";
  document.body.appendChild(sparkle);

  const destX = x + (Math.random() - 0.5) * 50;
  const destY = y + (Math.random() - 0.5) * 50;

  sparkle.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate(${destX - x}px, ${destY - y}px) scale(0)`,
        opacity: 0,
      },
    ],
    { duration: 1000, easing: "ease-out" }
  );

  setTimeout(() => sparkle.remove(), 1000);
};

// Desktop Sparkle
document.addEventListener("mousemove", (e) =>
  createSparkle(e.clientX, e.clientY)
);

// Mobile Sparkle (when he taps)
document.addEventListener("touchstart", (e) => {
  createSparkle(e.touches[0].clientX, e.touches[0].clientY);
});

const firebaseConfig = {
  apiKey: "AIzaSyBvcKYpXL8YS7fqdpa5Zu1PCVetbY4brDY",
  authDomain: "valentinegift-d2dd0.firebaseapp.com",
  databaseURL:
    "https://valentinegift-d2dd0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "valentinegift-d2dd0",
  storageBucket: "valentinegift-d2dd0.firebasestorage.app",
  messagingSenderId: "694003693612",
  appId: "1:694003693612:web:825f5de0cb42f3d29f3989",
  measurementId: "G-56R8SWDEE0",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const valentineData = [
  {
    day: 7,
    title: "Rose Day",
    type: "quiz",
    question:
      "I want to know... what is your favorite flower in the whole world? 🌸",
    answer: "ANY",
    content:
      "Hello, Mitthu<br><br>Happy happy Day 1 of Valentine's week<br><br>Now the \"..loves me...loves me not game\" I had done a lot when I started to crush on you. Although kahi baar I did get a Yes, I didn't think it would be true...but here I am celebrating my valentine's with the guy I wanted so bad<br><br>Single rose se kabhi kaam nhi chalta to show how much you mean to me. Agar tu PG mai hota toh you would have gotten flowers but koina. Here's a virtual bouquet from me.<br><br>I love you so so so very much Aditya.",
  },

  {
    day: 8,
    title: "Propose Day",
    type: "approval",
    task: "Send me a video of you proposing me",
    content:
      "I know it's not extremely accurate but uss din yeh karne bohot mann tha cause this was the day we met for the first time after you told me that you liked me as well.<br><br>That day in September when you told me, I honestly did not know what to think cause mere mind mai sab hal chal mach rha tha but I instantly wanted to say yes and I did.<br><br> So on this Propose Day, I want to say that I am so glad that you proposed to me and that I said yes because now we are together and I can't imagine my life without you. I love you so much Aditya! ❤️",
  },
  {
    day: 9,
    title: "Chocolate Day",
    type: "approval",
    task: "I want a cutie selfie with a chocolate or any snack you wanna have today. (Either you get or I am getting it for you )",
    content:
      "Like the song that you recently started listening (song toh guess kar le) -<br><br> एक नज़र जो ऐसे मिल रही है, थोड़ी तेज़ सांसें चल रही हैं,सीने में है धड़का, अज़ जोरों से, हम समझते थे के इसमें दिल नहीं है<br><br> Even I thought ki mai kabhi kabhi aise kisiko apna emotional side dikhaungi hi nhi, mai hu hi stone hearted and ki I won't need anyone in my life. Phir tune entry maar li and the days I cried in front of you, the way you confort me and the way you make me smile, I am so emotionally dependent on you and I am loving it! I love you so much Aditya! ❤️",
  },
  {
    day: 11,
    title: "Promise Day and happy 5 months Mitthuuu!!!",
    type: "approval",
    task: "Recent ka nhi but college ki aisi ham dono ki aisi kuch baate batao jo were good memories for you before we became official...mere side ke tujhe itne pata hai, tumhare aise hai? ",
  },
];

const grid = document.getElementById("calendarGrid");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const modalTitle = document.getElementById("modalTitle");

const isAdmin =
  new URLSearchParams(window.location.search).get("admin") === "true";
if (isAdmin) document.getElementById("adminPanel").style.display = "block";

function updateProgress() {
  const totalDays = valentineData.length;
  const today = new Date();
  const unlockedCount = valentineData.filter((item) => {
    return (
      DEBUG_MODE ||
      !(
        today.getMonth() < 1 ||
        (today.getMonth() === 1 && today.getDate() < item.day)
      )
    );
  }).length;
  const percent = (unlockedCount / totalDays) * 100;
  const bar = document.getElementById("loveBar");
  if (bar) bar.style.width = percent + "%";
}

function init() {
  grid.innerHTML = "";
  const today = new Date();
  updateProgress();

  valentineData.forEach((item) => {
    // Inside your valentineData.forEach((item, index) => { ... })

    const card = document.createElement("div");
    card.classList.add("card");
    // Assign an ID so we can find this specific card later
    card.id = "card-" + item.day;

    // Check Firebase to see if this day is ALREADY finished
    database.ref("day" + item.day).once("value", (snap) => {
      if (snap.val() && snap.val().approved) {
        card.classList.add("completed");
      }
    });

    // Logic to check if date is reached
    const isLocked =
      !DEBUG_MODE &&
      (today.getMonth() < 1 ||
        (today.getMonth() === 1 && today.getDate() < item.day));

    if (isLocked) {
      card.classList.add("locked");
      const targetDate = new Date(today.getFullYear(), 1, item.day);
      const diff = targetDate - today;

      // UI BASED ON DATA: Shows Title and Date even when locked
      let cardHTML = `
                <span style="font-size: 0.8em; opacity: 0.8;">Feb ${item.day}</span><br>
                <strong style="display:block; margin: 5px 0;">${item.title}</strong>
                <span>🔒</span>
            `;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        cardHTML += `<br><span style="font-size: 0.7em; opacity: 0.8;">Unlocks in ${hours}h ${mins}m</span>`;
      }
      card.innerHTML = cardHTML;
    } else {
      // UI BASED ON DATA: Shows Title and Date for unlocked cards
      card.innerHTML = `
                <span style="font-size: 0.8em;">Feb ${item.day}</span><br>
                <strong style="display:block; margin: 5px 0;">${item.title}</strong>
                <span style="font-size: 1.5em;">🎁</span><br>
                <small style="font-size: 0.7em; opacity: 0.9;">Click to Open</small>
            `;
      card.onclick = () => openModal(item);
    }
    grid.appendChild(card);

    // Update Admin Panel buttons to use the Title from Data
    // Add to Admin Panel
    if (isAdmin && item.type === "approval") {
      const adminContainer = document.getElementById("adminButtons");

      // 1. Approve Button
      const btnApprove = document.createElement("button");
      btnApprove.innerText = `Approve ${item.title}`;
      btnApprove.style =
        "margin:5px; width:auto; font-size:12px; background:green;";
      btnApprove.onclick = () => {
        database.ref("day" + item.day).set({ approved: true });
        confetti();
      };

      // 2. Reset/Lock Button (New!)
      const btnReset = document.createElement("button");
      btnReset.innerText = `Lock ${item.day}`;
      btnReset.style =
        "margin:5px; width:auto; font-size:12px; background:grey;";
      btnReset.onclick = () => {
        database.ref("day" + item.day).set({ approved: false });
        alert(`Day ${item.day} locked again!`);
        window.location.reload(); // Refresh to see changes
      };

      adminContainer.appendChild(btnApprove);
      adminContainer.appendChild(btnReset);
    }
  });
}

function openModal(item) {
  modalTitle.innerText = item.title;

  // Force the modal to be a flex container for centering
  modal.style.display = "flex";

  if (item.type === "quiz") {
    modalBody.innerHTML = `
            <p>${item.question}</p>
            <input type="text" id="ansInput" placeholder="Answer here..." autocomplete="off">
            <button onclick="checkQuiz(${item.day})">Unlock Gift</button>
        `;

    // Auto-focus keyboard for him
    setTimeout(() => {
      const input = document.getElementById("ansInput");
      if (input) input.focus();
    }, 200);
  } else {
    // Approval logic: Show waiting UI immediately
    modalBody.innerHTML = `
            <p>${item.task}</p>
            <div id="syncArea">
                <div class="loader"></div>
                <p style="font-size:0.8rem; color: var(--hot-pink);">Waiting for my approval...</p>
            </div>
        `;

    // Listen to Firebase for real-time changes
    database.ref("day" + item.day).on("value", (snap) => {
      const data = snap.val();

      // If you have clicked "Approve" on your admin panel
      if (data && data.approved === true) {
        // 1. ADD THE GOLD GLOW: Find the card on the main grid and make it glow
        const cardElem = document.getElementById("card-" + item.day);
        if (cardElem) cardElem.classList.add("completed");

        // 2. CELEBRATE: Trigger confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff0054", "#fb6f92", "#ffffff"],
        });

        // 3. SHOW GIFT: Load the interactive reward
        loadInteraction(item);
      } else {
        // If not approved yet, keep the waiting UI
        console.log("Day " + item.day + " is currently locked.");
      }
    });
  }
}

document.querySelector(".close-btn").onclick = () => {
  modal.style.display = "none";
};

function checkQuiz(dayNum) {
  const item = valentineData.find((d) => d.day === dayNum);
  const inputField = document.getElementById("ansInput");
  const val = inputField.value.trim();

  // SPECIAL RULE FOR ROSE DAY
  if (dayNum === 7) {
    if (val.length > 0) {
      // 1. Save his favorite flower to Firebase so you can see it!
      database.ref("favorites/flower").set(val);

      // 2. Celebrate and start the plucking game
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      // 3. Mark card as completed
      const currentCard = document.getElementById("card-" + dayNum);
      if (currentCard) currentCard.classList.add("completed");

      loadInteraction(item);
    } else {
      alert("Please tell me your favorite flower! ❤️");
    }
  }
  // ORIGINAL RULE FOR OTHER DAYS
  else {
    if (val.toLowerCase() === item.answer.toLowerCase()) {
      const currentCard = document.getElementById("card-" + dayNum);
      if (currentCard) currentCard.classList.add("completed");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      loadInteraction(item);
    } else {
      // Shake effect
      const modalContent = document.querySelector(".modal-content");
      modalContent.animate(
        [
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 300 }
      );
      inputField.style.borderColor = "red";
    }
  }
}

// ==========================================
// 4. INTERACTIVE REWARDS
// ==========================================
function loadInteraction(item) {
  modalBody.innerHTML = `<p style="color:var(--hot-pink);">${item.content}</p>`;

  if (item.day === 7) {
    let petalsPlucked = 0;
    const phrases = [
      "She loves me...",
      "She loves me not...",
      "She loves me...",
      "She loves me not...",
      "She loves me...",
      "SHE LOVES ME! ❤️",
    ];

    modalBody.innerHTML = `
        <div class="flower-wrap" id="flowerContainer">
            <div class="flower-center" id="flowerCenter"></div>
            <!-- Petals will be generated here -->
        </div>
        <div id="pluckText" style="font-weight:bold; color:var(--hot-pink);">Tap the petals to pluck them...</div>
        
        <div id="finalReveal" style="display:none;">
            <div class="big-love-sign" style="font-family:'Pacifico'; font-size:3rem;">I LOVE YOU!</div>
            <div style="font-size:80px;">💐</div>
            <div class="envelope" id="openEnv" style="margin-top:20px; font-size:50px; cursor:pointer;">✉️</div>
            <div id="secretNote" class="hidden-note" style="display:none; padding:15px; border:2px dashed var(--hot-pink); border-radius:10px; background:#fff5f5;">
            <!-- NEW: THE SMALL PHOTO INSIDE THE ENVELOPE -->
        <img src="envelope-small.jpg" class="envelope-photo" alt="Us">
        
        <div style="color: var(--hot-pink); font-style: italic;">
                ${item.content}
            </div>
        </div>
    `;

    const container = document.getElementById("flowerContainer");
    const center = document.getElementById("flowerCenter");
    const pluckText = document.getElementById("pluckText");
    const finalReveal = document.getElementById("finalReveal");

    // Generate 6 petals in a circle
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("div");
      p.className = "individual-petal";
      const angle = i * 60; // 360 / 6 = 60 degrees each
      p.style.setProperty("--angle", `${angle}deg`);
      p.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      p.id = `petal-${i}`;
      container.appendChild(p);
    }

    container.onclick = () => {
      if (petalsPlucked < 6) {
        const currentPetal = document.getElementById(`petal-${petalsPlucked}`);

        // Assign random fall direction to this specific petal
        const fallX = (Math.random() - 0.5) * 300 + "px";
        const fallR = Math.random() * 720 + "deg";
        currentPetal.style.setProperty("--fallX", fallX);
        currentPetal.style.setProperty("--fallR", fallR);

        // Trigger animation
        currentPetal.classList.add("petal-fall");

        // Update text
        pluckText.innerText = phrases[petalsPlucked];

        petalsPlucked++;

        if (petalsPlucked === 6) {
          setTimeout(() => {
            // Throw center away
            center.classList.add("center-fly");
            pluckText.style.display = "none";

            setTimeout(() => {
              container.style.display = "none";
              finalReveal.style.display = "block";
              confetti({ particleCount: 200, spread: 100 });

              document.getElementById("openEnv").onclick = function () {
                this.innerHTML = "📂";
                document.getElementById("secretNote").style.display = "block";
              };
            }, 600);
          }, 1000);
        }
      }
    };
  } else if (item.day === 8) {
    // PROPOSE DAY
    modalBody.innerHTML = `
            <div id="proposeGame">
                <p style="font-weight:bold; font-size:1.3rem; color: var(--hot-pink);">
                    Mitthu, will you be my Valentine?
                </p>
                
                <div id="proposeContainer" style="height:250px; position:relative; margin-top:20px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                    <button id="yesBtn" style="width:auto; padding: 15px 45px; font-size: 24px; z-index:10; background: var(--hot-pink); color: white; border-radius: 50px; border:none; box-shadow: 0 10px 20px rgba(255,0,84,0.3);">YES! ❤️</button>
                    
                    <button id="noBtn" style="
                        position:absolute; 
                        top: 20px; right: 20px; 
                        width:auto; 
                        padding:8px 15px; 
                        font-size:12px; 
                        background:#eee; 
                        color:#333 !important; 
                        border:1px solid #ccc; 
                        border-radius:5px;
                        cursor:not-allowed; 
                        z-index:20; 
                        transition: all 0.1s ease;
                        touch-action: none; /* Prevents browser zooming/panning on tap */
                    ">No</button>
                </div>
            </div>

            <div id="proposeResult" style="display:none;">
                <h2 style="font-family:'Pacifico'; color:var(--hot-pink); font-size:2.5rem;">Official Valentine! ❤️</h2>
                <div class="heartbeat-container" style="font-size:80px; margin: 20px 0;">💖</div>
                <!-- PHOTO REVEAL -->
                <img src="us-propose.jpg" style="width:100%; border-radius:15px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); margin-bottom:15px;" alt="Us">
                <div class="hidden-note" style="display:block; white-space: pre-wrap; background: #fff5f5; border: 2px dashed var(--hot-pink); text-align:left;">
                    ${item.content}
                </div>
            </div>
        `;

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const container = document.getElementById("proposeContainer");
    const proposeGame = document.getElementById("proposeGame");
    const proposeResult = document.getElementById("proposeResult");

    const moveButton = (e) => {
      if (e) e.preventDefault(); // CRITICAL: This stops the click from happening

      const maxX = container.clientWidth - noBtn.offsetWidth;
      const maxY = container.clientHeight - noBtn.offsetHeight;

      // Generate random coordinates
      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY);

      noBtn.style.left = randomX + "px";
      noBtn.style.top = randomY + "px";
    };

    // Mouse listeners for desktop
    noBtn.addEventListener("mouseover", moveButton);

    // Touch listeners for phone (Passive: false allows e.preventDefault to work)
    noBtn.addEventListener("touchstart", moveButton, { passive: false });

    // Safety net: if he somehow clicks it, it still moves
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      moveButton();
    });

    yesBtn.onclick = () => {
      confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
      if (document.getElementById("successSnd"))
        document.getElementById("successSnd").play();
      proposeGame.style.display = "none";
      proposeResult.style.display = "block";
    };
  } else if (item.day === 9) {
    // CHOCOLATE DAY: Comic + Scratch
    modalBody.innerHTML = `
            <div id="comicSection">
                <div class="comic-container">
                    <div class="comic-frame">
                        <img src="comic1.png">
                        <div class="comic-text">That day I was already extremely overwhelmed. Subha se mood bilkul accha nhi tha, the week seemed very hectic for me and upar se I was falling sick</div>
                    </div>
                    <div class="comic-frame">
                        <img src="comic2.png">
                        <div class="comic-text">Even after I cam eback home, I had to attend another meeting. I was so tired and so stressed and people just kept texting us time pe and I was very overwhelmed. I do not know mere mind mai kya chal rha tha. Phir maine tujhe call kiya.</div>
                    </div>
                    <div class="comic-frame">
                        <img src="comic3.png">
                        <div class="comic-text">I called with the intention ki I can distract myself from whatever I was feeling. But terese kabhi kuch baat chupa hi nhi sakthi. Teri awaaz sunke mai ro di. This is something I do not do with anyone else. Even when I'm feeling down, I've always handled it on my own. But this time, you made me feel safe and loved.</div>
                    </div>
                    <div class="comic-frame">
                        <img src="comic4.png">
                        <div class="comic-text">Tu baat sunta hai, mujhe hasata hai, and I felt so so so much better talking to you and that's honestly something that I never thought I would cause I used to just avoid people when I'm feeling down. But i was happy being vulnerable with you. I felt extremely lucky that moment. I wanted to hug you but chalo imagine karte karte so gayi thi. I don't know what you must've felt uss din ki mai aise out of no where ro di but that chocolate was the best gesture.</div>
                    </div>
                </div>
                <button id="startScratchBtn" style="margin-top:15px;">Eat the Chocolate 🍫</button>
            </div>

            <div id="scratchSection" style="display:none;">
                <p style="color:var(--hot-pink); font-weight:bold; margin-bottom:10px;">Scratch karo</p>
                <div class="chocolate-box">
                    <img src="us-chocolate.jpg" class="hidden-photo">
                    <canvas id="scratchCanvas" width="280" height="280"></canvas>
                </div>
                <div id="chocolateNote" style="display:none; margin-top:15px;">
                    <div class="envelope" id="openEnv" style="font-size:50px; cursor:pointer;">✉️</div>
                    <div id="secretNote" style="display:none; padding:15px; border:2px dashed var(--hot-pink); border-radius:10px; background:#fff5f5; width:90%;">
                        <!-- IMAGE INSIDE ENVELOPE -->
                        <img src="envelope-small.jpg" class="envelope-photo">
                        <p>${item.content}</p>
                    </div>
                </div>
            </div>
        `;

    const startScratchBtn = document.getElementById("startScratchBtn");
    const comicSection = document.getElementById("comicSection");
    const scratchSection = document.getElementById("scratchSection");

    startScratchBtn.onclick = () => {
      comicSection.style.display = "none";
      scratchSection.style.display = "flex"; // Changed to flex for centering
      initScratch();
    };
  } else if (item.day === 10) {
    // TEDDY DAY
    let hugPower = 0;
    modalBody.innerHTML = `
            <div class="teddy-box">
                <p style="font-weight:bold;">Give the Teddy a big squeeze! 🤗</p>
                <div id="teddyEmoji">🧸</div>
                
                <div class="hug-meter-container">
                    <div id="hugMeterBar"></div>
                </div>
                
                <p class="hug-instructions" id="hugStatus">Tap the teddy to start hugging...</p>
                
                <div id="teddyMessage" style="display:none; margin-top:20px; animation: fadeIn 0.5s;">
                    <div class="hidden-note" style="display:block; background:#fff5f5; border:2px dashed var(--hot-pink);">
                        ${item.content}
                    </div>
                </div>
            </div>
        `;

    const teddy = document.getElementById("teddyEmoji");
    const bar = document.getElementById("hugMeterBar");
    const status = document.getElementById("hugStatus");
    const msg = document.getElementById("teddyMessage");

    const handleSqueeze = (e) => {
      if (e) e.preventDefault();
      if (hugPower >= 100) return;

      hugPower += 5; // Each tap adds 5%
      bar.style.width = hugPower + "%";

      // Visual Squeeze Effect
      teddy.style.transform = "scale(0.8)";
      setTimeout(() => {
        teddy.style.transform = "scale(1.1)";
      }, 50);

      // Logic for different stages
      if (hugPower < 50) {
        status.innerText = "More hugs! ❤️";
      } else if (hugPower < 90) {
        status.innerText = "Almost there! So warm! 🔥";
      } else if (hugPower >= 100) {
        status.innerText = "HUG COMPLETED! 🧸✨";
        teddy.style.transform = "scale(1.2)";
        confetti({ particleCount: 150, spread: 60 });

        // Show the final note
        msg.style.display = "block";
        teddy.style.animation = "heartbeat 1.5s infinite";
      }
    };

    // Desktop and Mobile listeners
    teddy.addEventListener("mousedown", handleSqueeze);
    teddy.addEventListener("touchstart", handleSqueeze, { passive: false });
  } else if (item.day === 11) {
    // PROMISE DAY: Infinite Reason Machine
    const reasons = [
      "Pata nhi kyu bhejtha tha but I liked it whenever you would send your DAs to me aise for confirming if tune sab sahi kiya ki nhi. Bohot khush ho jaati jab bhi tera aise koi message aata tha. Maybe tu dusro ko bhi bhetha hoga who nhi pata but still I was happy you'd sent me. Itne focus ke saath tere DAs check karti thi my god",
      "Back when tuje choki choki ka packet bhi kholne nhi aata tha....kya kya sikhana padtha hai tumhe",
      "Everytime either of us had ice cream, we would always send a picture of it...I'm pretty sure even when I was trying \"not to talk to you\" I would still send you pictures...it was something i'd only do with you aur koi nhi",
      "Jab hamari baate start hui thi and I would wait everyday for the end of the day to get your text...I would wait cause I didn't want to annoy you by texting but kabhi kabhi mujhse raha nhi jaata and mai hi text kar deti thi and phir bas ek ghanta we would chat...I mean 4th semester ke FATs ke time pe I would enjoy nights with you aaahhhaaa it was fun",
      "Class mai kabhi aise saath mai nhi baithe and agar baiththe bhi toh baat karte hi nhi the...tab hi thoda lagta tha ki hmmm baat toh nhi hoti hamare beech but phir raat mai text kaafi kaafi kaafi baate hehehe",
      "Again I know ki sabhi ke liye le aaya tha but jab tu Ooty gaya and you got chocolates waha se oohhooo the best everI savoured those chocolates and I would be so so so so happy every time I ate it",
      "Whenever you would tell about your city ke kahaniya ya phir apne bachpan ke kisse, mai itne interest se sunti aur itni khush ho jaati...I love it when when you talk mitthu I love listening to you...aise hi kahaniya batate reh na",
      "October mai, when we went to McD for my treat and you told me ki you wore a shirt because I liked it MMMMMMMMMMMMMMMMM itni hasi mai who message padhke",
      "The car obsession...I like the fact that I can share my insane obsession about driving with you..bhale hi I haven't driven around as much as you have but still tere saath toh drive pe jaana hai..chalega?",
      "When you got me the Jhumkas from Gujarat...one of the best things I've ever gotten...I wore them the most...itna pehenthi thi ki roommates gaali dete the ki kuch aur pehen le...I made sure ki for my sankranthi outfit I should only wear yeh...mummy bohot boli ki ek aur set pehen le kyunki earrings se matching necklace nhi thi but still earrings it is I love them",
      "The amount of happiness I would get whenever I got you a kinderjoy...you would get so happy with kinderjoy mera mann bhar jaata tha seeing you smile like that",
      "The day I found ki aise your sister has a flat in the same apartment as mine...oohhhooo...for no frickin reason I was so happy",
      "You know when I felt like I won....I remember when I asked you Pehle about your ghar ka naam, you said ki no one in the college knows but then later (a year ago) you told me about Ishu and best part...I found out about Munna...I love my Munna",
      "The day you wore my bracelet in the class for the first time and I wore your watch...that day made me feel so mmmmmm I don't know how to describe the feeling but it was just one of the best feelings",
      "Internship ke time pe, on my birthday...I was pretty sure I wouldn't get your message considering how I don't text so often but nhi jab mai subha uthi ad you wished and teddy wished, it made my day Mitthu..i know you're not the kind of person to stay up early and wish kisi ko bhi, so that meant a lot and I was so happy that day...and that day, I was literally only talking to you",
      "You know when I felt the happy during the placements time...you called me even before the day of your interview...you could've done anything, you could've rested, you could've slept, reels chala leta but nhi, you called me you talked to me and that meant a lot a lot a lot pata hai",
      "Whenever you talk about my bag, the way you tell me ki it's yours and no one can have it...tujhe pata nhi how much I blush, I love it so so so much when you get possessive",
      "Best day ever in October...when you sent the message...I did catch it but I still wasn't sure but when you told me pakka pakka OH MY GODDDDDD that day I was high",
      "Our first kiss...mmmmmmm tujhe toh pata hi hai how I felt...aise mujhe chup karana is hard but tumne kara diya..I love you so much mitthu",
      "Whenever I overthink, you always have the perfect words to calm me down...I don't know how you do it but you just do...mai faltu ka overthink karti hu and within minutes of talking with you, you make me laugh",
      "When I was insecure about the way I look and you told me that I look beautiful and that you love my smile...I don't know how to explain the feeling but it just made me feel the most loved...that night even when after I cried, your words made me feel so so so much better and I slept so happy that night",
    ];

    modalBody.innerHTML = `
            <p style="font-weight:bold; color:var(--hot-pink);">"All the moments I fell you for you over and over again<br>My promise to always love you and make sure you are the happiest cause you truly truly deserve the best, mitthu<br>For every time you think why I love you just remember that I have all of these moments with me which made me fall in love with you"</p>
            <div id="reasonContainer" style="background: var(--bg); border: 2px dashed var(--soft-pink); padding: 20px; border-radius: 15px; margin: 20px 0; min-height: 80px; display: flex; align-items: center; justify-content: center; font-style: italic; color: var(--hot-pink);">
                <p id="reasonText" style="transition: opacity 0.2s ease-in-out; margin:0;">Click the button to see a reason! 👇</p>
            </div>
            <button id="reasonBtn">A moment</button>
            <p style="font-size: 0.8rem; margin-top:10px; opacity:0.7; color:var(--hot-pink);">(Keep clicking... there's no end!)</p>
        `;

    setTimeout(() => {
      const btn = document.getElementById("reasonBtn");
      const text = document.getElementById("reasonText");
      if (btn && text) {
        btn.onclick = () => {
          const randomReason =
            reasons[Math.floor(Math.random() * reasons.length)];
          text.style.opacity = 0;
          setTimeout(() => {
            text.innerText = randomReason;
            text.style.opacity = 1;
            confetti({
              particleCount: 40,
              spread: 50,
              origin: { y: 0.8 },
              colors: ["#ff0054", "#fb6f92"],
            });
          }, 200);
        };
      }
    }, 100);
  }
}

// Keep your startRoseShower, initScratch, initKissZone exactly as they were!
function startRoseShower() {
  const numPetals = 100;
  const emojis = ["🌹", "🌸", "❤️", "💕"];
  for (let i = 0; i < numPetals; i++) {
    setTimeout(() => {
      const p = document.createElement("div");
      p.className = "petal";
      p.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + "vw";
      p.style.fontSize = Math.random() * 20 + 20 + "px";
      const duration = Math.random() * 3 + 3;
      p.style.animationDuration = duration + "s";
      document.body.appendChild(p);
      setTimeout(() => {
        p.remove();
      }, duration * 1000);
    }, i * 100);
  }
}

function initScratch() {
  const canvas = document.getElementById("scratchCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const note = document.getElementById("chocolateNote");

  // 1. Draw Chocolate Cover
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#4b2c20";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add instructions text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px Poppins";
  ctx.textAlign = "center";
  ctx.fillText("SCRATCH TO EAT 🍫", 140, 145);

  // 2. Prepare the "Eraser"
  ctx.globalCompositeOperation = "destination-out";

  const handleScratch = (e) => {
    // Prevent the page from scrolling
    if (e.cancelable) e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    // Handle both Mouse and Touch coordinates
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2); // 30 is the bite size
    ctx.fill();

    checkScratched(canvas, note);
  };

  // MOUSE EVENTS (Desktop)
  canvas.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) handleScratch(e);
  });
  canvas.addEventListener("mousedown", handleScratch);

  // TOUCH EVENTS (Mobile)
  canvas.addEventListener("touchstart", handleScratch, { passive: false });
  canvas.addEventListener("touchmove", handleScratch, { passive: false });
}

// Function to auto-reveal the note once enough is scratched
function checkScratched(canvas, note) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) transparentPixels++;
  }

  const percent = (transparentPixels / (canvas.width * canvas.height)) * 100;
  if (percent > 50) {
    canvas.style.transition = "opacity 1s ease";
    canvas.style.opacity = "0";
    note.style.display = "flex"; // Show the envelope container
    setTimeout(() => {
      canvas.remove();
      const openEnv = document.getElementById("openEnv");
      const secretNote = document.getElementById("secretNote");
      if (openEnv) {
        openEnv.onclick = () => {
          openEnv.innerHTML = "📂";
          secretNote.style.display = "block"; // Reveal note and small photo
          confetti();
        };
      }
    }, 1000);
  }
}

function initKissZone() {
  const zone = document.getElementById("kissZone");
  zone.onclick = (e) => {
    const h = document.createElement("div");
    h.innerHTML = "💋";
    h.className = "floating-heart";
    h.style.left = e.offsetX + "px";
    h.style.top = e.offsetY + "px";
    zone.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  };
}

init();
setInterval(init, 60000);
