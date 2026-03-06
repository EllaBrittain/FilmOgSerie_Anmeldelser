
// ---- Faste stjerner ----

document.querySelectorAll(".stjerner.fast").forEach((gruppe) => {
    const rating = gruppe.dataset.rating
    gruppe.querySelectorAll("i").forEach((s, i) => {
        if (i < rating) {
            s.classList.replace("fa-regular", "fa-solid")
            s.style.color = "gold"
        }
    })
})


// ---- Modal stjerner ----

const modalStjerner = document.getElementById("modalStjerner")
let valgtIndex = -1

modalStjerner.querySelectorAll("i").forEach((stjerne, index) => {

    stjerne.addEventListener("click", () => {
        valgtIndex = index
        modalStjerner.querySelectorAll("i").forEach((s, i) => {
            s.classList.toggle("fa-solid", i <= index)
            s.classList.toggle("fa-regular", i > index)
            s.style.color = i <= index ? "gold" : "white"
        })
    })

    stjerne.addEventListener("mouseenter", () => {
        modalStjerner.querySelectorAll("i").forEach((s, i) => {
            s.style.color = i <= index ? "gold" : "white"
        })
    })
})

modalStjerner.addEventListener("mouseleave", () => {
    modalStjerner.querySelectorAll("i").forEach((s, i) => {
        s.style.color = i <= valgtIndex ? "gold" : "white"
    })
})


// ---- Modal ----

function skrivAnmeldelse() {
    document.getElementById("modal").style.display = "flex"
}

function lukkModal() {
    document.getElementById("modal").style.display = "none"
    document.getElementById("navnInput").value = ""
    document.getElementById("tekstInput").value = ""
    valgtIndex = -1
    modalStjerner.querySelectorAll("i").forEach(s => {
        s.classList.replace("fa-solid", "fa-regular")
        s.style.color = "white"
    })
}


// ---- Publiser anmeldelse ----

function publiser() {
    const navn = document.getElementById("navnInput").value.trim()
    const tekst = document.getElementById("tekstInput").value.trim()
    const rating = valgtIndex + 1

    if (!navn || !tekst || rating === 0) {
        alert("Fyll inn navn, anmeldelse og velg stjerner!")
        return
    }

    const anmeldelse = { navn, tekst, rating }
    const lagrede = JSON.parse(localStorage.getItem("anmeldelser" + index) || "[]")
    lagrede.push(anmeldelse)
    localStorage.setItem("anmeldelser", JSON.stringify(lagrede))

    visAnmeldelse(anmeldelse, lagrede.length - 1)
    oppdaterGjennomsnitt()
    lukkModal()
}


// ---- Vis anmeldelse på siden ----

function visAnmeldelse(anmeldelse, index) {
    const boks = document.querySelector(".anmeldeser-boks")
    const foersteAndmeldese = boks.querySelector(".andmeldese")

    const div = document.createElement("div")
    div.classList.add("andmeldese")
    div.dataset.index = index
    div.innerHTML = `
    <div class="top">
        <p><b>Navn:</b> ${anmeldelse.navn}</p>
        <nav class="stjerner">${lagStjerner(anmeldelse.rating)}</nav>
    </div>
    <p>${anmeldelse.tekst}</p>
    <div style="display:flex; justify-content:flex-end;">
        <i class="fa-solid fa-trash-can slett" onclick="slettAnmeldelse(${index})"></i>
    </div>    `
    boks.insertBefore(div, foersteAndmeldese)
}

function lagStjerner(rating) {
    let html = ""
    for (let i = 1; i <= 5; i++) {
        html += i <= rating
            ? `<i class="fa-solid fa-star" style="color:gold; font-size:23px; margin-left:5px;"></i>`
            : `<i class="fa-regular fa-star" style="color:white; font-size:23px; margin-left:5px;"></i>`
    }
    return html
}


// ---- Slett anmeldelse ----

function slettAnmeldelse(index) {
    const lagrede = JSON.parse(localStorage.getItem("anmeldelser") || "[]")
    lagrede.splice(index, 1)
    localStorage.setItem("anmeldelser", JSON.stringify(lagrede))

    document.querySelectorAll(".andmeldese[data-index]").forEach(el => el.remove())
    lagrede.forEach((a, i) => visAnmeldelse(a, i))
    oppdaterGjennomsnitt()
}


// ---- Gjennomsnitts vurdering ----

function oppdaterGjennomsnitt() {
    const lagrede = JSON.parse(localStorage.getItem("anmeldelser") || "[]")

    const fasteRatings = []
    document.querySelectorAll(".stjerner.fast").forEach(gruppe => {
        fasteRatings.push(Number(gruppe.dataset.rating))
    })

    const alleRatings = [...fasteRatings, ...lagrede.map(a => a.rating)]

    if (alleRatings.length === 0) return

    const sum = alleRatings.reduce((total, r) => total + r, 0)
    const gjennomsnitt = (sum / alleRatings.length).toFixed(1)

    const prosent = (gjennomsnitt / 5) * 100

    document.querySelector(".gjennomsnitt-vurdering").innerHTML = `
        <p>${gjennomsnitt} / 5</p>
        <div style="position:relative; display:inline-block; font-size:40px;">
            <i class="fa-regular fa-star" style="color:gold;"></i>
            <div style="position:absolute; top:0; left:0; width:${prosent}%; overflow:hidden;">
                <i class="fa-solid fa-star" style="color:gold;"></i>
            </div>
        </div>
    `
}


// Les mer funksjon //
const lesMerKnapp = document.getElementById("seAlle")
const tekstElm = document.getElementById("les")

function lesMer() {
    if (lesMerKnapp.classList.contains("fa-caret-left")) {
        lesMerKnapp.classList.replace("fa-caret-left", "fa-caret-down")
        document.querySelector(".anmeldeser-boks").style.maxHeight = "100%"
        tekstElm.innerHTML = "Se mindre"
    } else {
        lesMerKnapp.classList.replace("fa-caret-down", "fa-caret-left")
        document.querySelector(".anmeldeser-boks").style.maxHeight = "440px"
        tekstElm.innerHTML = "Se mer"
    }
}

// Last inn lagrede anmeldelser //

JSON.parse(localStorage.getItem("anmeldelser") || "[]").forEach((a, i) => visAnmeldelse(a, i))
oppdaterGjennomsnitt()
