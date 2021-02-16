window.addEventListener("load", function () {
    const bodyTag = document.getElementsByTagName("body")[0];
    bodyTag.style.display = "block";

    const inputProblemList = document.getElementsByName("problem");
    const inputBrandList = document.getElementsByName("brand");
    const selectModel = document.getElementById("phone-model");
    const otherBrandInput = document.getElementById("other-brand");
    const guaranteeSelect = document.getElementById("guarantee-type");

    const cotizarBtn = document.getElementById("cotizar-btn");

    const sendMailBtn = document.getElementById("send-mail-btn");
    sendMailBtn.addEventListener("click", sendMailToServer);

    const popupExitBtn = document.getElementsByClassName(
        "exit-popup-container"
    )[0];

    let selectedBrand = "";
    let selectedProblem = "";
    let price = document.getElementById("price-text");

    /**********VALIDATING FORM FUNCTION*************** **/
    cotizarBtn.addEventListener("click", function () {
        const otherBrandInput = document.getElementById("other-brand");
        const guaranteeTypeSelect = document.getElementById("guarantee-type");
        const selectedGuaranteeType =
            guaranteeTypeSelect.options[guaranteeTypeSelect.selectedIndex];
        const selectedModel = selectModel.options[selectModel.selectedIndex];

        if (selectModel.disabled && guaranteeSelect.disabled) {
            const openPopup = exitingPopup.bind(popupExitBtn);
            openPopup();
            return;
        }

        if (selectedBrand == "") {
            selectedBrand = otherBrandInput.value;
        }

        if (
            selectedProblem == "" ||
            selectedBrand == "" ||
            selectedGuaranteeType.value == ""
        ) {
            alert("Ingrese la informacion necesaria por favor");
            return;
        }
        addLoadingElement(true);
        /***************SOLICITUD DE JSON CON LOS PRECIOS**************/
        fetch("https://911smartphones.com/JSON/prices.json")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let model = false;
                let problem = false;
                let guarantee = false;

                (function () {
                    if (data.hasOwnProperty(selectedModel.value)) {
                        model = true;
                        if (
                            data[selectedModel.value].hasOwnProperty(
                                selectedProblem
                            )
                        ) {
                            problem = true;
                            if (
                                data[selectedModel.value][
                                    selectedProblem
                                ].hasOwnProperty(selectedGuaranteeType.value)
                            ) {
                                guarantee = true;
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                })();

                if (model == true && problem == true && guarantee == true) {
                    const mainTag = document.getElementsByTagName("main")[0];
                    const mainHeight = mainTag.offsetHeight;
                    const mainBottomMargin = window.getComputedStyle(mainTag)
                        .marginBottom;
                    const bottomPosition =
                        mainHeight + parseInt(mainBottomMargin);

                    window.scrollTo({
                        top: bottomPosition,
                        behavior: "smooth",
                    });

                    price.innerHTML = `$${
                        data[selectedModel.value][selectedProblem][
                            selectedGuaranteeType.value
                        ]
                    }.00`;
                } else {
                    const openPopup = exitingPopup.bind(popupExitBtn);
                    openPopup();
                }
                addLoadingElement(false);
            })
            .catch((error) => console.log(error));
    });

    /**CAMBIA EL COLOR Y SELECCIONA LOS OPCIONES EN EL FORMULARIO**/
    for (let i = 0; i < inputProblemList.length; i++) {
        inputProblemList[i].parentNode.addEventListener("click", function () {
            if (this.children[2].checked == true) {
                this.children[2].checked = false;
                selectedProblem = "";
            } else {
                this.children[2].checked = true;
                selectedProblem = this.id;
            }
        });
        inputProblemList[i].parentNode.addEventListener("click", function () {
            for (let j = 0; j < inputProblemList.length; j++) {
                if (inputProblemList[j].checked == true) {
                    inputProblemList[j].parentElement.style.border =
                        "3px solid var(--main-color)";
                } else {
                    inputProblemList[j].parentElement.style.border = "";
                }
            }
        });
    }
    for (let i = 0; i < inputBrandList.length; i++) {
        inputBrandList[i].parentNode.addEventListener("click", function () {
            if (this.children[2].checked == true) {
                this.children[2].checked = false;

                selectedBrand = "";
                selectModel.innerHTML = "";
                selectModel.disabled = true;
                guaranteeSelect.disabled = true;
                otherBrandInput.disabled = false;
            } else {
                this.children[2].checked = true;

                selectedBrand = this.id;
                switchSelectOptions(selectedBrand);
                selectModel.disabled = false;
                guaranteeSelect.disabled = false;
                otherBrandInput.disabled = true;
            }
        });

        inputBrandList[i].parentNode.addEventListener("click", function () {
            for (let j = 0; j < inputBrandList.length; j++) {
                if (inputBrandList[j].checked == true) {
                    inputBrandList[j].parentElement.style.border =
                        "3px solid var(--main-color)";
                } else {
                    inputBrandList[j].parentElement.style.border = "";
                }
            }
        });
    }

    popupExitBtn.addEventListener("click", exitingPopup);
});

/******Recololección de información para envió de correo ******/
function sendMailToServer() {
    const clientName = document.getElementById("client-name");
    const clientNumber = document.getElementById("client-number");
    const clientMail = document.getElementById("client-mail");
    const clientMsg = document.getElementById("client-msg").value;
    const formBtn = document.getElementById("send-mail-btn");

    const problemsList = document.getElementById("problems-list").children;
    let clientProblem = "";
    for (let i = 0; i < problemsList.length; i++) {
        if (problemsList[i].getElementsByTagName("input")[0].checked == true) {
            clientProblem = problemsList[i].getElementsByTagName("h3")[0]
                .innerText;
        }
    }

    const brandList = document.getElementById("brand-list").children;
    const otherBrand = document.getElementById("other-brand").value;
    let selectedBrandFromList = "";
    let brandToSend = "";
    for (let i = 0; i < brandList.length; i++) {
        if (brandList[i].getElementsByTagName("input")[0].checked == true) {
            brandToSend = selectedBrandFromList = brandList[
                i
            ].getElementsByTagName("h3")[0].innerText;
        }
    }

    if (selectedBrandFromList == "") {
        brandToSend = otherBrand;
    }

    if (validateContactForm(clientName, clientNumber, clientMail, clientMsg)) {
        this.disabled = true;
        const mailDetails = {
            clientName: clientName.value,
            clientNumber: clientNumber.value,
            clientMail: clientMail.value,
            clientMsg: clientMsg,
            clientProblem: clientProblem,
            clientBrand: brandToSend,
        };

        addLoadingElement(true);

        console.log(mailDetails);
        grecaptcha.ready(function () {
            grecaptcha
                .execute("6LdWSFgaAAAAAImTFxg3P8kOWqwtUNYrdEOr6DoA", {
                    action: "homepage",
                })
                .then(function (token) {
                    $.post("contact.php", {
                        ...mailDetails,
                        formBtn: formBtn.value,
                        token: token,
                    })
                        .done(function () {
                            document.body.insertAdjacentHTML(
                                "beforeend",
                                '<p class="alert alert-success">Gracias! Tu mensaje ha sido enviado.</p>'
                            );
                            addLoadingElement(false);
                        })
                        .fail(function (response) {
                            if (response.status == 403) {
                                document.body.insertAdjacentHTML(
                                    "beforeend",
                                    "<p class='alert alert-warning'>Ha habído un problema con tu envio, por favor inténtelo de nuevo.</p>"
                                );
                            } else if (response.status == 400) {
                                document.body.insertAdjacentHTML(
                                    "beforeend",
                                    '<p class="alert alert-warning">Por favor complete el formulario de contacto e intentelo de nuevo.</p>'
                                );
                            } else if (
                                response.responseText == "suspicious" &&
                                response.status == 500
                            ) {
                                document.body.insertAdjacentHTML(
                                    "beforeend",
                                    '<p class="alert alert-warning">Hemos detectado actividad sospechosa, por favor intentelo más tarde.</p>'
                                );
                                console.log("eres un bot");
                            } else if (response.status == 500) {
                                document.body.insertAdjacentHTML(
                                    "beforeend",
                                    '<p class="alert alert-warning">Oops! Algo salió mal, no pudimos enviar tu mensaje.</p>'
                                );
                            } else {
                                document.body.insertAdjacentHTML(
                                    "beforeend",
                                    '<p class="alert alert-warning">Oops! Algo salió mal, por favor inténtelo más tarde.</p>'
                                );
                            }
                            addLoadingElement(false);
                        });
                });
        });
    }
}

/*********** POPUP EXIT BTN **********/
function exitingPopup() {
    const popupForm = document.getElementById("mail-popup");
    if (this.children[0].checked) {
        this.children[0].checked = false;
        popupForm.previousElementSibling.style.display = "none";
        popupForm.style.display = "none";
    } else {
        this.children[0].checked = true;
        popupForm.previousElementSibling.style.display = "block";
        popupForm.style.display = "block";
    }
}

/**** Agrega opciones al select de modelo al escoger una marca ****/
function switchSelectOptions(brandId) {
    const phoneModelSelect = document.getElementById("phone-model");
    switch (brandId) {
        case "apple":
            phoneModelSelect.innerHTML =
                '<option value="iphone-5">iPhone 5</option><option value="iphone-5">iPhone 5S</option><option value="iphone-5">iPhone 5C</option><option value="iphone-6">iPhone 6</option><option value="iphone-6">iPhone 6S</option><option value="iphone-6-plus">iPhone 6 Plus</option><option value="iphone-7">iPhone 7</option><option value="iphone-7-plus">iPhone 7 Plus</option><option value="iphone-8">iPhone 8</option><option value="iphone-8-plus">iPhone 8 Plus</option><option value="iphone-x">iPhone X</option><option value="iphone-xs">iPhone XS</option><option value="iphone-xr">iPhone XR</option><option value="iphone-11">iPhone 11</option><option value="iphone-11-pro">iPhone 11 Pro</option><option value="iphone-11-pro-max">iPhone 11 Pro Max</option><option value="iphone-xs-max">iPhone XS Max</option>';
            break;
        case "samsung":
            phoneModelSelect.innerHTML =
                '<option value="samsung-j4">Samsung J4/J400</option> <option value="samsung-j5">Samsung J5/J500</option> <option value="samsung-j510">Samsung J5/J510</option> <option value="samsung-j530">Samsung J530/J5PRO</option> <option value="samsung-j4+">Samsung J4+</option> <option value="samsung-j4+">Samsung J6+</option> <option value="samsung-j6">Samsung J6/J600</option> <option value="samsung-j7">Samsung J7/J700</option> <option value="samsung-j701">Samsung J701/J710</option> <option value="samsung-j7pro">Samsung J7PRO/J737</option> <option value="samsung-j8">Samsung J8/J800</option> <option value="samsung-j810">Samsung J8/J810</option> <option value="samsung-s5">Samsung S5</option> <option value="samsung-s6">Samsung S6</option> <option value="samsung-s7">Samsung S7</option> <option value="samsung-s8">Samsung S8</option> <option value="samsung-s8">Samsung S8 Plus</option> <option value="samsung-s9">Samsung S9</option> <option value="samsung-s9-plus">Samsung S9 Plus</option> <option value="samsung-s10">Samsung S10</option> <option value="samsung-s10+">Samsung S10+</option> <option value="samsung-a10">Samsung A10</option> <option value="samsung-a10">Samsung A10S</option> <option value="samsung-a01">Samsung A01</option> <option value="samsung-a20">Samsung A20</option> <option value="samsung-a20">Samsung A20S</option> <option value="samsung-a30">Samsung A30</option> <option value="samsung-a30">Samsung A30S</option> <option value="samsung-a50">Samsung A50</option> <option value="samsung-a51">Samsung A51</option> <option value="samsung-a80">Samsung A80</option> <option value="samsung-a520">Samsung A520</option> <option value="samsung-a8">Samsung A8/A530</option> <option value="samsung-a51">Samsung A51</option> <option value="samsung-a7">Samsung A7/A750</option> <option value="samsung-note-8">Samsung Note 8</option> <option value="samsung-note-9">Samsung Note 9</option>';
            break;
        case "xiaomi":
            phoneModelSelect.innerHTML =
                '<option value="xiaomi-a2">XIAOMI A2/A2 LITE</option> <option value="xiaomi-a3">XIAOMI A3/A3 LITE</option> <option value="xiaomi-redmi-6">XIAOMI REDMI 6/6A</option> <option value="xiaomi-redmi-7">XIAOMI REDMI 7/7A</option> <option value="xiaomi-redmi-8">XIAOMI REDMI 8/8A</option> <option value="xiaomi-note-4">XIAOMI NOTE 4</option> <option value="xiaomi-note-5">XIAOMI NOTE 5/PRO</option> <option value="xiaomi-note-6">XIAOMI NOTE 6 PRO</option> <option value="xiaomi-note-7">XIAOMI NOTE 7</option> <option value="xiaomi-note-8">XIAOMI NOTE 8/PRO</option> <option value="xiaomi-note-9">XIAOMI NOTE 9S</option>';
            break;
        case "huawei":
            phoneModelSelect.innerHTML =
                '<option value="huawei-p10">Huawei P10</option><option value="huawei-p10-lite">Huawei P10 Lite</option><option value="huawei-p20">Huawei P20</option><option value="huawei-p20-lite">Huawei P20 Lite</option><option value="huawei-p30">Huawei P30</option><option value="huawei-p30-lite">Huawei P30 Lite</option><option value="huawei-p8">Huawei P8</option><option value="huawei-p8-lite">Huawei P8 Lite</option><option value="huawei-p9">Huawei P9</option><option value="huawei-p9-lite">Huawei P9 Lite</option><option value="huawei-y5-2019">Huawei Y5 2019</option><option value="huawei-y6-2017">Huawei Y6 2017</option><option value="huawei-y6-2018">Huawei Y6 2018</option><option value="huawei-y9-2019">Huawei Y9 2019</option><option value="huawei-honor-7a">Huawei Honor 7A</option><option value="huawei-honor-8x">Huawei Honor 8X</option><option value="huawei-p-smart">Huawei P SMART</option><option value="huawei-p-smart-2019">Huawei P SMART 2019</option><option value="huawei-mate-10">Huawei MATE 10</option><option value="huawei-mate-20-lite">Huawei MATE 20 Lite</option>';
            break;
        case "sony":
            phoneModelSelect.innerHTML =
                '<option value="1">sony 1</option><option value="2">sony 2</ption> <option value="3">sony 3</option><option value="4">sony 4</option><option value="5">sony 5</option>';
            break;
        case "tlc":
            phoneModelSelect.innerHTML =
                '<option value="1">tlc 1</option><option value="2">tlc 2</ption> <option value="3">tlc 3</option><option value="4">tlc 4</option><option value="5">tlc 5</option>';
            break;
        case "blu":
            phoneModelSelect.innerHTML =
                '<option value="1">blu 1</option><option value="2">blu 2</ption> <option value="3">blu 3</option><option value="4">blu 4</option><option value="5">blu 5</option>';
            break;
        case "siragon":
            phoneModelSelect.innerHTML =
                '<option value="1">siragon 1</option><option value="2">siragon 2</ption> <option value="3">siragon 3</option><option value="4">siragon 4</option><option value="5">siragon 5</option>';
            break;
        case "lg":
            phoneModelSelect.innerHTML =
                '<option value="1">lg 1</option><option value="2">lg 2</ption> <option value="3">lg 3</option><option value="4">lg 4</option><option value="5">lg 5</option>';
            break;
        case "krip":
            phoneModelSelect.innerHTML =
                '<option value="1">krip 1</option><option value="2">krip 2</ption> <option value="3">krip 3</option><option value="4">krip 4</option><option value="5">krip 5</option>';
            break;
        case "motorola":
            phoneModelSelect.innerHTML =
                '<option value="motorola-g5">MOTOROLA G5/G5+</option> <option value="motorola-g4">MOTOROLA G4/G4+</option> <option value="motorola-g6">MOTOROLA G6/G6PLAY</option> <option value="motorola-g7">MOTOROLA G7/G7+</option> <option value="motorola-g8">MOTOROLA G8</option> <option value="motorola-g2">MOTOROLA G2</option> <option value="motorola-g3">MOTOROLA G3</option> <option value="motorola-e4">MOTOROLA E4</option> <option value="motorola-e5">MOTOROLA E5/E5+</option> <option value="motorola-e6">MOTOROLA E6/E6+</option>';
            break;
        case "alcatel":
            phoneModelSelect.innerHTML =
                '<option value="1">alcatel 1</option><option value="2">alcatel 2</ption> <option value="3">alcatel 3</option><option value="4">alcatel 4</option><option value="5">alcatel 5</option>';
            break;
    }
}

function validateContactForm(nameElement, numberElement, emailElement, msg) {
    let isEmailEmpty = false;
    let isNameEmpty = false;
    let isNumberEmpty = false;

    if (emailElement.value == "" || emailElement.value.trim() == "") {
        emailElement.nextElementSibling.innerText =
            "Por favor ingrese su correo electronico";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailElement.value)) {
        emailElement.nextElementSibling.innerText =
            "El correo que ingresó no es válido";
    } else {
        emailElement.nextElementSibling.innerText = "";
        isEmailEmpty = true;
    }

    if (
        nameElement.value.length > 25 ||
        nameElement.value == "" ||
        nameElement.value.trim() == ""
    ) {
        nameElement.nextElementSibling.innerText =
            "Ingrese un nombre con menos de 25 caracteres";
    } else {
        nameElement.nextElementSibling.innerText = "";
        isNameEmpty = true;
    }

    if (
        numberElement.value == "" ||
        numberElement.value.trim() == "" ||
        !/^([+]58|0058|0)\d{10}$/.test(numberElement.value)
    ) {
        numberElement.nextElementSibling.innerText =
            "Por favor ingrese un número de télefono valido";
    } else {
        numberElement.nextElementSibling.innerText = "";
        isNumberEmpty = true;
    }

    if (isEmailEmpty && isNameEmpty && isNumberEmpty) {
        return true;
    }
}

function addLoadingElement(isAdding) {
    if (isAdding) {
        const elem = `<div id="data-loading" class="loading-box">
                        <div class="loading-bg"></div>
                        <div class="loadingio-spinner-rolling-myugzulb93j">
                            <div class="ldio-r663jsyr3rh">
                                <div></div>
                            </div>
                        </div>
                    </div>`;
        document.body.insertAdjacentHTML("beforeend", elem);
    } else {
        const loadingElement = document.getElementById("data-loading");
        loadingElement.remove();
    }
}
