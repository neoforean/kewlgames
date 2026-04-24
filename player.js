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

// check whether it's an .html file
if (absoluteGameUrl.endsWith("index.html")) {
  // html file detected
  const iframe = document.createElement('iframe');
  iframe.src = swfDir;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.frameBorder = '0';
  playerContainer.appendChild(iframe);
}
else {
  // swf file detected
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
}