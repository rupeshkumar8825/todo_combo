console.log("hi this is the timer page for using the timer for this purpose");

const reset = document.getElementsByClassName("reset");

let counter = 0; 
let timer = 0;

const start = document.getElementById("start");
const stoporresume = document.getElementById("stoporresume");


// defining the function to get the format for the hours minutes and seconds 
function getformat(current) {
    console.log("right now i am in the function getformat");
    if (current < 10) {
        current = String(current);
        current = '0' + current;
    }
    else {
        current = String(current);
    }

    // say everything went fine 
    return current;
}


 

function setResetInterval(bool) {
    
    if (bool) {
        const h1 = document.querySelector(".container h1");
        timer = setInterval(() => {
            
            counter--;
            if (counter == 0) {
                console.log("the timer reaches 0 ");
                h1.innerText = "00:00:00";
                clearInterval(timer);
            }
            else {
                // applying the if else statement 
                // fetching the current timer values from the DOM 
                let time = String(h1.innerText);
                console.log("the time inside the setinterval function ");
                console.log(time);

                let currenthour = Math.floor(counter / 3600);
                let currentminute = Math.floor((counter % 3600) / 60);
                let currentsecond = Math.floor((counter % 3600) % 60);

                
                // bringing them to the proper string format 
                // calling the function for this purpose 
                let hour_string = getformat(currenthour);
                let minute_string = getformat(currentminute);
                let second_string = getformat(currentsecond);

                let newtime = hour_string + ":" + minute_string + ":" + second_string;
                h1.innerText = newtime;

                
            }
        }, 1000);
        
    }
    else {
        clearInterval(timer);
    }
}




// defining the function getUserValue 
function timerfunction() {
    console.log("right now i am on the getuservalue function ");
    const settimer = document.getElementById("settimer");
    console.log(settimer);
    const time = String(settimer.value);

    console.log("the content of the user enetered in the input section is as follows ");
    console.log(time);


    // setting the display none for the input section and the button
    settimer.remove();
    const newbtn = document.getElementById("enter");
    newbtn.remove();


    let hours = String(time.substr(0, 2));
    console.log("the hours is as follows ", hours);
    let minutes = String(time.substr(3, 2));
    console.log("the minutes is as follows ", minutes);
    let seconds = String(time.substr(6, 2));
    console.log("the seconds is as follows ", seconds);
    

    const h1 = document.querySelector(".container h1");
    h1.innerText = hours + ":" + minutes + ":" + seconds;



    // calculating the total number of seconds for this purpose 
    let totalseconds = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    // console.log("the total number seconds for this timer is as follows ");
    console.log(totalseconds);
    counter = totalseconds;

    setResetInterval(true);
        

}





// adding the event listener for the stop part 
stoporresume.addEventListener("click", () => {
    console.log("the user has clicked the ")
    
    if (stoporresume.className == "stop") {
        // this means that we have to stop the set interval 
        stoporresume.className = "resume";
        stoporresume.innerText = "Resume";
        stop = 1;
        if (counter != 0) {
        setResetInterval(false);
            
        }
        resume = 0;
    }
    else {
        resume = 1;
        stop = 0;
        if (counter != 0) {
            
        setResetInterval(true);
        }
        stoporresume.innerText = "Stop";
        stoporresume.className = "stop";
    }
});





start.addEventListener("click", () => {
    counter = 0;
    setResetInterval(false);
    console.log("the user wants to start the timer for the better purpose ");


    const container = document.querySelector(".container");
    console.log(container);
    const newinput = document.createElement("input");
    newinput.className = "settimer";
    newinput.id = "settimer";
    newinput.setAttribute("placeholder", "Enter the timer value in hh/mm/ss format");


    

    const newbtn = document.createElement("button");
    newbtn.className = "enter";
    newbtn.id = "enter";
    newbtn.innerText = "Done";
    newbtn.setAttribute("onclick", `timerfunction()`);
    // newinput.appendChild(newbtn);
    container.appendChild(newinput);
    container.appendChild(newbtn);

    console.log("the input section has been inserted ");


});



