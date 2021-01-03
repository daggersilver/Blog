var content = document.getElementById("content");


fetchdata()


async function fetchdata(){
    var rawdata = await fetch("https://myblogs101.herokuapp.com/api/18fmqyojui7cp5up7vzrjrccnzdm63io0qhkllqzltq0kp1a", {mode: "cors"});
    var data = await rawdata.json();

    for(var i=0; i<data.articles.length; i++){
        render(data.articles[i]);
    }
    events();
}

function render(data){
    var card = document.createElement("div");
    var title = document.createElement("h3");
    var blogBody = document.createElement("div");
    var date = document.createElement("p");
    var readcoms = document.createElement("p");
    var commentcontainer = document.createElement("div");

    title.innerHTML = data.title;
    blogBody.innerHTML = data.content;
    date.innerHTML = data.date;
    readcoms.innerHTML = "Read Comments";

    card.setAttribute("class", "blog-card");
    title.setAttribute("class", "blogh1");
    date.setAttribute("class", "blogdate");
    readcoms.setAttribute("class", "readcoms");
    commentcontainer.setAttribute("class", "commentcontainer");


    card.appendChild(title);
    card.appendChild(blogBody);
    card.appendChild(date);
    card.appendChild(readcoms);

    content.appendChild(card);

    for(var i=0; i<data.comments.length; i++){
        var eachcom = document.createElement("p");
        eachcom.innerHTML = `<p>${data.comments[i].username}</p><p>${data.comments[i].comment}</p>`;
        eachcom.setAttribute("class", "eachcom");
        commentcontainer.appendChild(eachcom);
    }

    //comment form
    var commentform = document.createElement("form");
    commentform.innerHTML = `<h4>Add comment</h4>
                             <label for="username">Username</label>
                             <input type="text" id="username" name="username" autocomplete="off" maxlength="20" placeholder="Enter your name" required>
                             <label for="comment">Comment</label>
                             <textarea id="comment" name="comment" required placeholder="Enter Comment"></textarea>
                             <input type="submit" value="Submit">`;
    commentform.setAttribute("class", "commentform");
    commentform.setAttribute("method", "POST");
    commentform.setAttribute("action", `https://myblogs101.herokuapp.com/api/${data._id}/18fmqyojui7cp5up7vzrjrccnzdm63io0qhkllqzltq0kp1a`)
    commentcontainer.appendChild(commentform);

    card.appendChild(commentcontainer);

    commentform.addEventListener("submit", ()=>{
        window.location.reload();
    })

}

//add event listerner
function events(){
    var commentboxes = document.querySelectorAll(".commentcontainer");
    var readcomslist = document.querySelectorAll(".readcoms");

    readcomslist.forEach((l)=>{
        l.addEventListener("click", ()=>{
            commentboxes.forEach((k)=>{
                k.style.display = "none";
            })

            l.nextSibling.style.display = "block";
        })
    })
}



