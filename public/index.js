const navactive = () => {
    const hambur = document.querySelector(".hambur");
    const navigation = document.querySelector(".navigation");

    hambur.addEventListener("click", () => {
        console.log("the user has clicked the hamburger ");
        navigation.classList.toggle('navigation-active')
        
    })

    // otherwise  if we click on any of this then we can toggle the classlist 
    const anchorlinks = document.querySelectorAll(".navbar li a");
    console.log(anchorlinks);

    for (let i = 0; i < anchorlinks.length;i++)
    {
        anchorlinks[i].addEventListener("click", () => {
            navigation.classList.toggle('navigation-active');
        })
    }
}




// calling the function for this purpose
navactive();