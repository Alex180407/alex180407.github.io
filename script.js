// Variables globales
let currentPlayer = 1; // Commence avec le joueur 1
let selectedTheme = '';
let selectedLevel = 0;
let timer;
let playerNames = []; // Stocke les pseudos des joueurs
let numPlayers = 1; // Nombre de joueurs par défaut (modifiable)
// Dégradés des fonds, boutons et textes pour chaque niveau
const gradients = {
  1: { background: "linear-gradient(135deg, #00FF00, #55AA00)"},
  2: { background: "linear-gradient(135deg, #55FF00, #AABB00)"},
  3: { background: "linear-gradient(135deg, #AAFF00, #FFCC00)"},
  4: { background: "linear-gradient(135deg, #FFFF00, #FFAA00)"},
  5: { background: "linear-gradient(135deg, #FFAA00, #FF8800)"},
  6: { background: "linear-gradient(135deg, #FF8800, #FF5500)"},
  7: { background: "linear-gradient(135deg, #FF5500, #FF2200)"},
  8: { background: "linear-gradient(135deg, #FF2200, #DD0000)"},
  9: { background: "linear-gradient(135deg, #DD0000, #AA0000)"},
  10: { background: "linear-gradient(135deg, #AA0000, #770000)"},
  11: { background: "linear-gradient(135deg, #AAAAAA, #777777)"}, // Thème par défaut
};

// Appliquer les styles dynamiques
const applyStyles = (level) => {
  const html = document.documentElement;

  // Vérifier si le niveau existe dans les gradients
  if (!gradients[level]) {
    console.error(`Le niveau ${level} n'existe pas dans les dégradés.`);
    return;
  }

  // Récupérer le dégradé pour le niveau actuel
  const background = gradients[level].background;
 // Définir la transition CSS via JS pour garantir son application
  html.style.background = background;  // Appliquer directement le fond
};





// Mise à jour de l'encadré
function updateTheme(theme) {
  const themeTitle = document.getElementById("theme-title");
  const theme1 = document.getElementById("theme");
  const themeImage = document.getElementById("theme-image");

  theme1.textContent = `Tu te mets combien en ${theme} ?`;
  themeTitle.textContent = `Thème : ${theme}`;

  // Appel à l'API Pixabay pour récupérer une image relative au thème
  fetch(`https://pixabay.com/api/?key=47437355-1acf3c956ad575074eb916013&q=${encodeURIComponent(theme)}&image_type=photo&lang=fr&safesearch=true`)
    .then(response => response.json())
    .then(data => {
      if (data.hits && data.hits.length > 0) {
        themeImage.src = data.hits[0].webformatURL;
        themeImage.style.display = "block";
      } else {
        themeImage.style.display = "block";
        themeImage.src = "https://www.photofunky.net/output/image/f/0/e/3/f0e330/photofunky.gif";
      }
    })
    .catch(err => {
      themeImage.style.display = "block";
      themeImage.src = "https://www.photofunky.net/output/image/f/0/e/3/f0e330/photofunky.gif";
    });
}

function updateLevel(level) {
  const levelInfo = document.getElementById("level-info");
  levelInfo.textContent = `Niveau : ${level}`;

}

function resetGameInfo() {
  document.getElementById("theme-title").textContent = "Thème : -";
  document.getElementById("theme-image").src = "https://www.photofunky.net/output/image/f/0/e/3/f0e330/photofunky.gif";
  document.getElementById("level-info").textContent = "Niveau : -";
}

const steps = {
  players: document.getElementById("step-players"),
  theme: document.getElementById("step-theme"),
  level: document.getElementById("step-level"),
  question: document.getElementById("step-question"),
};
document.getElementById("validate-players-btn").addEventListener("click", () => {
  playerNames = [];

  // Récupérer les pseudos des champs
  for (let i = 1; i <= numPlayers; i++) {
    const pseudo = document.getElementById(`player${i}-name`).value.trim();
    if (pseudo) {
      playerNames.push(pseudo);
    } else {
      alert(`Veuillez entrer un pseudo pour le joueur ${i}`);
      return;
    }
  }

  // Initialiser les joueurs avec les pseudos et scores à 0
  players = {};
  playerNames.forEach((name, index) => {
    players[index + 1] = { name, score: 0 }; // Associer chaque joueur à son nom et score à 0
    // Associer chaque joueur à son nom et score à 0
  });

  // Créer les éléments pour afficher les scores des joueurs si non existants
  const scoreboard = document.getElementById("scoreboard");
  scoreboard.innerHTML = ""; // Réinitialiser le scoreboard
  for (let i = 1; i <= numPlayers; i++) {
    const playerElement = document.createElement("div");
    playerElement.id = `player${i}`;
    playerElement.innerHTML = `${playerNames[i - 1]}: <span>0</span>`;
    scoreboard.appendChild(playerElement);
  }

  // Masquer l'étape des joueurs
  steps.players.style.display = "none";
  const displayScoreboard = document.getElementById("scoreboard");
  displayScoreboard.style.display = "flex";
  // Passer à l'étape suivante (choix du thème)
  updateCurrentPlayerDisplay();
  showStep("theme");
});



// Mise à jour des champs pour les pseudos en fonction du nombre de joueurs
const updatePlayerNameFields = () => {
  const playerNameInputs = document.getElementById("player-name-inputs");
  playerNameInputs.innerHTML = ""; // Réinitialiser les champs existants

  // Créer un champ pour chaque joueur
  for (let i = 1; i <= numPlayers; i++) {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = `Pseudo du joueur ${i}`;
    inputField.id = `player${i}-name`;
    inputField.classList.add("button");

    playerNameInputs.appendChild(inputField);
  }
};




document.getElementById("start-game-btn").addEventListener("click", () => {
  const playerSelectionContainer = document.getElementById("player-names-container");
  playerSelectionContainer.style.display = "block";
  const playerNumberContainer = document.getElementById("player-number");
  playerNumberContainer.style.display = "none";
  updatePlayerNameFields(); // Mettre à jour les champs des pseudos
  showStep("players");  // Affiche l'étape des joueurs
});

document.getElementById("num-players").addEventListener("input", (e) => {
  console.log("Nombre de joueurs choisi :", e.target.value);  // Vérifiez si ce log apparaît
  numPlayers = parseInt(e.target.value);
  updatePlayerNameFields();
});
// Sélection aléatoire d'un joueur pour choisir le thème
const selectRandomPlayerForTheme = () => {
  // Exclure le joueur en cours pour éviter qu'il choisisse pour lui-même
  const availablePlayers = playerNames.filter((_, index) => index + 1 !== currentPlayer);

  // Sélection aléatoire
  const randomIndex = Math.floor(Math.random() * availablePlayers.length);
  const chosenPlayer = availablePlayers[randomIndex];

  // Mettre à jour l'affichage
  const themeChooserDisplay = document.getElementById("theme-chooser-display");
  themeChooserDisplay.textContent = `Le joueur ${chosenPlayer} choisit le thème pour ${playerNames[currentPlayer - 1]} !`;

  return chosenPlayer;
};
// Fonction qui gère l'affichage de chaque étape
const showStep = (stepName) => {
  Object.values(steps).forEach((step) => step.classList.remove("active"));
  steps[stepName].classList.add("active");

  // Masquer le game-info pendant le choix des joueurs
  const gameInfo = document.getElementById("game-info");
  const who = document.getElementById("current-player-display");
  if (stepName === "players") {
    gameInfo.style.display = "none";  // Masque game-info lors de la sélection des joueurs
    who.style.display = "none";
  } else {
    gameInfo.style.display = "block"; // Réaffiche game-info lors des autres étapes
    who.style.display = "block";
  }

};



// Transition vers "Choix du niveau" avec validation du thème
document.getElementById("theme-validate-btn").addEventListener("click", () => {
  const themeInput = document.getElementById("theme-input").value.trim(); // Récupère la saisie utilisateur
  selectedTheme = themeInput;
  updateTheme(selectedTheme); // Met à jour l'encadré avec le thème sélectionné
  showStep("level"); // Passe à l'étape suivante
});

// Fonction pour jouer les sons de pièces avec ajustement dynamique de la durée et de l'intervalle
const playCoinSoundsWithDynamicTiming = (numCoins) => {
  const soundDuration = Math.max(100, 300 - numCoins * 10); // La durée du son diminue avec le nombre de pièces
  const interval = Math.max(50, 200 - numCoins * 15); // L'intervalle entre chaque son diminue aussi

  for (let i = 0; i < numCoins; i++) {
    const coinSoundInstance = new Audio("points.mp3");

    // Lancer le son avec un délai
    setTimeout(() => {
      coinSoundInstance.play();
    }, i * interval); // L'intervalle entre les sons

    // Si vous voulez que chaque son dure une durée déterminée, utilisez setTimeout pour stopper le son après la durée
    setTimeout(() => {
      coinSoundInstance.pause();
      coinSoundInstance.currentTime = 0;  // Réinitialiser le son pour le redémarrer correctement la prochaine fois
    }, i * interval + soundDuration);  // Arrêter le son après la durée
  }
};



// Transition vers "Question" et mise à jour de l'encadré
document.querySelectorAll(".level-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedLevel = parseInt(btn.dataset.level, 10);
    updateLevel(selectedLevel); // Met à jour l'encadré avec le niveau sélectionné

    applyStyles(selectedLevel); // Appliquer le style selon le niveau
    startQuestion();
  });
});


const generateQuestionFromAPI = async (theme, difficulty) => {
  try {
    const prompt = `
      Génère une question de quiz sur le thème "${theme}" avec une difficulté de niveau ${difficulty} (1 étant facile et 10 étant extrêmement difficile).
      La réponse doit être structurée sous forme JSON de la manière suivante :
      {
        "question": "La question posée ici",
        "answers": [
          "Réponse A",
          "Réponse B",
          "Réponse C",
          "Réponse D"
        ],
        "correct": "A"  // La lettre de la bonne réponse, soit "A", "B", "C" ou "D"
      }
    `;

    const response = await fetch('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', {  // Remplacez '/chatgpt-api' par l'URL de votre API backend ou directement l'API OpenAI
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data && data.question && data.answers) {
      return data;
    } else {
      throw new Error('Erreur dans la réponse de l\'API');
    }
  } catch (error) {
    console.error('Erreur lors de la génération de la question', error);
    return {
      question: 'Erreur lors de la génération de la question',
      answers: ['Aucune réponse disponible', 'Aucune réponse disponible', 'Aucune réponse disponible', 'Aucune réponse disponible'],
      correct: 'A',
    };
  }
};



// Appeler cette fonction au début de chaque tour
const startQuestion = async () => {
  // Mettre à jour le joueur actif
  updateCurrentPlayerDisplay();

  showStep("question");

  // Appeler l'API pour obtenir la question
  const questionData = await generateQuestionFromAPI(selectedTheme, selectedLevel);

  // Mettre à jour l'affichage de la question
  const questionText = document.getElementById("question-text");
  questionText.textContent = questionData.question;

  // Mettre à jour les réponses
  const answerButtons = document.querySelectorAll(".answer-btn");
  questionData.answers.forEach((answer, index) => {
    answerButtons[index].textContent = answer;
    answerButtons[index].dataset.correct = questionData.correct === String.fromCharCode(65 + index); // 'A', 'B', etc.
  });

  // Démarrer le chronomètre
  let timeLeft = 10;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      showMessage("Temps écoulé ! Mauvaise réponse.", false);
      updateScore(false, selectedLevel);
    }
  }, 1000);
};



// Réponses des joueurs
document.querySelectorAll(".answer-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    clearInterval(timer);

    const isCorrect = btn.dataset.correct === "true";
    const message = isCorrect ? "Bonne réponse !" : "Mauvaise réponse !";
    showMessage(message, isCorrect);
    updateScore(isCorrect, selectedLevel);
  });
});

// Mise à jour des scores et changement de joueur
// Mise à jour des scores et changement de joueur
const updateScore = (isCorrect, level) => {
  // Mise à jour du score du joueur
  // Mise à jour du score du joueur
  players[currentPlayer].score += isCorrect ? level : -level;


  // Mettre à jour l'affichage du score du joueur
  document.getElementById(`player${currentPlayer}`).querySelector("span").textContent = players[currentPlayer].score;


  // Appeler la fonction des sons de pièces si des points ont été gagnés
  if (isCorrect) {
    playCoinSoundsWithDynamicTiming(level); // Lancer les sons en fonction des points gagnés
  }

  // Changer de joueur après un délai
  setTimeout(() => {
    const playerKeys = Object.keys(players);
    const currentIndex = playerKeys.indexOf(String(currentPlayer));
    const nextIndex = (currentIndex + 1) % playerKeys.length;
    currentPlayer = parseInt(playerKeys[nextIndex], 10);

    resetGameInfo(); // Réinitialiser l'encadré pour le prochain joueur
    applyStyles(11); // Réinitialiser le fond (thème par défaut)
    showStep("theme");
    updateCurrentPlayerDisplay(); // Revenir à l'étape du thème
  }, 2000);
};

// Fonction pour afficher un message de réponse et jouer un son en fonction de la réponse
const showMessage = (message, isCorrect) => {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.textContent = message;
  document.body.appendChild(popup);

  // Jouer un son si la réponse est incorrecte
  if (!isCorrect) {
    const wrongAnswerSound = new Audio("gameover.mp3");
    wrongAnswerSound.play();  // Jouer le son de mauvaise réponse
  }

  // Supprimer le message après un certain temps
  setTimeout(() => popup.remove(), 1500);
};

// Fonction pour mettre à jour l'affichage du joueur actif
const updateCurrentPlayerDisplay = () => {
  const currentPlayerNameElement = document.getElementById("current-player-name");
  currentPlayerNameElement.textContent = players[currentPlayer].name; // Affiche le nom du joueur actif

    // Sélectionner aléatoirement un joueur pour choisir le thème
  selectRandomPlayerForTheme();
};

document.getElementById("pass").addEventListener("click", () => {
  const playerKeys = Object.keys(players);
  const currentIndex = playerKeys.indexOf(String(currentPlayer));
  const nextIndex = (currentIndex + 1) % playerKeys.length;
  currentPlayer = parseInt(playerKeys[nextIndex], 10);
  resetGameInfo(); // Réinitialiser l'encadré
  applyStyles(11);  // Appliquer un fond neutre ou un fond de niveau par défaut
  showStep("theme"); // Revenir à l'étape du thème
});


// Initialisation
applyStyles(11); // Réinitialisation des informations
showStep("players"); // Commence au choix du thème
