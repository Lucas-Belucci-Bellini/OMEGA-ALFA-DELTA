const botao = document.getElementById("botao");
const audio = document.getElementById("audioPegadinha");

botao.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play();
});