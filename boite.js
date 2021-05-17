var univers;
var debug;
var cptSelect = 0;
function init(){
    debug = confirm("Activer le mode débug");
    creerUnivers();
    atomeAlea();
    tableau()
    bouton()
}

function tableau(){
    let jeu = document.getElementById('jeu')
    let titre = document.createElement('h1');
    titre.textContent = "TP Secret"
    titre.style.textAlign = "center"
    titre.style.fontFamily = 'arial'
    jeu.appendChild(titre)
    let tab = document.createElement('table');
    for(i = 0; i<10 ; i++){
        let lig = document.createElement('tr')
        for(j = 0; j<10 ; j++){
            let col = document.createElement('td')
            col.style.border = '1px solid'
            col.style.height='30px'
            col.style.width = '30px'
            univers[i][j].dom = col
            univers[i][j].initialiser()
            lig.appendChild(col)
        }
        tab.appendChild(lig)
    }
    jeu.appendChild(tab)
    document.getElementById('validate').disabled = true
    document.getElementById('validate').style.margin = '20px'
    let art = document.createElement('article');
    let titreRegle = document.createElement('h3');
    titreRegle.textContent = "Regles du jeu :"
    let regle = document.createElement('p');
    regle.textContent = "Cinq boules(atomes) sont placées secrètement sur ce damier. "+
    "On ne voit pas ces boules sur le plateau, le but est de découvrir où se situent ces boules en le moins de coups possible."+
    "Un coup consiste à envoyer un rayon X imaginaire à partir d’une des 32 cases d’entrée et de voir par où il sortira."+
    "S’il touche une boule, il ne sort pas du damier.S’il frôle une boule par un des coins, il sera dévié à angle droit."+
    "S’il ne touche ou ne frôle rien, il ressort tout simplement par l’autre côté. Le joueur place alors des pions "+
    "sur grilles aux endroits supposés des atomes et valide son choix. Vous pouvez voir votre score une fois que "+
    "vous avez deviné la position des 5 atomes en cliquant sur les cases au centre du plateau."+
    "Chaque entré et sortie d'un rayon coute 1 point et un atome mal positionné en coute 5."
    art.appendChild(titreRegle)
    art.appendChild(regle)
    art.style.backgroundColor = 'darkgrey'
    art.style.borderRadius = '5%'
    art.style.borderStyle = "solid"
    art.style.width = '600px'
    art.style.paddingRight = '20px'
    art.style.paddingLeft = '20px'
    window.document.body.appendChild(art)
}

function cellule(li, co) {
    this.select = false;
    this.li = li;
    this.co = co;
    this.etat =  -1;
    this.atome = false;
    this.dom = null;
    this.grille = (li > 0) && (li < 9) && (co > 0) && (co <9)

    this.initialiser=function() {
        var couleur = ""
        if ((this.li === 0 && this.co === 0) || 
        (this.li === 0 && this.co === 9) || (this.li === 9 && this.co === 0) ||
         (this.li === 0 && this.co === 0) || (this.li === 9 && this.co === 9)) { // les 4 coins
            couleur = 'grey';
        } else if (this.li === 0 || this.co === 0 || this.li === 9 || this.co === 9) { // les boutons latéraux ou les pions joué
            couleur = 'darkgrey';          
            this.dom.addEventListener('click',this.changCouleur)
        }else{
            couleur = "white";
            this.dom.addEventListener('click',this.rond)
        }
        if(this.atome && debug){
            couleur = 'grey';
        }
        this.dom.style.backgroundColor = couleur;
    };

    this.rond = () => {
        if(!this.select){
            let rond = document.createElement('div');
            rond.style.backgroundColor='blue'
            rond.style.height = this.dom.style.height
            rond.style.width = this.dom.style.width
            rond.style.borderRadius = '100%'
            this.dom.appendChild(rond)
            this.select = !this.select
            ++cptSelect
        } else {
            this.dom.removeChild(this.dom.childNodes[0])
            this.select = !this.select
            --cptSelect;
        }
        let boutScore = document.getElementById('validate')
        if(cptSelect == 5){
            boutScore.disabled=false;
        } else {
            boutScore.disabled=true;
        }
    }

    this.changCouleur = () =>{
        if(!this.select){
            this.dom.style.backgroundColor = "rgb("+getRandomInt(255)+","+getRandomInt(255)+","+getRandomInt(255)+")"
            this.select = !this.select
            let cel
            if(this.co === 0){
                cel = resultatDuTir(this, 0,1)
            }  
            else if(this.co === 9)
                cel = resultatDuTir(this, 0,-1)
            else if (this.li === 0)
                cel = resultatDuTir(this,1, 0)
            else if(this.li === 9)
                cel = resultatDuTir(this,-1,0)   
            
            
            if(cel != null) {
                cel.dom.style.backgroundColor =this.dom.style.backgroundColor
                cel.select = true;
            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function creerUnivers() {
      var li, co, ligne;
      univers = [];
      for (li = 0; li < 10; li += 1) {
          ligne = [];
          for (co = 0; co < 10; co += 1) {
              ligne.push(new cellule(li, co));
            }
            univers.push(ligne);
        }
}

function atomeAlea()
{
    let nb=0;
    while(nb<5){
        let x=getRandomInt(8)+1
        let y = getRandomInt(8)+1
        univers[x][y].atome= true
        nb++
    }
}

function resultatDuTir(cellule, vl, vc) {
    var s = univers[cellule.li + vl][cellule.co + vc];
    if(debug && !s.atome) s.dom.style.backgroundColor = 'red'
    if (! s.grille) {
        return s;// Arrivé au bord de la grille
    }
    if (s.atome) {
        return null;// Absorption
    }
    if (vc === 0) {
        if (univers[s.li][s.co -1].atome) {

            if (!cellule.grille){
                return cellule;
            }
            return resultatDuTir(cellule, 0, 1);
        }
        if (univers[s.li][s.co + 1].atome) {
            if (!cellule.grille) {
                return cellule;
            }
            return resultatDuTir(cellule, 0, -1);
        }
    } else if (vl === 0){ 
        if (univers[s.li-1][s.co].atome) {
            if (!cellule.grille){
                return cellule;
            }
            return resultatDuTir(cellule, 1, 0);
        }
        if (univers[s.li+1][s.co].atome) {
            if (!cellule.grille) {
                return cellule;
            }
            return resultatDuTir(cellule, -1, 0);
        }
    }
    return resultatDuTir(s, vl, vc);
}

function calculScore(){
    let score = 0
    for(i = 0; i<10 ; i++){
        for(j = 0; j<10 ; j++){
            if ((i== 0 || j == 0 || i == 9 || j == 9) && univers[i][j].select) { 
                --score;
            } else if (univers[i][j].select && !univers[i][j].atome){
                score = score - 5
            }
        }
    }
    return score
}


function bouton(){
    let bouton = document.getElementById('validate')
    bouton.addEventListener('click',afficherScore)  
}
function afficherScore ()  {
    alert(calculScore())
}

