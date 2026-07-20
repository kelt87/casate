// ===============================
// COPPA DELLE CASATE - SCRIPT
// ===============================


const houses = {

    gryffindor:{
        name:"Grifondoro",
        points:0
    },

    slytherin:{
        name:"Serpeverde",
        points:0
    },

    ravenclaw:{
        name:"Corvonero",
        points:0
    },

    hufflepuff:{
        name:"Tassorosso",
        points:0
    }

};



let history = [];



// Caricamento dati salvati

function loadData(){

    const saved =
    localStorage.getItem("hogwartsCup");


    if(saved){

        const data =
        JSON.parse(saved);

        Object.assign(houses,data.houses);

        history =
        data.history || [];

    }

}



function saveData(){

    localStorage.setItem(

        "hogwartsCup",

        JSON.stringify({

            houses,

            history

        })

    );

}



// Aggiornamento grafico

function updateDisplay(){


    for(let id in houses){


        const score =
        document.getElementById(
            "score-"+id
        );


        score.textContent =
        houses[id].points;



        const gems =
        document.getElementById(
            "gems-"+id
        );



        // massimo livello 100%

        let level =
        Math.min(
            houses[id].points / 2,
            100
        );


        gems.style.height =
        level+"%";

    }



    updateHistory();

    saveData();

}




// Aggiunta / rimozione punti


function changePoints(house,value){


    houses[house].points += value;


    if(houses[house].points < 0){

        houses[house].points = 0;

    }



    let text;


    if(value>0){

        text =
        `⭐ ${houses[house].name} +${value} punti`;

    }

    else{

        text =
        `➖ ${houses[house].name} ${value} punti`;

    }



    history.unshift({

        text,

        date:
        new Date()
        .toLocaleString()

    });



    updateDisplay();


}




// Pulsanti punti

document
.querySelectorAll(
".controls button"
)
.forEach(btn=>{


    btn.addEventListener(
    "click",
    ()=>{


        let house =
        btn.dataset.house;


        let value =
        Number(
        btn.dataset.value
        );


        changePoints(
            house,
            value
        );


    });


});





// ===============================
// STEMMI PERSONALIZZATI
// ===============================


document
.querySelectorAll(".upload")
.forEach(input=>{


input.addEventListener(
"change",
function(){


    const house =
    this.dataset.house;


    const file =
    this.files[0];


    if(!file)
    return;



    const reader =
    new FileReader();



    reader.onload =
    function(e){


        document
        .getElementById(
        "crest-"+house
        )
        .src =
        e.target.result;



        localStorage.setItem(
        "crest-"+house,
        e.target.result
        );


    }



    reader.readAsDataURL(file);



});


});




// Recupero stemmi salvati

function loadCrests(){


for(let id in houses){


const img =
localStorage.getItem(
"crest-"+id
);


if(img){

document
.getElementById(
"crest-"+id
)
.src =
img;

}


}


}





// ===============================
// CRONOLOGIA
// ===============================


function updateHistory(){


const list =
document.getElementById(
"historyList"
);


list.innerHTML="";



history
.slice(0,20)
.forEach(item=>{


let li =
document.createElement(
"li"
);


li.textContent =
item.text+
" - "+
item.date;


list.appendChild(li);



});


}






// ===============================
// MODALITA PRESENTAZIONE
// ===============================


const presentationBtn =
document.getElementById(
"presentationBtn"
);



presentationBtn.onclick =
()=>{


document.body
.classList.toggle(
"presentation"
);


};






// ===============================
// AVVIO
// ===============================


loadData();

loadCrests();

updateDisplay();

// ===============================
// SISTEMA ADMIN
// ===============================


let adminUnlocked = false;


// PIN modificabile

const ADMIN_PIN="7777";


const adminPanel =
document.getElementById(
"adminPanel"
);



document
.getElementById("adminBtn")
.onclick =
()=>{


adminPanel
.classList
.toggle("hidden");


};





document
.getElementById("unlockBtn")
.onclick =
()=>{


const pin =
document
.getElementById("pinInput")
.value;



if(pin===ADMIN_PIN){


adminUnlocked=true;


document.body
.classList
.remove("locked");


alert(
"🏰 Accesso amministratore attivato"
);


}
else{


alert(
"❌ PIN errato"
);


}


};





document
.getElementById("lockBtn")
.onclick =
()=>{


adminUnlocked=false;


document.body
.classList
.add("locked");


adminPanel
.classList
.add("hidden");


};





// ===============================
// RESET COPPA
// ===============================


document
.getElementById("resetBtn")
.onclick =
()=>{


if(
confirm(
"Azzerare tutti i punti?"
)
){


for(let id in houses){

houses[id].points=0;

}


history=[];

updateDisplay();


}


};






// ===============================
// CLASSIFICA VINCITORE
// ===============================


function updateWinner(){


let winner =
null;


let max=-1;



for(let id in houses){


if(
houses[id].points > max
){

max =
houses[id].points;

winner=id;

}


}



document
.querySelectorAll(".house")
.forEach(
h=>h.classList.remove(
"winner"
)
);



if(winner){


document
.querySelector(
"."+winner
)
.classList
.add(
"winner"
);


}



}



// modifica updateDisplay precedente

const oldUpdate =
updateDisplay;


updateDisplay=function(){


oldUpdate();

updateWinner();


};

// ===============================
// SCHERMO INTERO PRESENTAZIONE
// ===============================


document.addEventListener(
"keydown",
e=>{


if(e.key==="F11"){


e.preventDefault();


if(!document.fullscreenElement){


document.documentElement
.requestFullscreen();


}
else{


document
.exitFullscreen();


}


}



});