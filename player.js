function openFullscreen() {
  if (playerContainer.requestFullscreen) {
    playerContainer.requestFullscreen();
  } else if (playerContainer.webkitRequestFullscreen) { // Safari
    playerContainer.webkitRequestFullscreen();
  } else if (playerContainer.msRequestFullscreen) { // IE11
    playerContainer.msRequestFullscreen();
  }
}

const playerContainer = document.getElementsByClassName("player-container")[0];
const authorLabel = document.getElementById("author")

const gameSwfSuffix = atob(new URLSearchParams(window.location.search).get('game'));
const authorName = new URLSearchParams(window.location.search).get('author');

authorLabel.innerText = authorName.replace(",", "\n");

const playUrlNoParams = document.location.toString().split("?")[0];
let absoluteGameUrl = playUrlNoParams.substring(0, playUrlNoParams.length - "play.html".length) + "/games/content/" + gameSwfSuffix;
absoluteGameUrl = absoluteGameUrl.replace("//ga", "/ga");
let swfDir = absoluteGameUrl.substring(0, absoluteGameUrl.lastIndexOf('/') + 1);
swfDir = swfDir.replace("//ga", "/ga");

window.RufflePlayer = window.RufflePlayer || {};
window.addEventListener("load", (event) => {
  const ruffle = window.RufflePlayer.newest();
  const player = ruffle.createPlayer();
  playerContainer.appendChild(player);
  player.load({
    url: absoluteGameUrl,
    base: swfDir,
    backgroundColor: "#000",
    allowScriptAccess: "always",
  });
  player.style.height = "100%";
  player.style.width = "100%";
});

function closeRuffleReminder() {
  const reminderP = document.getElementById("x");
  reminderP.parentNode.removeChild(x);
}
