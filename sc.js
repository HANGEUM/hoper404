function openPatch() {
    document.getElementById("patchModal").style.display = "flex";
}

function closePatch() {
    document.getElementById("patchModal").style.display = "none";
}

function openPopup() {
    window.open(
      'https://example.com',
      'popupWindow',
      'width=500,height=400'
    );
}

function openCM01() {
    document.getElementById("CM01").style.display = "flex";
}

function closeCM01() {
    document.getElementById("CM01").style.display = "none";
}


function openCM02() {
    document.getElementById("CM02").style.display = "flex";
}

function closeCM02() {
    document.getElementById("CM02").style.display = "none";
}


function openPLx() {
    document.getElementById("PLx").style.display = "flex";
}

function closePLx() {
    document.getElementById("PLx").style.display = "none";
}


function openPLdwx() {
    document.getElementById("PLdwx").style.display = "flex";
}

function closePLdwx() {
    document.getElementById("PLdwx").style.display = "none";
}

function openPLds() {
    document.getElementById("PLds").style.display = "flex";
}

function closePLds() {
    document.getElementById("PLds").style.display = "none";
}

const tabButtons = document.querySelectorAll('.tab-buttons button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
});