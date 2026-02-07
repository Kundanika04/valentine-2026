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
    task: "Send me a photo of us on WhatsApp!",
    content: "I'd choose you every time. Try to click No!",
  },
  {
    day: 9,
    title: "Chocolate Day",
    type: "quiz",
    question: "Which chocolate do I like?",
    answer: "dairy milk",
    content: "Sweet as chocolate! Scratch it off.",
  },
  {
    day: 10,
    title: "Teddy Day",
    type: "approval",
    task: "Send me a voice note saying 'I love you'",
    content: "You're my cuddly teddy bear!",
  },
  {
    day: 11,
    title: "Promise Day",
    type: "quiz",
    question: "Where did we first meet?",
    answer: "college",
    content: "I promise to stay by your side.",
  },
  {
    day: 12,
    title: "Hug Day",
    type: "approval",
    task: "Send me a picture of you making a silly face!",
    content: "Virtual hugs incoming!",
  },
  {
    day: 13,
    title: "Kiss Day",
    type: "quiz",
    question: "What's my favorite color?",
    answer: "red",
    content: "A thousand kisses for you! Tap the box.",
  },
  {
    day: 14,
    title: "Valentine's Day",
    type: "approval",
    task: "Call me and tell me your favorite memory of us!",
    content: "Happy Valentine's Day! I love you! ❤️",
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
    const item = valentineData.find(d => d.day === dayNum);
    const inputField = document.getElementById('ansInput');
    const val = inputField.value.trim();

    // SPECIAL RULE FOR ROSE DAY
    if (dayNum === 7) {
        if (val.length > 0) {
            // 1. Save his favorite flower to Firebase so you can see it!
            database.ref('favorites/flower').set(val);
            
            // 2. Celebrate and start the plucking game
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            
            // 3. Mark card as completed
            const currentCard = document.getElementById("card-" + dayNum);
            if(currentCard) currentCard.classList.add('completed');
            
            loadInteraction(item);
        } else {
            alert("Please tell me your favorite flower! ❤️");
        }
    } 
    // ORIGINAL RULE FOR OTHER DAYS
    else {
        if (val.toLowerCase() === item.answer.toLowerCase()) {
            const currentCard = document.getElementById("card-" + dayNum);
            if(currentCard) currentCard.classList.add('completed');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            loadInteraction(item);
        } else {
            // Shake effect
            const modalContent = document.querySelector('.modal-content');
            modalContent.animate([
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });
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
    modalBody.innerHTML = `
            <p style="font-weight:bold; font-size:1.2rem; color: var(--hot-pink);">${item.content}</p>
            <div id="proposeContainer" style="height:250px; position:relative; margin-top:20px; display:flex; align-items:center; justify-content:center;">
                <button id="yesBtn" style="width:auto; padding: 15px 40px; font-size: 22px; z-index:10; background: var(--hot-pink); color: white; border-radius: 50px;">YES! ❤️</button>
                <button id="noBtn" style="position:absolute; top: 20px; right: 20px; width:auto; padding:5px 10px; font-size:10px; opacity:0.8; background:#eeeeee; color: #333 !important; border: 1px solid #ccc; cursor:not-allowed; z-index:20; transition: all 0.2s ease;">No</button>
            </div>`;
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const container = document.getElementById("proposeContainer");
    yesBtn.onclick = () => {
      confetti({ particleCount: 200, spread: 100 });
      modalBody.innerHTML = `<h2 style="color:var(--hot-pink); font-family: 'Pacifico';">Yay! 💖</h2><p style="color:var(--hot-pink);">I knew you'd say yes!</p><div style="font-size:60px;">👩‍❤️‍👨</div>`;
    };
    const moveButton = () => {
      const randomX = Math.floor(
        Math.random() * (container.offsetWidth - noBtn.offsetWidth)
      );
      const randomY = Math.floor(
        Math.random() * (container.offsetHeight - noBtn.offsetHeight)
      );
      noBtn.style.left = randomX + "px";
      noBtn.style.top = randomY + "px";
    };
    noBtn.onmouseover = moveButton;
    noBtn.ontouchstart = (e) => {
      e.preventDefault();
      moveButton();
    };
  } else if (item.day === 9) {
    // Chocolate Day
    modalBody.innerHTML = `
            <p>${item.content}</p>
            <div class="scratch-container">
                <!-- THE HIDDEN PHOTO -->
                <img src="your-photo.jpg" class="scratch-image" alt="Our Memory">
                
                <!-- THE CHOCOLATE LAYER -->
                <canvas id="scratchCanvas" width="250" height="250"></canvas>
            </div>
            <p style="font-size: 0.8rem; opacity: 0.8;">(Scratch the chocolate to see us! 🍫)</p>
        `;
    setTimeout(initScratch, 100);
  } else if (item.day === 10) {
    // TEDDY
    let clicks = 0;
    modalBody.innerHTML = `<p>Squeeze the Teddy! (Tap fast!)</p><div style="font-size:80px;" id="teddyEmoji">🧸</div><div class="progress-bg" style="width:100%; height:20px; margin-top:10px;"><div id="squeezeBar" style="width:0%; height:100%; background:var(--hot-pink); transition:0.1s;"></div></div><button id="squeezeBtn" style="margin-top:15px;">SQUEEZE! 🤗</button>`;
    setTimeout(() => {
      document.getElementById("squeezeBtn").onclick = () => {
        clicks += 10;
        document.getElementById("squeezeBar").style.width = clicks + "%";
        if (clicks >= 100) {
          confetti();
          modalBody.innerHTML = `<h3>Squeezed! ❤️</h3><p>${item.content}</p><div style="font-size:60px;">🧸✨</div>`;
        }
      };
    }, 100);
  } else if (item.day === 11) {
    // PROMISE DAY: Infinite Reason Machine
    const reasons = [
      "The way you always make me feel safe. ❤️",
      "How you remember the smallest things I say. 🌸",
      "Your laugh is literally my favorite sound. 😂",
      "The way you support my wildest dreams. 🚀",
      "How you can make me smile without saying a word. 😊",
      "The way you look at me when you think I'm not looking. 😍",
      "Your kindness towards everyone you meet. 🌟",
      "How you handle my mood swings with so much patience. 🧘",
      "Because you are my best friend and my home. 🏠",
      "The way you hold my hand in public. 🤝",
      "How you always know exactly what to say to calm me down. ☁️",
      "Because you make even a trip to the grocery store fun. 🛒",
      "The way you've helped me become a better person. 📈",
      "Because I can be 100% my weird self with you. 🤪",
      "Your eyes—I could get lost in them forever. 👀",
      "How you always protect me. 🛡️",
      "The way you smell—it's my favorite scent. ✨",
      "Because you are the last thing I want to talk to before I go to sleep. 😴",
    ];

    modalBody.innerHTML = `
            <p style="font-weight:bold; color:var(--hot-pink);">My Promise: <br> "I will never run out of reasons to love you."</p>
            <div id="reasonContainer" style="background: var(--bg); border: 2px dashed var(--soft-pink); padding: 20px; border-radius: 15px; margin: 20px 0; min-height: 80px; display: flex; align-items: center; justify-content: center; font-style: italic; color: var(--hot-pink);">
                <p id="reasonText" style="transition: opacity 0.2s ease-in-out; margin:0;">Click the button to see a reason! 👇</p>
            </div>
            <button id="reasonBtn">Get a Reason ❤️</button>
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
  } else if (item.day === 12) {
    // HUG
    modalBody.innerHTML = `<p>Hold to give me a long hug!</p><div id="hugHeart" style="font-size:30px; margin: 20px 0; transition: transform 0.1s linear;">🫂</div><button id="hugBtn" style="user-select:none;">HOLD TO HUG 🤗</button>`;
    setTimeout(() => {
      let holdTimer;
      let size = 30;
      const btn = document.getElementById("hugBtn");
      const heart = document.getElementById("hugHeart");
      const startHold = () => {
        holdTimer = setInterval(() => {
          size += 5;
          heart.style.fontSize = size + "px";
          if (size >= 150) {
            clearInterval(holdTimer);
            confetti();
            modalBody.innerHTML = `<h3>Best Hug Ever! 🤗</h3><p>${item.content}</p>`;
          }
        }, 100);
      };
      const endHold = () => {
        clearInterval(holdTimer);
        if (size < 150) {
          size = 30;
          heart.style.fontSize = "30px";
        }
      };
      btn.onmousedown = startHold;
      btn.onmouseup = endHold;
      btn.ontouchstart = (e) => {
        e.preventDefault();
        startHold();
      };
      btn.ontouchend = endHold;
    }, 100);
  } else if (item.day === 13) {
    modalBody.innerHTML += `<div id="kissZone"></div>`;
    setTimeout(initKissZone, 100);
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

  // 1. Draw the "Chocolate" cover
  ctx.fillStyle = "#4b2c20"; // Dark chocolate brown
  ctx.fillRect(0, 0, 250, 250);

  // 2. Add some "wrapped" texture or text so he knows to scratch
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("SCRATCH ME 🍫", 125, 130);

  // 3. Set the "Eraser" mode
  ctx.globalCompositeOperation = "destination-out";

  const scratch = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();

    // Get correct coordinates for both Mouse and Touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); // 25 is the size of the scratch
    ctx.fill();
  };

  // Listeners for both PC and Mobile
  canvas.addEventListener("mousemove", (e) => {
    if (e.buttons === 1) scratch(e);
  });
  canvas.addEventListener("touchstart", scratch);
  canvas.addEventListener("touchmove", scratch);
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
