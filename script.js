// Variables globales
let currentPlayer = 1; // Commence avec le joueur 1
const players = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }; // Scores
let selectedTheme = '';
let selectedLevel = 0;
let timer;

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
  const body = document.body;

  // Vérifier si le niveau existe dans les gradients
  if (!gradients[level]) {
    console.error(`Le niveau ${level} n'existe pas dans les dégradés.`);
    return;
  }

  // Récupérer le dégradé pour le niveau actuel
  const background = gradients[level].background;

  // Appliquer la transition et le nouveau fond sans fond temporaire
  body.style.transition = "background 1.5s ease-in-out";  // Définir la transition CSS via JS pour garantir son application
  body.style.background = background;  // Appliquer directement le fond
};





// Mise à jour de l'encadré
function updateTheme(theme) {
  const themeTitle = document.getElementById("theme-title");
  const themeImage = document.getElementById("theme-image");

  themeTitle.textContent = `Thème : ${theme}`;

  // Appel à l'API Pixabay pour récupérer une image relative au thème
  fetch(`https://pixabay.com/api/?key=47437355-1acf3c956ad575074eb916013&q=${encodeURIComponent(theme)}&image_type=photo`)
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



// Banque de questions
const questionsBank = {
  Histoire: {
    1: { question: "Qui a découvert l'Amérique ?", answers: ["Christophe Colomb", "Vasco de Gama", "Marco Polo", "Magellan"], correct: "A" },
    2: { question: "En quelle année a eu lieu la bataille de Hastings ?", answers: ["1066", "1215", "1415", "1515"], correct: "A" },
    3: { question: "Quel empire était dirigé par Alexandre le Grand ?", answers: ["L'Empire romain", "L'Empire perse", "L'Empire macédonien", "L'Empire ottoman"], correct: "C" },
    4: { question: "Qui était le premier empereur de Rome ?", answers: ["Jules César", "Auguste", "Néron", "Trajan"], correct: "B" },
    5: { question: "En quelle année la Révolution française a-t-elle commencé ?", answers: ["1776", "1789", "1812", "1848"], correct: "B" },
    6: { question: "Quel traité a mis fin à la Première Guerre mondiale ?", answers: ["Traité de Paris", "Traité de Versailles", "Traité de Trianon", "Traité de Vienne"], correct: "B" },
    7: { question: "Quel pays a été dirigé par Gengis Khan ?", answers: ["La Chine", "La Mongolie", "L'Inde", "Le Japon"], correct: "B" },
    8: { question: "Quelle reine d'Égypte a eu une relation avec Jules César ?", answers: ["Cléopâtre", "Néfertiti", "Hatchepsout", "Bérénice"], correct: "A" },
    9: { question: "Quel roi de France a été surnommé 'Le Roi Soleil' ?", answers: ["Henri IV", "Louis XIV", "Louis XVI", "Napoléon"], correct: "B" },
    10: { question: "Quel événement a marqué la fin de l'Empire romain d'Occident ?", answers: ["La chute de Constantinople", "Le sac de Rome par les Wisigoths", "La déposition de Romulus Augustule", "La bataille d'Actium"], correct: "C" },
  },
  ACDC: {
    1: {
        question: "Quel est le titre de la chanson la plus célèbre d'AC/DC ?",
        answers: ["Back in Black", "Smells Like Teen Spirit", "Bohemian Rhapsody", "Sweet Child O' Mine"],
        correct: "A"
    },
    2: {
        question: "Quel est le nom du chanteur actuel d'AC/DC ?",
        answers: ["Brian Johnson", "Bon Scott", "Axl Rose", "Freddie Mercury"],
        correct: "A"
    },
    3: {
        question: "Dans quel pays le groupe AC/DC a-t-il été formé ?",
        answers: ["Royaume-Uni", "Australie", "États-Unis", "Canada"],
        correct: "B"
    },
    4: {
        question: "Quel est le nom du fondateur et guitariste principal d'AC/DC ?",
        answers: ["Angus Young", "Malcolm Young", "Eddie Van Halen", "Jimmy Page"],
        correct: "A"
    },
    5: {
        question: "En quelle année AC/DC a-t-il sorti son album *Highway to Hell* ?",
        answers: ["1976", "1979", "1982", "1985"],
        correct: "B"
    },
    6: {
        question: "Quel membre original d'AC/DC est décédé en 1980 ?",
        answers: ["Brian Johnson", "Malcolm Young", "Bon Scott", "Phil Rudd"],
        correct: "C"
    },
    7: {
        question: "Quel album d'AC/DC est devenu l'un des albums les plus vendus de tous les temps ?",
        answers: ["Back in Black", "Dirty Deeds Done Dirt Cheap", "For Those About to Rock", "Let There Be Rock"],
        correct: "A"
    },
    8: {
        question: "Quelle chanson d'AC/DC commence par les célèbres cloches funéraires ?",
        answers: ["Thunderstruck", "Hells Bells", "Shoot to Thrill", "You Shook Me All Night Long"],
        correct: "B"
    },
    9: {
        question: "Quel frère des Young a quitté le groupe en raison de problèmes de santé en 2014 ?",
        answers: ["Angus Young", "Malcolm Young", "George Young", "Stephen Young"],
        correct: "B"
    },
    10: {
        question: "Quel est le titre de la chanson d'AC/DC utilisée dans le film *Iron Man 2* ?",
        answers: ["Shoot to Thrill", "Rock or Bust", "Have a Drink on Me", "Big Gun"],
        correct: "A"
    },
  },
  DaftPunk: {
    1: {
        question: "Quel duo français de musique électronique porte des casques ?",
        answers: ["Daft Punk", "Justice", "Air", "Phoenix"],
        correct: "A"
    },
    2: {
        question: "Quel est le titre de la chanson emblématique de Daft Punk sortie en 2013 ?",
        answers: ["Get Lucky", "Harder, Better, Faster, Stronger", "One More Time", "Around the World"],
        correct: "A"
    },
    3: {
        question: "Quel est le titre du premier album de Daft Punk ?",
        answers: ["Homework", "Discovery", "Random Access Memories", "Alive"],
        correct: "A"
    },
    4: {
        question: "Quel film Disney a une bande originale composée par Daft Punk ?",
        answers: ["Tron: Legacy", "Wall-E", "The Incredibles", "Big Hero 6"],
        correct: "A"
    },
    5: {
        question: "En quelle année Daft Punk a-t-il annoncé sa séparation ?",
        answers: ["2019", "2020", "2021", "2022"],
        correct: "C"
    },
    6: {
        question: "Quelle marque célèbre de casques audio a collaboré avec Daft Punk ?",
        answers: ["Beats by Dre", "Bang & Olufsen", "Sennheiser", "Pioneer"],
        correct: "B"
    },
    7: {
        question: "Dans quel clip Daft Punk a-t-il utilisé une animation style japonais ?",
        answers: ["One More Time", "Robot Rock", "Da Funk", "Aerodynamic"],
        correct: "A"
    },
    8: {
        question: "Quel artiste américain a samplé 'Harder, Better, Faster, Stronger' ?",
        answers: ["Kanye West", "Pharrell Williams", "Jay-Z", "Dr. Dre"],
        correct: "A"
    },
    9: {
        question: "Quel titre de Daft Punk est une collaboration avec Julian Casablancas des Strokes ?",
        answers: ["Instant Crush", "Doin' It Right", "Lose Yourself to Dance", "Touch"],
        correct: "A"
    },
    10: {
        question: "Sous quel pseudonyme le duo a-t-il produit avant de devenir Daft Punk ?",
        answers: ["Darlin'", "The Robots", "Le Punk", "Electro Groove"],
        correct: "A"
    },
  },
  Guitare: {
    1: {
        question: "Combien de cordes a une guitare classique standard ?",
        answers: ["4", "6", "8", "12"],
        correct: "B"
    },
    2: {
        question: "Quelle guitare est surnommée 'Strat' ?",
        answers: ["Fender Stratocaster", "Gibson Les Paul", "Ibanez RG", "PRS Custom"],
        correct: "A"
    },
    3: {
        question: "Quel guitariste est surnommé 'Slowhand' ?",
        answers: ["Eric Clapton", "Jimi Hendrix", "B.B. King", "Slash"],
        correct: "A"
    },
    4: {
        question: "Quel groupe a popularisé l'utilisation de la guitare à double manche ?",
        answers: ["Led Zeppelin", "Pink Floyd", "Deep Purple", "AC/DC"],
        correct: "A"
    },
    5: {
        question: "Quel matériau est souvent utilisé pour fabriquer les médiators ?",
        answers: ["Bois", "Plastique", "Métal", "Cuir"],
        correct: "B"
    },
    6: {
        question: "Quel musicien a créé l'album *Electric Ladyland* ?",
        answers: ["Jimi Hendrix", "Jimmy Page", "David Gilmour", "Stevie Ray Vaughan"],
        correct: "A"
    },
    7: {
        question: "Quel fabricant produit la série de guitares 'Les Paul' ?",
        answers: ["Gibson", "Fender", "Ibanez", "Yamaha"],
        correct: "A"
    },
    8: {
        question: "Quel est l’accord de base le plus souvent appris en premier ?",
        answers: ["Do majeur (C)", "La mineur (Am)", "Ré majeur (D)", "Sol majeur (G)"],
        correct: "A"
    },
    9: {
        question: "Quel guitariste a utilisé une Fender Stratocaster appelée 'Blackie' ?",
        answers: ["Eric Clapton", "Jeff Beck", "George Harrison", "Kurt Cobain"],
        correct: "A"
    },
    10: {
        question: "Quelle guitare est utilisée dans la chanson 'Stairway to Heaven' ?",
        answers: ["Gibson SG", "Gibson Les Paul", "Fender Telecaster", "Gibson double manche"],
        correct: "D"
    },
  },
  Improvisation: {
    1: {
        question: "Qu'est-ce que l'improvisation théâtrale ?",
        answers: ["Un texte écrit à l'avance", "Un jeu sans texte préparé", "Une danse traditionnelle", "Un monologue classique"],
        correct: "B"
    },
    2: {
        question: "Quel accessoire est souvent utilisé en impro ?",
        answers: ["Un chapeau", "Une épée", "Aucun accessoire", "Un script"],
        correct: "C"
    },
    3: {
        question: "Comment s'appelle un exercice où les comédiens construisent une histoire ensemble ?",
        answers: ["Match d'impro", "Cadavre exquis", "Freeze", "Ping-pong"],
        correct: "A"
    },
    4: {
        question: "Dans quel pays est né le concept moderne des matchs d'impro ?",
        answers: ["France", "Canada", "États-Unis", "Royaume-Uni"],
        correct: "B"
    },
    5: {
        question: "Quel est le rôle du maître de cérémonie dans un match d'impro ?",
        answers: ["Donner les thèmes", "Jouer sur scène", "Écrire les textes", "Faire la mise en scène"],
        correct: "A"
    },
    6: {
        question: "Comment appelle-t-on une improvisation totalement silencieuse ?",
        answers: ["Impro muette", "Mime", "Impro blanche", "Impro solo"],
        correct: "B"
    },
    7: {
        question: "Qu'est-ce qu'un *catch impro* ?",
        answers: ["Une impro sur le thème de la boxe", "Une impro en duo", "Une impro très rapide", "Une impro en musique"],
        correct: "B"
    },
    8: {
        question: "Quel est l’objectif principal de l’improvisation théâtrale ?",
        answers: ["Être drôle", "Raconter une histoire", "Imiter des acteurs célèbres", "Répéter une pièce"],
        correct: "B"
    },
    9: {
        question: "Quelle technique consiste à toujours accepter les propositions en impro ?",
        answers: ["L'effet papillon", "La règle du 'oui, et...'", "Le ping-pong", "L'écoute active"],
        correct: "B"
    },
    10: {
        question: "Quel festival international célèbre l'improvisation ?",
        answers: ["Just for Laughs", "Impro Fest", "Mondial d'improvisation", "Avignon"],
        correct: "C"
    },
  },
  Chanteurs: {
    1: {
        question: "Quel chanteur américain est surnommé 'The King of Pop' ?",
        answers: ["Michael Jackson", "Elvis Presley", "Frank Sinatra", "Prince"],
        correct: "A"
    },
    2: {
        question: "Quelle chanteuse américaine a interprété 'Like a Virgin' ?",
        answers: ["Madonna", "Whitney Houston", "Lady Gaga", "Beyoncé"],
        correct: "A"
    },
    3: {
        question: "Qui a chanté 'Born in the U.S.A.' ?",
        answers: ["Bruce Springsteen", "Bob Dylan", "Johnny Cash", "Elton John"],
        correct: "A"
    },
    4: {
        question: "Quel chanteur est surnommé 'The Boss' ?",
        answers: ["Bruce Springsteen", "Billy Joel", "Paul Simon", "Bob Dylan"],
        correct: "A"
    },
    5: {
        question: "Quel artiste américain est connu pour sa guitare enflammée à Woodstock ?",
        answers: ["Jimi Hendrix", "Carlos Santana", "Janis Joplin", "Joe Cocker"],
        correct: "A"
    },
    6: {
        question: "Quel chanteur de jazz est connu pour 'What a Wonderful World' ?",
        answers: ["Louis Armstrong", "Nat King Cole", "Frank Sinatra", "Duke Ellington"],
        correct: "A"
    },
    7: {
        question: "Qui a chanté l'hymne américain lors de la finale du Super Bowl 1991 ?",
        answers: ["Whitney Houston", "Mariah Carey", "Celine Dion", "Aretha Franklin"],
        correct: "A"
    },
    8: {
        question: "Quel chanteur américain est connu sous le surnom de 'Slim Shady' ?",
        answers: ["Eminem", "Jay-Z", "Kanye West", "50 Cent"],
        correct: "A"
    },
    9: {
        question: "Quel chanteur a remporté le premier Grammy Award pour l'album de l'année ?",
        answers: ["Frank Sinatra", "Elvis Presley", "Nat King Cole", "Ray Charles"],
        correct: "A"
    },
    10: {
        question: "Quel chanteur américain a remporté le prix Nobel de littérature ?",
        answers: ["Bob Dylan", "Bruce Springsteen", "Leonard Cohen", "Paul Simon"],
        correct: "A"
    },
  },


  Science: {
    1: { question: "Quelle est la formule chimique de l'eau ?", answers: ["H2O", "CO2", "O2", "NaCl"], correct: "A" },
    2: { question: "Quel est l'état de la matière du soleil ?", answers: ["Solide", "Liquide", "Plasma", "Gaz"], correct: "C" },
    3: { question: "Quel gaz est le plus abondant dans l'atmosphère terrestre ?", answers: ["Oxygène", "Azote", "Dioxyde de carbone", "Argon"], correct: "B" },
    4: { question: "Quelle est la vitesse approximative de la lumière ?", answers: ["300 km/s", "300 000 km/s", "150 000 km/s", "1 000 km/s"], correct: "B" },
    5: { question: "Quelle planète est la plus proche du soleil ?", answers: ["Mars", "Vénus", "Mercure", "Jupiter"], correct: "C" },
    6: { question: "Comment appelle-t-on l'étude des étoiles ?", answers: ["Astrologie", "Astronomie", "Météorologie", "Astrophysique"], correct: "B" },
    7: { question: "Quel élément chimique a pour symbole 'Fe' ?", answers: ["Fer", "Fluor", "Francium", "Fermium"], correct: "A" },
    8: { question: "Quel scientifique a formulé la théorie de la relativité ?", answers: ["Newton", "Einstein", "Galilée", "Hawking"], correct: "B" },
    9: { question: "Quel physicien a découvert la radioactivité ?", answers: ["Newton", "Marie Curie", "Becquerel", "Einstein"], correct: "C" },
    10: { question: "Quel est l'âge estimé de l'univers ?", answers: ["4,6 milliards d'années", "10 milliards d'années", "13,8 milliards d'années", "20 milliards d'années"], correct: "C" },
  },
  Géographie: {
    1: { question: "Quelle est la capitale de la France ?", answers: ["Paris", "Berlin", "Madrid", "Rome"], correct: "A" },
    2: { question: "Quelle mer borde la côte sud de la France ?", answers: ["Mer Méditerranée", "Mer Noire", "Mer du Nord", "Mer Adriatique"], correct: "A" },
    3: { question: "Quel est le plus long fleuve du monde ?", answers: ["Nil", "Amazone", "Yangtsé", "Mississippi"], correct: "B" },
    4: { question: "Dans quel pays se trouve le mont Everest ?", answers: ["Chine", "Inde", "Népal", "Pakistan"], correct: "C" },
    5: { question: "Quel est le plus grand océan du monde ?", answers: ["Atlantique", "Pacifique", "Arctique", "Indien"], correct: "B" },
    6: { question: "Quel pays a la plus grande superficie au monde ?", answers: ["Canada", "Russie", "États-Unis", "Chine"], correct: "B" },
    7: { question: "Quelle ville est connue comme 'la Ville Éternelle' ?", answers: ["Athènes", "Rome", "Istanbul", "Jérusalem"], correct: "B" },
    8: { question: "Quel désert est le plus grand du monde ?", answers: ["Sahara", "Gobi", "Kalahari", "Antarctique"], correct: "D" },
    9: { question: "Dans quel pays se trouve le Kilimandjaro ?", answers: ["Kenya", "Tanzanie", "Afrique du Sud", "Éthiopie"], correct: "B" },
    10: { question: "Quelle chaîne de montagnes sépare l'Europe de l'Asie ?", answers: ["Les Alpes", "Les Carpates", "L'Oural", "Les Pyrénées"], correct: "C" },
  },
};
// Gestion des étapes
const steps = {
  theme: document.getElementById("step-theme"),
  level: document.getElementById("step-level"),
  question: document.getElementById("step-question"),
};

const showStep = (stepName) => {
  Object.values(steps).forEach((step) => step.classList.remove("active"));
  steps[stepName].classList.add("active");
};

// Transition vers "Choix du niveau" avec validation du thème
document.getElementById("theme-validate-btn").addEventListener("click", () => {
  const themeInput = document.getElementById("theme-input").value.trim(); // Récupère la saisie utilisateur
  const validThemes = Object.keys(questionsBank); // Liste des thèmes disponibles

  if (validThemes.includes(themeInput)) {
    selectedTheme = themeInput;
    updateTheme(selectedTheme); // Met à jour l'encadré avec le thème sélectionné
    showStep("level"); // Passe à l'étape suivante
  } else {
    alert("Thème invalide. Veuillez saisir un thème valide (Histoire, Science, Géographie).");
  }
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

// Gestion des questions
const startQuestion = () => {
  showStep("question");

  const questionData = questionsBank[selectedTheme][selectedLevel];
  const questionText = document.getElementById("question-text");
  questionText.textContent = questionData.question;

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
  players[currentPlayer] += isCorrect ? level : -level;

  // Mettre à jour l'affichage du score du joueur
  document.getElementById(`player${currentPlayer}`).querySelector("span").textContent = players[currentPlayer];

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
    showStep("theme"); // Revenir à l'étape du thème
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

resetGameInfo();
applyStyles(11); // Réinitialisation des informations
showStep("theme"); // Commence au choix du thème
