const comms = document.querySelectorAll(".readcomments");

comms.forEach((l)=>{
    l.addEventListener("click", ()=>{
        if(l.classList.contains("show-coms")){
            l.classList.remove("show-coms");
        } else{
            l.classList.add("show-coms");
        }
    })
})
