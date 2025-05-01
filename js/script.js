$("Document").ready(function () {

let Player = {
    health: 20,
    shield: 0,
    skips: 3,
    digsLeft: 0,
    AceEffect: false,
    Totalscore: 0,
    RoundScore: 0,
    busy: false,
    roundsPlayed: 0
}

let languages =  ["EN","ESP"]
let lang = 0

let traductor = [{
    id: "English",
    HP: "HP: ",
    Shield: "Shield: ",
    skips: "Paid Skips left: ",
    round: "Round: ",
    digsLeft: "Left to Dig: ",
    RoundScore: "Round Score: ",
    Totalscore: "Total Score: ",
    digdeck: "Dig Deck",
    digsite: "The Digsite",
    AllClear: "Congrats on clearing this whole digsite \nGet ready for the next one (+50 pts!)",
    HowToPlay: "I still won't code a tutorial sequence for this, uwa... D: \n Welcome to 'GoldMine' or whatever I end up calling this.\n The goal of the game is to draw all the cards from your 'Dig Deck' which is composed of A-10 of spades.\n you can click the deck or the 'Get Digging' button to draw a card from it after which you MUST 'excavate' cards from the board on the right (a.k.a: 'the digsite').\n The six cards on the top left AREN'T on the digsite you can use this as a way to measure how safe the current digsite is.\n The card you excavate will affect you according to its suit... \n Diamonds immediately get added to your score equal to their rank value. \n Clubs deal damage equal to their rank value. \n Spades (J, Q & K) add 1, 2 & 3 to you digging requirement, respecively. \n Hearts can either be used to score DOUBLE their rank value or as shields which will protect you from damage (you may only have one shield at a time). \n Whenever you draw the Ace of Spades from your Dig Deck you may excavate any amount of cards, but at least one. \n Lastly, the GFTO button skips the current digsite you can either pay 20 points or draw one card from the dig deck to use it, granted, you may only use the payment option up to 3 times. \n I'm still considering balance changes to the game so feel free to suggest them to me. D:"
},{
    id: "Español",
    HP: "PV: ",
    Shield: "Escudo: ",
    skips: "Salteos Pagos restantes: ",
    round: "Ronda: ",
    digsLeft: "Faltan Excavar: ",
    RoundScore: "Puntos de la Ronda: ",
    Totalscore: "Puntos Totales: ",
    digdeck: "Mazo de Exc.",
    digsite: "El Sitio de Excavacion",
    AllClear: "Felicitaciones en Limpiar este sitio \nPreparate para el siguiente (+50 pts!)",
    HowToPlay: "Todavia no voy a hacer una secuencia tutorial para esto... D: \n Bienvenido a 'GoldMine' o como sea que termine llamando a esto.\n La meta del juego es robar todas las cartas de tu 'Mazo de Excavacion' el cual esta compuesto de A-10 de picas.\n Podes apretar el mazo o el botton 'Get Digging' para robar una carta e inmediatamente despues TENES que 'excavar' cartas del tablero en la derecha (El Sitio de Excavacion).\n Las seis cartas de arriba a la derecha NO estan en el sitio de excavacion, podes usar esto como una forma de medir que tan seguro es el tablero actual.\n La carta excavada te afectara segun su palo... \n Diamantes se suman inmediatamente a tu puntuaje igual al valor de su rango. \n Treboles hacen daño igual al valor de su rango. \n J,Q y K de Picas suman 1,2 y 3 a tu requerimiento de excavacion, respectivamente. \n Corazones pueden ser usados para ganar puntos igual al DOBLE del valor de su rango o como escudos que te protegen de daño (solo podes tener un escudo a la vez). \n Cuando robes el As de Picas de tu Mazo de Escavacion podes excavar cualquier cantidad de cartas, pero minimo una. \n Finalmente, el boton 'GTFO' salta el sitio de excavacion actual, podes pagar 20 puntos o robar una carta de tu mazo de exc. para usarlo, eso si, solo podes usar la opcion paga hasta 3 veces. \n Todavia estoy considerando cambios de balance para el juego, sentite libre de sugerirmelos. D:"
}]

console.log(traductor[0].HP,traductor[1].HP)

var Board = [
    [[],[],[],[]],
    [[],[],[],[]],
    [[],[],[],[]]
    ]

let heDug = false

let deckTemplate = ['SJ','SQ','SK','DA','D2','D3','D4','D5','D6','D7','D8','D9','DT','DJ','DQ','DK','HA','H2','H3','H4','H5','H6','H7','H8','H9','HT','HJ','HQ','HK','CA','C2','C3','C4','C5','C6','C7','C8','C9','CT','CJ','CQ','CK']

const DigDeckTemplate = ['SA','S2','S3','S4','S5','S6','S7','S8','S9','ST']

var boardDeck = ['SJ','SQ','SK','DA','D2','D3','D4','D5','D6','D7','D8','D9','DT','DJ','DQ','DK','HA','H2','H3','H4','H5','H6','H7','H8','H9','HT','HJ','HQ','HK','CA','C2','C3','C4','C5','C6','C7','C8','C9','CT','CJ','CQ','CK']

var diggingDeck = ['SA','S2','S3','S4','S5','S6','S7','S8','S9','ST']

function GameOver(){
    Player.Totalscore += Player.RoundScore
    if(Player.health > 0){Player.Totalscore += 200}
    let GOMessage = [
        "You "+(Player.health > 0 ? "[MADE IT OUT ALIVE]":"[PAINFULLY DIED]")+" "+(Player.roundsPlayed <= 3?"[LUDICROUSLY FAST]":(Player.roundsPlayed <= 10 ? "[AT A VERY HUMAN PACE]":"[AGONIZINGLY SLOW]"))+"\nwhile "+(Player.Totalscore <0 ? "[SOMEHOW COSTING US "+Player.Totalscore+" 'POINTS']" : (Player.Totalscore <= 200 ? "[SCORING "+Player.Totalscore+" 'POINTS']":"[GIVING US "+Player.Totalscore+" TONS OF GOLD]"))+"\n\n (the site will reload after pressing ok)",
        "Vos "+(Player.health > 0 ? "[SOBREVIVISTE]":"[DOLOROSAMENTE MORISTE]")+" "+(Player.roundsPlayed <= 3?"[RIDICULAMENTE RAPIDO]":(Player.roundsPlayed <= 10 ? "[A UN PASO MUY HUMANO]":"[AGONIZANTEMENTE LENTO]"))+"\nmientras "+(Player.Totalscore <0 ? "[DE ALGUNA MANERA COSTANDONOS "+Player.Totalscore+" 'PUNTOS']" : (Player.Totalscore <= 200 ? "[CONSIGUIENDO "+Player.Totalscore+" 'PUNTOS']":"[DANDONOS "+Player.Totalscore+" TONELADAS DE ORO]"))+"\n\n (el sitio se recargara despues de apretar ok)"
    ]
    alert(GOMessage[lang])
    location.reload()
}

function RepartirCartas(){
    let output
    for(y=0;y<3;y++){
        for(x=0;x<4;x++){
            output = []
            for(i=0;i<3;i++){
                let chosenCard = Math.floor(Math.random()*boardDeck.length)
                output[i] = boardDeck[chosenCard]
                boardDeck.splice(chosenCard,1)
                $((("#grid"+y)+x)+".stack-"+i).removeClass("stack-"+i).addClass("stack-3")
            }
            Board[y][x] = output
        }
    }
    for(i=0;i<boardDeck.length;i++){
        $("#SixShown").html($("#SixShown").html()+"<img class='smol' src='img/"+boardDeck[i][0]+"/"+boardDeck[i]+".png' alt=''>")
    }
}

function LetterToNum(L){
    switch(L){
        case "A": return 11;
        case "T":
        case "J":
        case "Q":
        case "K": return 10;
        default: return parseInt(L);
    }
}

function allEmpty(){
    let output = true
    $(".digsite").each(function(){
        for(i=1;i<4;i++){
            if($(this).hasClass("stack-"+i)){
                output = false
            }
        }
    })
    return output
}

function DiscardFromDigsite(id){
    let suit = (Board[id[0]][id[1]])[0][0]
    let rank = (Board[id[0]][id[1]])[0][1]
    Board[id[0]][id[1]].shift()
    switch(suit){
        case "S": if(!Player.AceEffect){switch(rank){case "J": Player.digsLeft += 1; break; case "Q": Player.digsLeft += 2; break; case "K": Player.digsLeft += 3; break;}}; $("#HazardDiscard").html($("#HazardDiscard").html()+"<img class='smol' src='img/"+suit+"/"+suit+rank+".png' alt=''>"); refreshDigs(); break;
        case "D": $("#ScoreDiscard").html($("#ScoreDiscard").html()+"<img class='smol' src='img/"+suit+"/"+suit+rank+".png' alt=''>"); Player.RoundScore += LetterToNum(rank); refreshScore(); break;
        case "C": $("#HazardDiscard").html($("#HazardDiscard").html()+"<img class='smol' src='img/"+suit+"/"+suit+rank+".png' alt=''>"); if(Player.shield > 0){LetterToNum(rank) > Player.shield? Player.shield = 0: Player.shield -= LetterToNum(rank)}else{Player.health -= LetterToNum(rank)};refreshHP();break;
        case "H": $("#choiceSlot").html("<img id='"+suit+rank+"' src='img/"+suit+"/"+suit+rank+".png' alt=''>"); Player.busy = true; $("#buttonScore").attr("src","img/choiceButtons/plusScore.png");if(Player.shield == 0){$("#buttonShield").attr("src","img/choiceButtons/plusShield.png")}; break;
    }
}

function refreshScore(){
    $("#totalScore").text(Player.Totalscore)
    $("#roundScore").text(Player.RoundScore)
}
function refreshDigs(){
    $('#digRemaining').html(Player.digsLeft)
}
function refreshHP(){
    $('#HealthPoints').html((traductor[lang].HP + Player.health)+"<br>"+(traductor[lang].Shield+Player.shield))
    if(Player.health <= 0){
        GameOver()

    }
}
function refreshSkips(){
    $('#dialog_box>p').html((traductor[lang].skips + Player.skips)+"<br>"+(traductor[lang].round+Player.roundsPlayed))
}

function changeLang(str){
    lang = languages.indexOf(str)
    $("#DigDeck").html('<div style="text-align: center;transform: translate(0px,10px);">'+traductor[lang].digdeck+' ('+diggingDeck.length+')</div>')
    $("#totalScoretext").html(traductor[lang].Totalscore+"<p id='totalScore' style='word-wrap: break-word; width: 128px; height: 40px;'>0</p>")
    $("#roundScoretext").html(traductor[lang].RoundScore+"<p id='roundScore' style='word-wrap: break-word; width: 128px; height: 40px;'>0</p>")
    $("#digRemainingtext").html(traductor[lang].digsLeft+"<p id='digRemaining' style='word-wrap: break-word; width: 128px; height: 40px;'>0</p>")
    $("#boardname").html(traductor[lang].digsite)
    refreshDigs
    refreshScore
    refreshHP()
    refreshSkips()
}

function newRound(){
    Player.roundsPlayed++
    $("#buttonScore").attr("src","img/choiceButtons/NplusScore.png")
    $("#buttonShield").attr("src","img/choiceButtons/NplusShield.png")
    heDug = false
    refreshSkips()
    if(!(allEmpty())){
        Player.AceEffect = false
        Player.digsLeft = 0
    }
    refreshDigs()
    Player.Totalscore += Player.RoundScore
    Player.RoundScore = 0
    $("#buttonSkip").attr("src","img/choiceButtons/plusSkip.png")
    if(Player.skips == 0){
        $("#buttonSkip").attr("src","img/choiceButtons/NplusSkip.png")
    }
    boardDeck = deckTemplate.slice()
    $("#SixShown").text(" ")
    $("#ScoreDiscard").html(" ")
    $("#HazardDiscard").html(" ")
    RepartirCartas()
    refreshScore()
    Player.shield = 0
    refreshHP()
}

newRound()

function LetsDig(){
    if(allEmpty()){
        alert(traductor[lang].AllClear)
        Player.Totalscore += 50
        newRound()
    }
    if(Player.AceEffect){
        Player.AceEffect = false
        Player.digsLeft = 0
        refreshDigs()
    }
    if(Player.digsLeft == 0){
        if(diggingDeck.length == 0){
            GameOver()
            return;
        }
        $("#buttonSkip").attr("src","img/choiceButtons/NplusFreeSkip.png")
        $("#buttonDig").attr("src","img/choiceButtons/NplusDig.png")

        let chosenDig = Math.floor(Math.random()*diggingDeck.length)
        $("#DigDiscards").html($("#DigDiscards").html()+"<img class='smol' src='img/S/"+diggingDeck[chosenDig]+".png' alt=''>")
        Player.digsLeft = diggingDeck[chosenDig][1] == "A"?"A":LetterToNum(diggingDeck[chosenDig][1])
        Player.AceEffect = (Player.digsLeft == "A")
        diggingDeck.splice(chosenDig,1)
        refreshDigs()
        $("#DigDeck").html('<div style="text-align: center;transform: translate(0px,10px);">'+traductor[lang].digdeck+' ('+diggingDeck.length+')</div>')
    }
}

$("#buttonSkip").on("click",function(){
    if(allEmpty()){
        alert(traductor[lang].AllClear)
        Player.Totalscore += 50
        newRound()
    }
    if(((Player.digsLeft == 0)||(Player.AceEffect))&&(!Player.busy)&&((Player.skips > 0) || heDug)){
        if($(this).attr("src") == "img/choiceButtons/plusSkip.png"){
            Player.Totalscore -=20
            Player.skips--
        }
        newRound()
    }
})

$("#buttonScore").on("click",function(){
    if(Player.busy){
        let CardInSlot = $("#choiceSlot>img").attr("id")
        let suit = CardInSlot[0]
        let rank = CardInSlot[1]
        $("#ScoreDiscard").html($("#ScoreDiscard").html()+"<img class='smol' src='img/"+suit+"/"+suit+rank+".png' alt=''>"); 
        Player.RoundScore += (LetterToNum(rank) * 2);
        refreshScore();
        $("#choiceSlot").html(" ")
        Player.busy = false
        $("#buttonScore").attr("src","img/choiceButtons/NplusScore.png")
        $("#buttonShield").attr("src","img/choiceButtons/NplusShield.png")
        if((Player.digsLeft == 0 || Player.AceEffect)&&!Player.busy){
            heDug = true
            $("#buttonDig").attr("src","img/choiceButtons/plusDig.png")
            $("#buttonSkip").attr("src","img/choiceButtons/plusFreeSkip.png")
        }
        if(allEmpty()){
            $("#buttonSkip").attr("src","img/choiceButtons/plusFreeSkip.png")
        }
        refreshDigs()
    }
})

$("#buttonShield").on("click",function(){
    if((Player.busy)&&(Player.shield == 0)){
        let CardInSlot = $("#choiceSlot>img").attr("id")
        let suit = CardInSlot[0]
        let rank = CardInSlot[1]
        $("#HazardDiscard").html($("#HazardDiscard").html()+"<img class='smol' src='img/"+suit+"/"+suit+rank+".png' alt=''>");
        Player.shield += LetterToNum(rank)
        refreshHP();
        $("#choiceSlot").html(" ")
        Player.busy = false
        $("#buttonScore").attr("src","img/choiceButtons/NplusScore.png")
        $("#buttonShield").attr("src","img/choiceButtons/NplusShield.png")
        if((Player.digsLeft == 0 || Player.AceEffect)&&!Player.busy){
            heDug = true
            $("#buttonDig").attr("src","img/choiceButtons/plusDig.png")
            $("#buttonSkip").attr("src","img/choiceButtons/plusFreeSkip.png")
        }
        if(allEmpty()){
            $("#buttonSkip").attr("src","img/choiceButtons/plusFreeSkip.png")
        }
        refreshDigs()
    }
})

$("#DigDeck").on("click",LetsDig)
$("#buttonDig").on("click",LetsDig)

$("#choiceLanguages").change(function(){
    console.log($(this).val())
    changeLang($(this).val())
})

$(".clickable.digsite").on("click",function(){
    if((Player.digsLeft > 0 || Player.AceEffect)&&!Player.busy) {
        if($(this).hasClass("stack-3")||$(this).hasClass("stack-2")||$(this).hasClass("stack-1")){
            for(i=3;i>0;i--){
                if($(this).hasClass("stack-"+i) && !($(this).hasClass("sillygoose"))){
                    $(this).removeClass("stack-"+i)
                    $(this).addClass("stack-"+(i-1))
                    $(this).addClass("sillygoose")
                }
            }
            $(".sillygoose").removeClass("sillygoose")
            let coords = ($(this).attr('id')).slice(4)
            DiscardFromDigsite(coords)

            if(!Player.AceEffect){
                Player.digsLeft--
            }
            if((Player.digsLeft == 0 || Player.AceEffect)&&!Player.busy){
                heDug = true
                $("#buttonDig").attr("src","img/choiceButtons/plusDig.png")
                $("#buttonSkip").attr("src","img/choiceButtons/plusFreeSkip.png")
            }
            if(allEmpty()){
                $("#buttonSkip").attr("src","img/choiceButtons/plusFreeSkip.png")
            }
            refreshDigs()
        }
    }
})

$("#Help").on("click",function(){
    alert(traductor[lang].HowToPlay)
})

})