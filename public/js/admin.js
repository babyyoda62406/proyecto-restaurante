let bundleForm = ""
let validate = false
let dataCach = ''
let dataCache2 = ''
let dataCache3 = ''
let modalCache = ""
const ctPlate = document.getElementById("ctPlate")


const getPlace = (arg) => {
    if (arg.parentNode.parentNode.parentNode.id == "ctDSY") return "D"
    if (arg.parentNode.parentNode.parentNode.id == "ctALZ") return "A"
    if (arg.parentNode.parentNode.parentNode.id == "ctCDM") return "C"
}

const handlerClick = (arg) => {
    const item = arg.target
    switch (item.id) {
        case "btAddPlate":
            validate = tryValidaton(document.getElementById("formAddPlate"))
            if (validate) {
                // alert(item.id)
                bundleForm = new FormData(document.getElementById("formAddPlate"))
                fetch("/addPlate", {
                    method: 'post',
                    body: bundleForm,
                    headers: {
                        /* 'Content-Type': "multipart/form-data",
                         'enctype': "multipart/form-data"*/
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById("ipDesayuno").checked = false
                        document.getElementById("ipAlmuerzo").checked = false
                        document.getElementById("ipComida").checked   = false
                        document.getElementById("ipNamePlate").value     = ""
                        document.getElementById("ipPricePlate").value     = ""
                        loadView()
                        alert(data.msg)
                    })
            }
            else {
                alert("Rellene todos los campos")
            }
            break
        case "btEditPlate":
            document.getElementById("mEditableTitle").innerHTML = "Editar plato"
            bundleForm = new FormData(document.getElementById("formAddPlate"))
            validate = tryValidatonEdit(document.getElementById("formAddPlate"))
            if (validate) {
                fetch("/editPate", {
                    method: "post",
                    body: bundleForm
                })
                    .then(res => res.json())
                    .then(data => {
                        loadView()
                        document.getElementById("mEditableTitle").innerHTML = "Agregar plato"
                        document.getElementById("mdEditable").innerHTML = modalCache
                        alert(data.msg)
                    })
            } else {
                alert("Debe rellenar todos los campos")
                document.getElementById("mEditableTitle").innerHTML = "Agregar plato"
                document.getElementById("mdEditable").innerHTML = modalCache
            }
            break
        case "btResetModal":
            document.getElementById("mEditableTitle").innerHTML = "Agregar plato"
            document.getElementById("mdEditable").innerHTML = modalCache
            break
        case "showMSG":
            getMsg()
            break
        case "showReserve":
            getReverse()
            //$("#modalNotePad").modal("show")
            break

    }

    switch (item.classList[0]) {
        case "btnDelete":
            const tempForm = new FormData()
            tempForm.append("id", item.id)
            tempForm.append("time", getPlace(item))
            fetch("/deletePlate", {
                method: "post",
                body: tempForm
            })
                .then(res => res.json())
                .then(data => {
                    loadView()
                    alert(data.msg)
                })
            break
        case "btnEdit":
            const mdEditable = document.getElementById("mdEditable")
            modalCache = mdEditable.innerHTML
            const extract = dataCache.filter(arg => arg.id == item.id)[0]
            const { id, name, price, time } = extract

            mdEditable.innerHTML = `<form id="formAddPlate" class="needs-validation form-clm"   enctype="multipart/form-data" novalidate>
                                            <input type="hidden" readonly value="${id}" class="input" required id="ipID"
                                                name="ipID" />
                                    <div class="ctrow">
                                        <div class="clItem">Hora del dia</div>
                                        <div class="clItem chgroup">
                                            <div class="clItem">
                                                <input class="chbx" type="checkbox" ${(time[0] == "D") ? "checked" : ""} ${(time[1] == "D") ? "checked" : ""} ${(time[2] == "D") ? "checked" : ""} name="ipDesayuno" id="ipDesayuno">
                                                <div>Desayuno</div>
                                            </div>
                                            <div class="clItem">
                                                <input class="chbx" type="checkbox" ${(time[0] == "A") ? "checked" : ""} ${(time[1] == "A") ? "checked" : ""} ${(time[2] == "A") ? "checked" : ""} name="ipAlmuerzo" id="ipAlmuerzo">
                                                <div>Almuerzo</div>
                                            </div>
                                            <div class="clItem">
                                                <input class="chbx" type="checkbox" ${(time[0] == "C") ? "checked" : ""} ${(time[1] == "C") ? "checked" : ""} ${(time[2] == "C") ? "checked" : ""} name="ipComida" id="ipComida">
                                                <div>Comida</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="ctrow">
                                        <div class="clItem">Nombre: </div>
                                        <div class="clItem">
                                            <input type="text" value="${name}" class="input" required id="ipNamePlate"
                                                name="ipNamePlate" />
                                        </div>
                                    </div>                                  

                                    <div class="ctrow">
                                        <div class="clItem">Precio: </div>
                                        <div class="clItem">
                                            <input type="number"  class="input" value=${Number(price)} id="ipPricePlate"
                                                name="ipPricePlate" />
                                        </div>
                                    </div>
                                </form>
                                <script>
                                    // Example starter JavaScript for disabling form submissions if there are invalid fields
                                    (function () {
                                        'use strict';
                                        window.addEventListener('load', function () {
                                            // Fetch all the forms we want to apply custom Bootstrap validation styles to
                                            var forms = document.getElementsByClassName('needs-validation');
                                            // Loop over them and prevent submission
                                            var validation = Array.prototype.filter.call(forms, function (form) {
                                                form.addEventListener('submit', function (event) {
                                                    if (form.checkValidity() === false) {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                    }
                                                    form.classList.add('was-validated');
                                                }, false);
                                            });
                                        }, false);
                                    })();
                                </script>
                                <div class="modal-footer">
                                        <button type="button" id="btResetModal" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Cancelar</button>
                                        <button id="btEditPlate" type="button" data-bs-dismiss="modal" class="btn btn-primary">Aceptar</button>
                                </div>
`
            $("#exampleModal").modal("show")
            document.getElementById("mEditableTitle").innerHTML = "Editar plato"
            document.getElementById("btEditPlate").onclick = handlerClick
            document.getElementById("btResetModal").onclick = handlerClick
            break
    }

    switch (item.classList[1]) {
        case "btViewMsg":
            let trash_view = dataCache2.filter(arg => arg.id == item.classList[2])[0]
            document.getElementById("toastTitle").innerHTML = `${trash_view.contact_name}`
            document.getElementById("labelDate").innerHTML = `${trash_view.time}`
            document.getElementById("toastBody").innerHTML = trash_view.contact_message
            $(".toast").toast('show')
            break
        case "btDeleteMsg":
            const bdDelete = new FormData()
            bdDelete.append("id", item.classList[2])
            fetch("/deleteMsg", {
                method: "post",
                body: bdDelete
            })
                .then(res => res.json())
                .then(data => {
                    getMsg()
                })
            break
        case "btViewRsv":
            let trash_Rsv = dataCache3.filter(arg => arg.id == item.classList[2])[0]
            document.getElementById("toastTitle").innerHTML = `${(trash_Rsv.name.length < 10)?trash_Rsv.name:trash_Rsv.name.substring(0,7)+"..."}`
            document.getElementById("labelDate").innerHTML = `${trash_Rsv.date}`
            document.getElementById("toastBody").innerHTML = trash_Rsv.message
            $(".toast").toast('show')
            break
        case "btDeleteRsv":
            const bdRsv = new FormData()
            bdRsv.append("id", item.classList[2])
            fetch("/deleteRsv", {
                method: "post",
                body: bdRsv
            })
                .then(res => res.json())
                .then(data => {
                    getReverse()
                })
            break
    }

}



window.onload = () => {
    const btAddPlate = document.getElementById("btAddPlate")
    const showMSG = document.getElementById("showMSG")
    const showReserve = document.getElementById("showReserve")
    btAddPlate.onclick = handlerClick
    showMSG.onclick = handlerClick
    showReserve.onclick = handlerClick
    loadView()
    $(".toast").toast({ autohide: false })
}

const tryValidaton = (arg) => {
    if (!document.getElementById("ipDesayuno").checked && !document.getElementById("ipAlmuerzo").checked && !document.getElementById("ipComida").checked) return false
    if (!document.getElementById("ipNamePlate").value) return false
    if (!document.getElementById("ipPricePlate").value) return false
    if (document.getElementById("ipCoverPlate").files.length == 0) return false
    return true
}

const tryValidatonEdit = (arg) => {
    if (!document.getElementById("ipDesayuno").checked && !document.getElementById("ipAlmuerzo").checked && !document.getElementById("ipComida").checked) return false
    if (!document.getElementById("ipNamePlate").value) return false
    if (!document.getElementById("ipPricePlate").value) return false
    return true
}


const loadView = () => {
    const ctDSY = document.getElementById("ctDSY")
    const ctALZ = document.getElementById("ctALZ")
    const ctCDM = document.getElementById("ctCDM")
    let bundleDSY = ``
    let bundleALZ = ``
    let bundleCDM = ``

    fetch("/meet")
        .then(res => res.json())
        .then(data => {
            dataCache = data
            data.map(arg => {
                const { id, name, price, time, file } = arg
                // console.log(name , price , time , file)
                const bag = `<div  class="col-lg-4 col-md-6 col-12 ctCard ">
                                <div class="ctRow">
                                    <h5 class="mb-0">${name}</h5>
                                    <span class="price-tag bg-white "><small>$</small>${price}</span>
                                </div>
                                <div class="menu-thumb">
                                    <img src="upload/${file}"
                                        class="img-fluid menu-image" alt="" width="500">
                                </div>
                                <div class="ctRow p-1 jr">
                                    <button class="btnDelete btn btn-danger " id="${id}">Eliminar</button>
                                    <button class="btnEdit btn btn-info " id="${id}">Editar</button>
                                </div>
                                
                            </div>`

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

            let bottonCollection = document.getElementsByClassName("btnDelete")
            for (let i = 0; i < bottonCollection.length; i++)bottonCollection[i].onclick = handlerClick

            bottonCollection = document.getElementsByClassName("btnEdit")
            for (let i = 0; i < bottonCollection.length; i++)bottonCollection[i].onclick = handlerClick
        })
}

const getReverse = () => {
    let tbBody = ``
    fetch('/getReserve')
        .then(res => res.json())
        .then(data => {
            data.map(arg => {
                const { id, name, phone, date, timeN, message } = arg
                tbBody += `<tr>
                            <td scope="row" class="">${name}</td>
                            <td scope="row" class="">${phone}</td>
                            <td scope="row" class="">${date}</td>
                            <td scope="row" class="">${timeN}</td>
                            <td scope="row" class="">${(message.length > 10) ? message.substring(0, 10) : message}...</td>
                            <td scope="row" class="btCtn">
                                <button class="bttb btViewRsv ${id} btn btn-success" title="Toque para ver más">Leer</button>
                                <button class="bttb btDeleteRsv ${id} btn btn-danger" title="Borrar mensaje">Borrar</button>
                            </td>
                        </tr>`
            })
            loadReserve(tbBody)
            dataCache3 = data
            $("#modalNotePad").modal("show")
        })
}

const getMsg = () => {
    let tbBody = ``
    fetch('/getMsg')
        .then(res => res.json())
        .then(data => {
            data.map(arg => {
                const { id, time, contact_name, contact_phone, contact_email, contact_message } = arg
                tbBody += `<tr>
                                <td scope="row" class="">${time}</td>
                                <td scope="row" class="">${contact_name}</td>
                                <td scope="row" class="">${contact_phone}</td>
                                <td scope="row" class="">${contact_email}</td>
                                <td scope="row" class="">${(contact_message.length > 10) ? contact_message.substring(0, 10) : contact_message}...</td>
                                <td scope="row" class="btCtn">
                                    <button class="bttb btViewMsg ${id} btn btn-success" title="Toque para ver más">Leer</button>
                                    <button class="bttb btDeleteMsg ${id} btn btn-danger" title="Borrar mensaje">Borrar</button>
                                </td>
                            </tr>`
            })
            loadMSG(tbBody)
            dataCache2 = data
            $("#modalNotePad").modal("show")
        })

}



let btPool = ''

const loadReserve = (tbRsvBody) => {
    const tbScreen = document.getElementById("tbScreen")
    tbScreen.innerHTML  = tbRsvHead
    tbScreen.innerHTML += tbRsvBody
    tbScreen.innerHTML += tbRsvfoot
    
    btPool = tbScreen.getElementsByClassName("bttb")
    for (let i = 0; i < btPool.length; i++) {
        btPool[i].onclick = handlerClick
    }
}

const loadMSG = (tbmsgBody) => {
    const tbScreen = document.getElementById("tbScreen")
    tbScreen.innerHTML = tbmsgHead
    tbScreen.innerHTML += tbmsgBody
    tbScreen.innerHTML += tbmsgFoot
    btPool = tbScreen.getElementsByClassName("bttb")
    for (let i = 0; i < btPool.length; i++) {
        btPool[i].onclick = handlerClick
    }
}


const tbRsvHead = `<thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Solicitud</th>
                        <th>Opciones</th>
                    </tr>
                    </thead>
                    <tbody>`

const tbRsvfoot = `</tbody>`


const tbmsgHead = `<thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>email</th>
                        <th>Mensaje</th>
                        <th>Opciones</th>
                    </tr>
                    </thead>
                    <tbody>`
const tbmsgFoot = `</tbody>`