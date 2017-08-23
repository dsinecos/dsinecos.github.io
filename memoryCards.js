console.log("Testing memoryCards");

var cardGameArray = [];

var vueInstance = new Vue({
    el: "#memoryCards",
    data: {
        numOfClicks: 0,
        numOfCardsBeginning: 0,
        numOfCardsCurrent: 0,
        lastClickedCardID: 0,
        cardGameArray: []
    },
    methods: {
        resetGame: function () {
            console.log("Reset game requested");
            this.cardGameArray = newGame(this.numOfCardsBeginning);
            this.numOfCardsCurrent = this.numOfCardsBeginning;

            //console.log("numOfCardsCurrent " + this.numOfCardsCurrent);
            //console.log("numOfCardsBeginning " + this.numOfCardsBeginning);
        },
        cardClicked: function (cardID) {
            console.log("lastClickedCardID :" + this.lastClickedCardID);
            console.log("currentCardID :" + cardID);
            this.numOfClicks++;
            var self = this;

            if (this.lastClickedCardID === cardID) {
                cardsMatch();
            } else {
                cardsDiffer();
            }

            function cardsMatch() {
                console.log("Cards Match, Yayyyyy");
                updateScore();                
            }

            function cardsDiffer() {
                console.log("Not a match, try again");
            }

            function updateScore() {
                self.numOfCardsCurrent--;
                if(self.numOfCardsCurrent === 0) {
                    alert("Game complete");
                    self.resetGame();
                }


            }

            this.lastClickedCardID = cardID;
        }
        /*
        cardClicked: function(cardID) {
            this.numOfClicks++;

            console.log("The ID of the card clicked is " + cardID);
            console.log("CardID : " + cardID);
            console.log("lastClickedCardID :" + this.lastClickedCardID);

            if(Number(cardID) === Number(this.lastClickedCardID)) {
                console.log("Inside if");
                cardsMatch();
            } else {
                console.log("Inside if else");
                cardsDiffer();
            }

            function cardsMatch() {
                //console.log("Inside cardsMatch");
                updateScore();
                this.lastClickedCardID = 0;
            }

            function cardsDiffer() {
                this.lastClickedCardID = cardID;
                console.log("Inside cards differ");
                console.log("Value of lastclickedCardID :" + this.lastClickedCardID);
            }

            function updateScore() {
                console.log("Inside updateScore");
                this.numOfCardsCurrent--;
                console.log("value of numOfCardsCurrent :" + this.numOfCardsCurrent);
                if(this.numOfCardsCurrent === 0) {
                    alert("Game complete");
                }
            }
        }
        */
    }
});

function newGame(numOfCardsBeginning) {
    //console.log("Cards beginning " + numOfCardsBeginning);
    cardGameArray = cardMasterArray.slice(0, Number(numOfCardsBeginning));
    //console.log("Length of card game array after slice" + cardGameArray.length);
    cardGameArray = cardGameArray.concat(cardGameArray);
    //console.log("Length of card game array" + cardGameArray.length);

    var shuffledCardGameArray = shuffleArray(cardGameArray);
    cardGameArray = shuffledCardGameArray;
    return cardGameArray;
    //console.log(shuffledCardGameArray.length);
    //console.log(JSON.stringify(shuffledCardGameArray, null, "  "));
}

function shuffleArray(inputArrayForShuffling) {
    var currentIndex = inputArrayForShuffling.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = inputArrayForShuffling[currentIndex];
        inputArrayForShuffling[currentIndex] = inputArrayForShuffling[randomIndex];
        inputArrayForShuffling[randomIndex] = temporaryValue;
    }

    return inputArrayForShuffling;
}

var cardMasterArray = [
    {
        id: 1,
        color: "salmon",
        image: ""
    },
    {
        id: 2,
        color: "seagreen",
        image: ""
    },
    {
        id: 3,
        color: "sienna",
        image: ""
    },
    {
        id: 4,
        color: "brown",
        image: ""
    },
    {
        id: 5,
        color: "tan",
        image: ""
    },
    {
        id: 6,
        color: "red",
        image: ""
    },
    {
        id: 7,
        color: "yellow",
        image: ""
    },
    {
        id: 8,
        color: "purple",
        image: ""
    },
    {
        id: 9,
        color: "lawngreen",
        image: ""
    },
    {
        id: 10,
        color: "crimson",
        image: ""
    },
    {
        id: 11,
        color: "",
        image: ""
    },
    {
        id: 12,
        color: "",
        image: ""
    },
    {
        id: 13,
        color: "",
        image: ""
    },
    {
        id: 14,
        color: "",
        image: ""
    },
    {
        id: 15,
        color: "",
        image: ""
    }
];