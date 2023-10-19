let form = document.querySelector(".todoask")
let inp = form.querySelector("#todo")
let container = document.querySelector('.box')

let modal = document.querySelector(".modal")

let base_url = "http://localhost:3001/users"

form.onsubmit = (e) => {
    e.preventDefault();
    
    let todo = {
        id : Math.random(),
        title : inp.value,
        isDone : false,
        time : new Date().getHours() + ":" + new Date().getMinutes() + ":" +
        new Date().getSeconds()
    }
    
    setData(base_url, todo)
};

parseData(base_url)

function setData(link, data) {
    fetch(link, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(data),
    })
    .catch(e => console.log(e))
    .then(() => parseData(base_url))
}
function parseData(link) {
    fetch(link).then(elem => elem.json()).then(elem => reload(elem))
}

function deleteData(link, elem) {
    fetch(`${link}/${elem.id}`, {
        method : "DELETE",
        body : JSON.stringify(elem),
        headers : {"Content-Type" : "application/json"}
    }).catch(e => console.log(e))
}

function modifyData(link, elem) {
    fetch(`${link}/${elem.id}`, {
        method : "PATCH",
        body : JSON.stringify(elem),
        headers : {"Content-Type" : "application/json"}
    }).catch(e => console.log(e))
}

function reload(arr) {
    container.innerHTML = ""
    
    function makeInnerChange(text, curTime) {
        
        let title_text = modal.querySelector(".title");
        title_text.textContent = text
        
        let time = modal.querySelector(".time")
        time.textContent = curTime
        
        return text
    };
    
    for (let todo of arr) {
        // a
        let item = document.createElement("div")
        let wrapper = document.createElement("div")
        let info = document.createElement("div")
        let title_text = document.createElement("span")
        let time = document.createElement("span")
        let clsButton = document.createElement("button")
        let img = document.createElement("img")
        
        // b
        item.classList.add("item")
        wrapper.classList.add("wrapper")
        info.classList.add("info")
        title_text.classList.add("title")
        time.classList.add("time")
        clsButton.classList.add("del")
        
        img.src = "img/cls.svg"
        img.alt = "cls"
        
        if (todo.isDone) {
            title_text.style.textDecoration = "line-through"
        }
        else {title_text.style.textDecoration = ""}
        
        title_text.textContent = todo.title
        time.innerHTML = todo.time
        
        // c
        item.append(wrapper)
        wrapper.append(info, clsButton)
        info.append(title_text, time)
        clsButton.append(img)
        
        container.append(item)
        
        // d
        
        title_text.onclick = () => {
            if (todo.isDone) {
                title_text.style.textDecoration = ""
                todo.isDone = false
            } else {
                title_text.style.textDecoration = "line-through"
                todo.isDone = true
            }
            
            modifyData(base_url, todo)
        };
        
        item.ondblclick = () => {
            modal.classList.add("active");
            let inp_modal = document.querySelector("#modal-change")
            let form_modal = document.querySelector(".modal-form");
            let val;

            inp_modal.value = title_text.innerHTML
            makeInnerChange(title_text.innerHTML, time.textContent)

            modal.onclick = (e) => {
                if (e.target.classList.contains("modal")) {
                    modal.classList.add("active-remove");
                    

                    setTimeout(() => {modal.classList.remove("active",
                    "active-remove")},
                    400);
                };
            };
            
            form_modal.onsubmit = (e) => {
                e.preventDefault();
                
                if (inp_modal.value.length != 0) {
                    modal.classList.add("active-remove")
                    
                    setTimeout(() => {modal.classList.remove("active",
                    "active-remove")},
                    400)
                    
                    title_text.textContent = val
                    todo.title = val
                    modifyData(base_url, todo)
                }
            };
            
            inp_modal.oninput = () => {
                if (inp_modal.value.length != 0) {
                    inp_modal.classList.remove("error")
                    val = makeInnerChange(inp_modal.value, time.textContent)
                } else {
                    inp_modal.classList.add("error")
                    makeInnerChange("", time.textContent)
                }
            };
        };
        
        clsButton.onclick = () => {
            item.classList.add("delete")
            
            setTimeout(() => {
                item.remove()
                deleteData(base_url, todo)
            }, 500)
        };
    }
}
