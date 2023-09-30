var app = {
    "values": {},
    "triggers": {
        "run": function(){
            app.triggers.loadstyles();
            window.onresize = function(){
                app.triggers.reloadstyles();
            }
        },
        "loadstyles": function(){
            var body = document.body
            document.onselectionchange = function(event){
                //Cancel selection
                window.getSelection().removeAllRanges();
            }
            document.oncontextmenu = function(event){
                //Cancel context menu
                event.preventDefault();
            }
            document.onselect = function(event){
                //Cancel selection
                window.getSelection().removeAllRanges();
            }
            document.onselectstart = function(event){
                //Cancel selection
                window.getSelection().removeAllRanges();
            }
            document.onkeydown = function(event){
                event.preventDefault();
            }
            body.style.backgroundColor = "rgb(21, 21, 20)"
            body.style.color = "white"
            body.style.fontFamily = "Arial"
            body.style.overflow = "hidden"
            body.style.margin = "0px"
            var content = document.getElementById("content")
            content.style.height = window.innerHeight + "px"
            content.style.width = window.innerWidth + "px"

            var title = document.createElement("h1")
            title.innerHTML = "Webm to mp4 converter"
            title.style.position = "absolute"
            title.style.display = "absolute"
            title.style.fontSize = ((window.innerWidth / 25) + "px");
            content.appendChild(title)
            title.style.marginLeft = ((window.innerWidth / 2) - (title.offsetWidth / 2)) + "px"

            var button = document.createElement("button")
            button.innerHTML = "Choose file for conversion"
            button.style.margin = "auto"
            button.style.display = "aboslute"
            button.style.position = "absolute"
            button.style.border = "none"
            button.style.backgroundColor = "rgb(255, 255, 255)"
            button.style.color = "rgb(21, 21, 20)"
            button.style.borderRadius = "5px"
            button.style.height = "fit-content"
            button.style.width = "fit-content"
            button.style.paddingTop = ((window.innerWidth / 100) + "px")
            button.style.paddingLeft = ((window.innerWidth / 50) + "px")
            button.style.paddingRight = ((window.innerWidth / 50) + "px")
            button.style.paddingBottom = ((window.innerWidth / 100) + "px")
            button.style.fontSize = ((window.innerWidth / 50) + "px");
            button.style.cursor = "pointer"
            var cooldown = false
            button.onclick = function(){
                if (cooldown){
                    return;
                }
                cooldown = true
                var xhr = new XMLHttpRequest();
                xhr.open("GET", 'http://127.0.0.1:2378/{"action": "load"}');
                xhr.withCredentials = false;
                xhr.onload = function(event){
                    var data = JSON.parse(xhr.responseText)
                    if (data.exit_code === 0){
                        //Set log to ok
                        log.color = "green"
                        log.innerHTML = "Wrote output file to " + data.wroteto
                        //Allign log to center
                        log.style.marginLeft = ((window.innerWidth / 2) - (log.offsetWidth / 2)) + "px"
                    }
                    else{
                        if (data.errorcode === "DIALOG_BOX_CANCELED"){
                            //Set log to Aborted (yellow)
                            log.color = "yellow"
                            log.innerHTML = "Aborted"
                            //Allign log to center
                            log.style.marginLeft = ((window.innerWidth / 2) - (log.offsetWidth / 2)) + "px"
                            cooldown = false
                            return;
                        }
                        //Set log to error
                        log.color = "red"
                        log.innerHTML = "Error"
                        //Allign log to center
                        log.style.marginLeft = ((window.innerWidth / 2) - (log.offsetWidth / 2)) + "px"
                        console.error("Error from app:\n\n" + data.node_error)
                    }
                    cooldown = false
                }
                xhr.send();
                log.color = "white"
                log.innerHTML = "Loading..."
                //Allign log to center
                log.style.marginLeft = ((window.innerWidth / 2) - (log.offsetWidth / 2)) + "px"
            }
            content.appendChild(button)   
            var log = document.createElement("font")
            log.innerHTML = "Ready to select file."
            //Allign log to center
            log.style.marginLeft = ((window.innerWidth / 2) - (log.offsetWidth / 2)) + "px"
            log.style.fontSize = ((window.innerWidth / 50) + "px");
            log.style.display = "absolute"
            log.style.position = "absolute"
            log.style.margin = "auto"
            log.style.marginTop = "20px"
            log.style.textAlign = "center"
            content.appendChild(log)
            button.style.marginTop = /*Center*/ ((content.offsetHeight / 2) - (title.offsetHeight) - (log.offsetHeight)) + "px"
            button.style.marginLeft = ((window.innerWidth / 2) - (button.offsetWidth / 2)) + "px"
            //Make log be in vertical center plus button height * 1.2
            log.style.marginTop = ((content.offsetHeight / 2) + (button.offsetHeight / 2)) + "px"
            //Center
            log.style.marginLeft = ((window.innerWidth / 2) - (log.offsetWidth / 2)) + "px"
        },
        "reloadstyles": function(){
            //This will only be called when the window will resize so reload only required styles
            var content = document.getElementById("content")
            content.style.height = window.innerHeight + "px"
            content.style.width = window.innerWidth + "px"
            var title = document.getElementsByTagName("h1")[0]
            title.style.fontSize = ((window.innerWidth / 25) + "px");
            var button = document.getElementsByTagName("button")[0]
            button.style.fontSize = ((window.innerWidth / 50) + "px");
            button.style.width = "fit-content"
            button.style.height = "fit-content"
            button.style.paddingTop = ((window.innerWidth / 100) + "px")
            button.style.paddingLeft = ((window.innerWidth / 50) + "px")
            button.style.paddingRight = ((window.innerWidth / 50) + "px")
            button.style.paddingBottom = ((window.innerWidth / 100) + "px")
            var log = document.getElementsByTagName("font")[0]
            log.style.fontSize = ((window.innerWidth / 50) + "px");
            button.style.marginTop = /*Center*/ ((content.offsetHeight / 2) - (title.offsetHeight) - (log.offsetHeight)) + "px"
            button.style.marginLeft = ((window.innerWidth / 2) - (button.offsetWidth / 2)) + "px"
            //Make log be in vertical center plus button height * 1.2
            log.style.marginTop = ((content.offsetHeight / 2) + (button.offsetHeight / 2)) + "px"
            //Center
            log.style.marginLeft = ((window.innerWidth / 2) - (log.offsetWidth / 2)) + "px"
            title.style.position = "absolute"
            title.style.display = "absolute"
            title.style.marginLeft = ((window.innerWidth / 2) - (title.offsetWidth / 2)) + "px"
        }
    }
}

app.triggers.run();