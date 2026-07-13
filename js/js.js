//sticky

window.addEventListener("scroll", () => {
    const menu = document.querySelector(".menu");

    if (window.scrollY > 50){
        menu.classList.add("sticky-active");
    } else {
        menu.classList.remove("sticky-active");
    }
});



// maps

const c2 = document.getElementById("chilli2");
const c5 = document.getElementById("chilli5");
let maps = false;

function setMap(address, state) {
    const iframe = document.getElementById("map");
    iframe.src = address;
    maps = state;
    updateActive();
}

function updateActive() {
    if (maps) {
        c2.classList.remove("active");
        c5.classList.add("active");
    }
    else {
        c2.classList.add("active");
        c5.classList.remove("active");
    }
}

// hamb menu
const hamb_cont = document.getElementById("hamb_list");
const hamb_used = document.querySelectorAll('.hamb_list a');

function hamb_on() {
    hamb_cont.classList.toggle("hamb_on");
}

hamb_used.forEach(link => {
    link.addEventListener('click', () => {
        hamb_cont.classList.remove("hamb_on");
    });
});



function valt() {
    const div = document.getElementById("ideiglenesdiv");
    div.classList.toggle("kapcs");
};






                // Csomagok slide

const images = [...document.querySelectorAll('.csomag_slide_item')];
const prev = document.getElementById('prev_btn');
const next = document.getElementById('next_btn');
const h2 = document.getElementById('h2');
const p = document.getElementById('p');

let activeIndex = 0;
updateImg();

prev.addEventListener('click', () => {
    activeIndex = activeIndex - 1;
    if (activeIndex < 0){
        activeIndex = images.length - 1;
    }
    updateImg();
});
next.addEventListener('click', () => {
    activeIndex = activeIndex + 1;
    if (activeIndex > images.length - 1){
        activeIndex = 0;
    }
    updateImg();
});

function updateImg(){
    let leftIndex = activeIndex - 1;
    if (leftIndex === -1){
        leftIndex = images.length -1;
    }

    let rightIndex = activeIndex + 1;
    if (rightIndex === images.length){
        rightIndex = 0;
    }

    

    images.forEach((img, index) => {
        img.classList.remove('active',
                            'left',
                            'right',
                            'hide');

        if (activeIndex === index){
            img.classList.add('active');
        }
        if (index === rightIndex){
            img.classList.add('right');
        }
        if (index === leftIndex){
            img.classList.add('left')
        }
        if (index !== activeIndex && index !== leftIndex && index !== rightIndex){
            img.classList.add('hide')
        }
    });
};


const container = document.querySelector('.csomag_slide_cont');

container.addEventListener('click', (e) => {
    const slide = e.target.closest('.csomag_slide_item');
    if (!slide) return;
    if (slide.classList.contains('right')) {
        activeIndex += 1;
    }
    if (slide.classList.contains('left')) {
        activeIndex -= 1;
    }
    // körbeforgatás
    while (activeIndex < 0) {
        activeIndex += images.length;
    }
    while (activeIndex >= images.length) {
        activeIndex -= images.length;
    }
    updateImg();
});


//Rolam

const cimek = document.querySelectorAll('.rolam_cimek h3');
const observe = document.querySelectorAll('.observe-section');
const rolamText = document.querySelector('.rolam_text');
const indicator = document.querySelector('.indicator');

cimek.forEach((cim, index) => {
    cim.addEventListener('click', () => {

        const top =
            observe[index].getBoundingClientRect().top -
            rolamText.getBoundingClientRect().top +
            rolamText.scrollTop;

        rolamText.scrollTo({
            top,
            behavior: 'smooth'
        });

    });
});

rolamText.addEventListener('scroll', () => {

    const scrollPos = rolamText.scrollTop;

    let activeIndex = 0;

    observe.forEach((section, index) => {

        const sectionTop =
            section.offsetTop - rolamText.offsetTop;

        if (scrollPos >= sectionTop - 50) {
            activeIndex = index;
        }
    });

    const maxScroll =
        rolamText.scrollHeight - rolamText.clientHeight;

    if (scrollPos >= maxScroll - 10) {
        activeIndex = observe.length - 1;
    }

    indicator.style.top =
        `${cimek[activeIndex].offsetTop}px`;
});
//Formspree

const form = document.getElementById("my-form");
const status = document.getElementById("my-form-status");

form.addEventListener("submit", async function(event){
    /*megakadályozza a böngésző újra töltését*/
    event.preventDefault(); 
    /*Beszedjük és eltároljuk az imputokban lévő adatokat*/
    const data = new FormData(event.target); 
    /*kicseréljük a gomb feliratát*/
    const btn = form.querySelector('button');
    const originalBtnText = btn.innerText;
    btn.innerText = "Küldés folyamatban..."
    btn.disabled = true; /*kikapcsoljuk a gomb kattintás funkcióját*/

    try {
        /*elküldjük az adatokat a Formspee-nek*/
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {'Accept': 'application/json'}
        });
        //ha a küldés sikeres volt
        if(response.ok){
            status.innerHTML ="köszönjük! az üzenetet sikeresen megkaptuk";
            status.className = "status-success";
            form.reset();
        } else{
            status.innerHTML ="Hoppá! valamiért nem sokerült";
            status.className = "status-error";
        }
    }
    catch (error)
    {
        status.innerHTML ="Ellenőrizd az internet kapcsolatod!";
        status.className = "status-error";
    }
    //Visszaállítjuk a gombot az eredeti állapotába
    btn.innerText = originalBtnText;
    btn.disabled = false;
});


/* js vége !!! bővítést csak feljebb */

setMap(
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2697.3197027070355!2d19.0282250125388!3d47.464199097679156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741ddbfaca09e79%3A0xc4c6ed726deabed2!2sChilli%20Fitness%20Budapest%20-%20Bik%C3%A1s%20park!5e0!3m2!1shu!2shu!4v1777549927616!5m2!1shu!2shu",
  false
);
