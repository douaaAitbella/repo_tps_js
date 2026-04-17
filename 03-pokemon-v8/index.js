const inquirer = require('inquirer');
const fetch    = require('node-fetch');

// LISTE DES POKEMONS DISPONIBLES
const LISTE_POKEMONS = [
  'pikachu',    'charizard',  'blastoise',  'venusaur',
  'mewtwo',     'gengar',     'snorlax',    'dragonite',
  'alakazam',   'machamp',    'eevee',      'arcanine',
  'lapras',     'gyarados',   'vaporeon',   'jolteon',
  'bulbasaur',  'charmander', 'squirtle',   'jigglypuff'
];

// HP de depart pour les deux joueurs
let hpJoueur = 300;
let hpBot    = 300;
const HP_MAX = 300;

// FONCTION 1 : charger un pokemon depuis l'API
async function chargerPokemon(nom) {
  const reponse = await fetch('https://pokeapi.co/api/v2/pokemon/' + nom);
  const data    = await reponse.json();
  return data;
}

// FONCTION 2 : charger 5 attaques pour un pokemon
async function chargerAttaques(pokemon) {
  const attaques = [];

  // on regarde les 20 premieres attaques du pokemon
  for (const slot of pokemon.moves.slice(0, 20)) {

    // on s'arrete quand on a 5 attaques
    if (attaques.length >= 5) break;

    try {
      const reponse = await fetch(slot.move.url);
      const attaque = await reponse.json();

      // on garde l'attaque seulement si elle a puissance + precision + pp
      if (attaque.power && attaque.accuracy && attaque.pp) {
        attaques.push({
          nom        : attaque.name,
          puissance  : attaque.power,
          precision  : attaque.accuracy,
          pp         : attaque.pp,
          ppRestants : attaque.pp
        });
      }
    } catch (e) {
      // si une attaque plante, on passe a la suivante
    }
  }

  return attaques;
}


// FONCTION 3 : afficher une barre de vie
function afficherVie(nom, hp) {
  const nbBlocs    = Math.round((hp / HP_MAX) * 20);
  const barreVerte = '='.repeat(nbBlocs);
  const barrePale  = '-'.repeat(20 - nbBlocs);
  console.log(nom.padEnd(12) + ' [' + barreVerte + barrePale + '] ' + hp + '/' + HP_MAX);
}

// FONCTION 4 : faire une attaque
function faireAttaque(attaque, nomAttaquant, cible) {

  // verifier si l'attaque touche selon la precision
  // ex: precision 75 = 75% de chance de toucher
  const touche = Math.random() * 100 < attaque.precision;

  if (!touche) {
    console.log('\n' + nomAttaquant + ' utilise ' + attaque.nom + '... rate !');
    attaque.ppRestants--;
    return;
  }

  // calculer les degats avec un peu d'aleatoire (entre 85% et 115%)
  const degats = Math.round(attaque.puissance * (0.85 + Math.random() * 0.3));

  // appliquer les degats au bon joueur
  if (cible === 'bot') {
    hpBot = Math.max(0, hpBot - degats);
    console.log('\n' + nomAttaquant + ' utilise ' + attaque.nom + ' -> ' + degats + ' degats ! (Bot HP: ' + hpBot + '/' + HP_MAX + ')');
  } else {
    hpJoueur = Math.max(0, hpJoueur - degats);
    console.log('\n' + nomAttaquant + ' utilise ' + attaque.nom + ' -> ' + degats + ' degats ! (Toi HP: ' + hpJoueur + '/' + HP_MAX + ')');
  }

  attaque.ppRestants--;
}

// FONCTION PRINCIPALE : le jeu
async function jouer() {

  console.log('\n==============================');
  console.log('     POKEMON BATTLE CLI');
  console.log('==============================\n');

  // ---- ETAPE 1 : le joueur choisit son pokemon ----
  const reponse1 = await inquirer.prompt([
    {
      type    : 'list',          // menu avec les fleches du clavier
      name    : 'nomChoisi',
      message : 'Choisis ton Pokemon :',
      choices : LISTE_POKEMONS   // les options du menu
    }
  ]);

  const nomJoueur = reponse1.nomChoisi;

  // ---- ETAPE 2 : le bot choisit un pokemon aleatoire ----
  const autresPokemons = LISTE_POKEMONS.filter(function(p) {
    return p !== nomJoueur;
  });
  const nomBot = autresPokemons[Math.floor(Math.random() * autresPokemons.length)];

  // ---- ETAPE 3 : charger les donnees depuis l'API ----
  console.log('\nChargement de ' + nomJoueur + '...');
  const pokemonJoueur = await chargerPokemon(nomJoueur);

  console.log('Chargement de ' + nomBot + ' (bot)...');
  const pokemonBot = await chargerPokemon(nomBot);

  // ---- ETAPE 4 : charger les attaques ----
  console.log('Chargement des attaques...\n');
  const attaquesJoueur = await chargerAttaques(pokemonJoueur);
  const attaquesBot    = await chargerAttaques(pokemonBot);

  // reinitialiser les HP pour une nouvelle partie
  hpJoueur = HP_MAX;
  hpBot    = HP_MAX;

  console.log('Le bot a choisi : ' + nomBot);
  console.log('\n' + nomJoueur + ' VS ' + nomBot);
  console.log('------------------------------');

  // BOUCLE DE COMBAT
  // on repete tant que personne n'est a 0 HP
  while (hpJoueur > 0 && hpBot > 0) {

    // afficher les barres de vie
    console.log('');
    afficherVie(nomJoueur, hpJoueur);
    afficherVie(nomBot,    hpBot);
    console.log('');

    // ---- le joueur choisit son attaque ----
    const reponse2 = await inquirer.prompt([
      {
        type    : 'list',
        name    : 'indexChoisi',
        message : 'Quelle attaque ?',
        choices : attaquesJoueur.map(function(a, i) {
          return {
            name  : a.nom.padEnd(22) + '| PWR:' + String(a.puissance).padEnd(5) + '| ACC:' + a.precision + '%' + '  | PP:' + a.ppRestants + '/' + a.pp,
            value : i
          };
        })
      }
    ]);

    const indexChoisi   = reponse2.indexChoisi;
    const attaqueJoueur = attaquesJoueur[indexChoisi];

    // ---- attaque du joueur ----
    faireAttaque(attaqueJoueur, nomJoueur, 'bot');

    // verifier si le bot est KO
    if (hpBot <= 0) break;

    // ---- attaque du bot ----
    // regle : le bot ne peut utiliser que les attaques ou ses PP >= PP restants du joueur
    const attaquesValides = attaquesBot.filter(function(a) {
      return a.ppRestants > 0 && a.ppRestants >= attaqueJoueur.ppRestants;
    });

    if (attaquesValides.length === 0) {
      console.log('\n' + nomBot + ' ne peut pas attaquer (PP insuffisants) !');
    } else {
      // le bot choisit une attaque valide au hasard
      const attaqueBot = attaquesValides[Math.floor(Math.random() * attaquesValides.length)];
      faireAttaque(attaqueBot, nomBot, 'joueur');
    }
  }

  // RESULTAT FINAL
  console.log('\n' + '='.repeat(30));
  if (hpBot <= 0) {
    console.log('Tu as gagne ! ' + nomJoueur + ' a battu ' + nomBot + ' !');
  } else {
    console.log('Tu as perdu ! ' + nomBot + ' etait trop fort !');
  }
  console.log('='.repeat(30) + '\n');

  // ---- rejouer ? ----
  const reponse3 = await inquirer.prompt([
    {
      type    : 'confirm',  // question oui / non
      name    : 'rejouer',
      message : 'Rejouer ?',
      default : true
    }
  ]);

  if (reponse3.rejouer) {
    await jouer();  // on relance le jeu depuis le debut
  } else {
    console.log('\nA bientot !\n');
  }
}

// lancer le jeu
jouer();
