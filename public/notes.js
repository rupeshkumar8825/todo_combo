console.log("this is the notes javascript for the notes page of our website ");

const contentofnotes = document.querySelectorAll('.contentofnote');
console.log(contentofnotes);
console.log(contentofnotes.length);

let contentofnotesarr = new Array;

for (let i = 0; i < contentofnotes.length; i++) {
    contentofnotesarr.push((contentofnotes[i].innerText).trim());
}

console.log("the notes that were already present are as follows ");
console.log(contentofnotesarr);



let newnotes = new Array;
let newnotes_index = 0;

let newtitle = new Array;
let newtitle_index = 0;

// now we have the handle the case for the adding the notes without refreshing the page 
async function addnote() {
    console.log("adding the note in the function after the request from the user ");
    const tasktitle = document.getElementById('tasktitle');
    const title = tasktitle.value;
    console.log("the title of the new note is ");
    console.log(title);


    const content = document.getElementById("content");
    const original_newnotecontent = content.value;
    console.log("the note of the user is as follows");
    console.log(original_newnotecontent);
    let = newnotecontent = String(original_newnotecontent).trim();
    newnotecontent    = newnotecontent.replace(/\n/g, " ");
    newnotecontent = newnotecontent.substr(0, 150);
    // adding the note to the array 
    newnotes.push(newnotecontent);
    newtitle.push(String(title).trim());
    newnotes_index++;
    newtitle_index++;
    
    // now we have to create the new DOM element for this new note to  be added
    // without refreshing the page for the better experience of the user 
    const mynotediv = document.createElement('div');
    mynotediv.className = "temp_mynotes";

    const newh2 = document.createElement('h2');
    newh2.innerHTML = `Note ${contentofnotesarr.length+ newnotes_index}`;

    const titlediv = document.createElement('div');
    titlediv.className = "temp_title";

    const titleofnoteh2 = document.createElement('h2');
    titleofnoteh2.className = "temp_titleofnote";
    titleofnoteh2.innerHTML = title.trim();

    const newaddbtn = document.createElement('button');
    newaddbtn.className = "temp_addbtn";
    newaddbtn.id = newtitle_index - 1;
    newaddbtn.setAttribute('onclick', `opennote(${newtitle_index-1}, ${1})`)
    newaddbtn.innerHTML = "Show Note";
    newaddbtn.type = "submit";
    
    const contentdiv = document.createElement('div');
    contentdiv.className = 'notecontent';

    const contentofnoteh1 = document.createElement('h1');
    contentofnoteh1.className = "contentofnote";
    contentofnoteh1.innerHTML = newnotecontent.trim();

    const newdeletebtn = document.createElement('button');
    newdeletebtn.className = "temp_deletebtn";
    newdeletebtn.setAttribute('onclick', `deletenote(${newnotes_index - 1}, ${1})`);
    newdeletebtn.type = "submit";
    newdeletebtn.id = newnotes_index;
    newdeletebtn.innerHTML = "Delete Note";


    // now we have to append the childs accordingly 
    mynotediv.appendChild(newh2);
    titlediv.appendChild(titleofnoteh2);
    titlediv.appendChild(newaddbtn);
    mynotediv.appendChild(titlediv);
    
    contentdiv.appendChild(contentofnoteh1);
    mynotediv.appendChild(contentdiv);
    mynotediv.appendChild(newdeletebtn);


    const container2id = document.getElementById('container2id');
    container2id.appendChild(mynotediv);

    
    // now we have completed the DOM part now we just have to send the fetch request to server side 
    const data = {
        newnote: original_newnotecontent,
        newtitle: title
    };
    console.log("the data that is being passed on to the server side is as follows");
    console.log(data);

    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    };

    const response = await fetch('/addnotes', options);
    const response_data = await response.json();
    console.log("the response from the server side is as follows");
    console.log(response_data);

    // say everything went fine 
}






// defining the function to send the data from the frontend to the backend 
// we have to implement the opennote function for showing and opening the note
// for the better experience of the user 
async function opennote(index, gateway) {
    console.log("this is coming from the gatewy number ");
    console.log(gateway);
    console.log("the value of hte index of the note to be opened is as follows ");
    console.log(index);
    // console.log("the topic of the note to be opened  is as follows ");
    // console.log(presenttopic);
    // console.log(presentnote);


    // applying the if else statement 
    if (gateway == 1) {
        console.log("we have to open the recently added note in this case ");
        index = index + contentofnotesarr.length;
    }


    const data = {  index: index };

    // now we have to request the post request with the data going to the server side 
    const datatransfer = {
        method: "POST",
        body: JSON.stringify(data),
        // setting the headers for telling that the data will be send using JSON 
        headers: { "Content-Type": "application/json" },
        
    };

    // now calling the fetch function to send the post request to the server side to show the notes that has been selected 
    const response = await fetch('/showfullnote', datatransfer);
    const json = await response.json();
    console.log(json);
}


// now writing the code for deleting the current note without refreshing the page 
async function deletenote(index, gateway) {
    console.log("the gateway for this note is as follows ");
    console.log(gateway);

    console.log("the index for this gateway is as follows ");
    console.log(index);

    let notetodelete = "";

    if (gateway == 0) {
        // this means that this note is from already added part of the notes section 
        notetodelete = contentofnotesarr[index];
        // now we have make the display of  that note as none for the better experience of user 
        // we have to grab the elemenst first for this purpose 
        const mynotes = document.querySelectorAll('.mynotes');
        console.log("the notes that are already present are as follows ");
        console.log(mynotes);
        console.log(mynotes.length);

        mynotes[index].style.display = "none";
    }
    else {
        notetodelete = newnotes[index];

        const temp_mynotes = document.querySelectorAll('.temp_mynotes');
        console.log("the recently added notes are as follows");
        console.log(temp_mynotes);
        console.log(temp_mynotes.length);

        temp_mynotes[index].style.display = "none";
    }

    console.log("the note to delete is as follows ");
    console.log(notetodelete);


    // now we have to make the fetch request to the server side for the interaction 
    const data = {
        notetodelete: String(notetodelete).trim()
    };

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

    const response = await fetch('/deletenote', options);
    const response_data = await response.json();
    console.log("the mission is successfully completed");
    console.log(response_data);

}



