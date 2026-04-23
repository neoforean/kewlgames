// some code here is adapted from https://www.w3schools.com/

// helper

async function fetchUrlText(targetUrl) {
    if (targetUrl == null || targetUrl.endsWith("undefined")) {
        return null;
    }
    let response = await fetch(targetUrl)
    if (!response.ok || response.length < 4) {
        return null;
    }
    else {
        return response.text();
    }
}

function triggerFileDownload(url, name) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name || "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function getCookie(name) {
    name = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(name, targetValue) {
    document.cookie = name + "=" + targetValue + ";path=/";
}

// page logic

async function createGameDiv(name, url, developer) {
    const gameDiv = document.createElement("div");
    const pLabel = document.createElement("p");
    gameDiv.appendChild(pLabel);

    pLabel.textContent = name;
    gameDiv.onclick = () => {
        if (playerEnabled) {
            loadGame(url, developer);
        }
        else {
            triggerFileDownload(document.baseURI + "games/content/" + url, name + ".swf");
        }
    };

    const safeName = name.replace(":", ".")
    gameDiv.style.background = `url("games/thumbnails/` + safeName + `.jpg")`;
    return gameDiv;
}

function getPageCountUrl() {
    return document.baseURI + "games/count";
}

async function getGamesPageCount() {
    if (pageCount != -1) {
        return pageCount;
    }

    let response = await fetchUrlText(getPageCountUrl())
    if (response != null) {
        try {
            const a = Number(response.trimEnd());
            return a;
        }
        catch { }
    }
    return 0;
}

function getGamesPageUrlFromNumber(pageNum) {
    return document.baseURI + "games/page" + pageNum;
}

async function getGamesPage(pageNum) {
    const result = (await fetchUrlText(getGamesPageUrlFromNumber(pageNum)));
    if (result != null) {
        return result.split("\n");
    }
    return null;
}

async function loadGame(gamePath, developer) {
    gamePathEncoded = btoa(gamePath);
    const absoluteGameUrl = document.baseURI + "play.html?game=" + gamePathEncoded + "&author=" + developer;
    document.location = absoluteGameUrl;
}

async function populateGamesGridWithGames(pageNum) {
    gamesGrid.innerHTML = "";
    const pageResult = await getGamesPage(pageNum);
    if (pageResult == null) {
        setPage(1);
    }
    (pageResult).forEach(async line => {
        line = line.trim();
        if (line != "") {
            const arr = line.split("|");
            //console.log(arr);
            let gameDiv = await createGameDiv(arr[0], arr[1], arr[2]);
            gamesGrid.appendChild(gameDiv);
        }
    });
}

function populatePagination() {
    paginationButtonsDiv.innerHTML = "";
    for (let i = 1; i <= pageCount; i++) {
        let pageButton = document.createElement("button");
        pageButton.textContent = i.toString();
        if (i == currentPage) {
            pageButton.disabled = true;
        }
        else {
            pageButton.onclick = () => {
                setPage(i);
            };
        }
        paginationButtonsDiv.appendChild(pageButton);
    }
}

async function setPage(pageNum) {
    if (pageNum == currentPage) {
        return;
    }
    currentPage = pageNum;
    populatePagination();
    await populateGamesGridWithGames(pageNum);
}

async function previousPage() {
    setPage(Math.max(1, currentPage - 1));
}

async function nextPage() {
    setPage(Math.min(pageCount, currentPage + 1));
}

function togglePlayMode() {
    playerEnabled = !playerEnabled;
    refreshPlaymodeButton();
}

function refreshPlaymodeButton() {
    if (playerEnabled) {
        playmodeButton.classList = "playmode-button on";
        setCookie("playerEnabled", "True");
    }
    else {
        playmodeButton.classList = "playmode-button off";
        setCookie("playerEnabled", "False");
    }
}

function downloadWholeCurrentPage() {
    const originalPlayerEnabled = playerEnabled;
    if (playerEnabled) {
        togglePlayMode();
    }

    if (confirm("If your browser asks you if you want to let this website \"download multiple files\", press allow!\n\nIt is also possible your browser will limit concurrent downloads, in which case, you may need to use another browser, or download the .swf files manually.\n\nPress \"OK\" to continue!")) {
        gamesGrid.childNodes.forEach((gameNode, index) => {
            setTimeout(() => {
                gameNode.click();
            }, index * 250);
        });
    }

    if (originalPlayerEnabled) {
        togglePlayMode();
    }
}

function updatePlaymodeButtonBasedOnCookie() {
    let playerEnabledCookieValue = getCookie("playerEnabled");
    if (playerEnabledCookieValue != "True" && playerEnabledCookieValue != "False") {
        playerEnabledCookieValue = "True";
        setCookie("playerEnabled", playerEnabledCookieValue);
    }
    playerEnabled = Boolean(playerEnabledCookieValue)
    refreshPlaymodeButton();
}

let gamesGrid = null;
let paginationButtonsDiv = null;
let currentPage = -1;
let pageCount = -1;
let playerEnabled = false;
let playmodeButton = null;

addEventListener("DOMContentLoaded", async (event) => {
    gamesGrid = document.getElementsByClassName("games-grid")[0];
    paginationButtonsDiv = document.getElementsByClassName("pagination-buttons")[0];
    playmodeButton = document.getElementsByClassName("playmode-button")[0];
    updatePlaymodeButtonBasedOnCookie();
    pageCount = await getGamesPageCount();
    setPage(1);
})