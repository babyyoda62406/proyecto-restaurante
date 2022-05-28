let bodyRequest = "Cuerpo de la peticion"
let poolEraser  = "Coleccion vacia de elementos"

window.onload = () => {
    try{
        document.getElementById("formContact").onsubmit  = handlerSubmit 
    }catch(err){
        console.log("not for you")
    }
    document.getElementById("formReservar").onsubmit = handlerSubmit
    
}

const loadView = () => { //Carga de los items
    let bundleDSY = ``
    let bundleALZ = ``
    let bundleCDM = ``
    fetch("/meet")
        .then(res => res.json())
        .then(data => {
            data.map(arg => {
                const { name, price, time, file } = arg
                // console.log(name , price , time , file)
                const bag = `\n<div  class="col-lg-4 col-md-6 col-12 ctCard ">
                                <div class="menu-thumb">
                                    <img src="upload/${file}"
                                        class="img-fluid menu-image" alt="" width="500">
                                    <div class="menu-info d-flex flex-wrap align-items-center">
                                        <h4 class="mb-0">${name}</h4>
                                        <span class="price-tag bg-white shadow-lg ms-4"><small>$</small>${price}</span>
                                    </div>
                                </div>
                            </div>\n`

                if (time[0] == "D" || time[1] == "D" || time[2] == "D") bundleDSY += bag
                if (time[0] == "A" || time[1] == "A" || time[2] == "A") bundleALZ += bag
                if (time[0] == "C" || time[1] == "C" || time[2] == "C") bundleCDM += bag


            })
            ctDSY.innerHTML = bundleDSY
            ctALZ.innerHTML = bundleALZ
            ctCDM.innerHTML = bundleCDM

            interval = setInterval(() => {
                ctDSY.scrollLeft += 1
            }, 4)
            setTimeout(() => {
                clearInterval(interval)
            }, 2000)
        })

}

const handlerSubmit = (arg) => {
    arg.preventDefault()
    arg.stopPropagation()
    switch (arg.target.id) {
        case "formReservar":
            bodyRequest = new FormData(document.getElementById("formReservar"))
            fetch('/saveMe', {
                method: "post",
                body: bodyRequest
            })
                .then(res => res.json())
                .then(data => {
                    $("#BookingModal").modal("hide")
                    poolEraser = document.getElementById("formReservar").getElementsByTagName("input")
                    for(let i =0;i<poolEraser.length;i++){
                        poolEraser[i].value = ''
                    }
                    poolEraser = document.getElementById("formReservar").getElementsByTagName("textarea")
                    for(let i =0;i<poolEraser.length;i++){
                        poolEraser[i].value = ''
                    }
                    
                    alert(data.msg)
                })
            break;
        case "formContact":
            bodyRequest = new FormData(document.getElementById("formContact"))
            fetch('/contactMSG', {
                method: "post",
                body: bodyRequest
            })
                .then(res => res.json())
                .then(data => {
                    alert(data.msg)
                })
            poolEraser = document.getElementById("formContact").getElementsByTagName("input")
            for( let i =0 ;i<poolEraser.length;i++){
                poolEraser[i].value = ""
            }
            poolEraser = document.getElementById("formContact").getElementsByTagName("textarea")
            for( let i =0 ;i<poolEraser.length;i++){
                poolEraser[i].value = ""
            }
            
            break
    }

}

