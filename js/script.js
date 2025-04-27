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
    alert("You "+(Player.health > 0 ? "[MADE IT OUT ALIVE]":"[PAINFULLY DIED]")+" "+(Player.roundsPlayed <= 3?"[LUDICROUSLY FAST]":(Player.roundsPlayed <= 10 ? "[AT A VERY HUMAN PACE]":"[AGONIZINGLY SLOW]"))+" while "+(Player.Totalscore <0 ? "[SOMEHOW COSTING US "+Player.Totalscore+" 'POINTS']" : (Player.Totalscore <= 200 ? "[SCORING "+Player.Totalscore+" 'POINTS']":"[GIVING US "+Player.Totalscore+" TONS OF GOLD]")))
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
    $('#HealthPoints').html("HP: "+Player.health+"<br>Shield: "+Player.shield)
    if(Player.health <= 0){
        GameOver()

    }
}
function refreshSkips(){
    $('#dialog_box>p').html("'Digging-Free' Skips left: "+Player.skips+"<br>Round: "+Player.roundsPlayed)
}

function newRound(){
    Player.roundsPlayed++
    $("#buttonScore").attr("src","img/choiceButtons/NplusScore.png")
    $("#buttonShield").attr("src","img/choiceButtons/NplusShield.png")
    heDug = false
    refreshSkips()
    Player.AceEffect = false
    Player.digsLeft = 0
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
        $("#DigDeck").html('<div style="text-align: center;transform: translate(0px,10px);">Dig Deck ('+diggingDeck.length+')</div>')
    }
}

$("#buttonSkip").on("click",function(){
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
        refreshDigs()
    }
})

$("#DigDeck").on("click",LetsDig)
$("#buttonDig").on("click",LetsDig)

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
            refreshDigs()
        }
    }
})

$("#Help").on("click",function(){
    alert("I still won't code a tutorial sequence for this, uwa... D: \n Welcome to 'GoldMine' or whatever I end up calling this.\nThe goal of the game is to draw all the cards from your 'Dig Deck' which is composed of A-10 of spades.\n you can click the deck or the 'Get Digging' button to draw a card from it after which you MUST 'excavate' cards from the board on the right (a.k.a: 'the digsite').\n The six cards on the top left AREN'T on the digsite you can use this as a way to measure how safe the current digsite is.\n The card you excavate will affect you according to its suit... \n Diamonds immediately get added to your score equal to their rank value. \n Clubs deal damage equal to their rank value. \n Spades (J, Q & K) add 1, 2 & 3 to you digging requirement, respecively. \n Hearts can either be used to score DOUBLE their rank value or as shields which will protect you from damage (you may only have one shield at a time). \n Whenever you draw the Ace of Spades from your Dig Deck you may excavate any amount of cards, but at least one. \n Lastly, the GFTO button skips the current digsite you can either pay 20 points or draw one card from the dig deck to use it, granted, you may only use the payment option up to 3 times. \n I'm still considering balance changes to the game so feel free to suggest them to me. D:")
})

})