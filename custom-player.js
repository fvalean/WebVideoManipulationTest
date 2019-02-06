var media = document.querySelector("video");
var controls = document.querySelector(".controls");
var play = document.querySelector(".play");
var stop = document.querySelector(".stop");
var timerWrapper = document.querySelector(".timer");
var timer = document.querySelector(".timer span");
var timerBar = document.querySelector(".timer div");
var focusArea = document.querySelector(".focusArea");

var autoPaused = false;

var timesAndCoordinates = {
    Coordinates: [
        {
            time: 4,
            xAxis: 0.10,
            yAxis: 0.42,
            width: 0.04,
            height: 0.035
        },
        {
            time: 7,
            xAxis: 0.018,
            yAxis: 0.147,
            width: 0.022,
            height: 0.021
        },
        {
            time: 10,
            xAxis: 0.38,
            yAxis: 0.147,
            width: 0.022,
            height: 0.021
        },
        {
            time: 15,
            xAxis: 0.018,
            yAxis: 0.22,
            width: 0.022,
            height: 0.021
        },
        {
            time: 19,
            xAxis: 0.36,
            yAxis: 0.147,
            width: 0.022,
            height: 0.021
        },
        {
            time: 22,
            xAxis: 0.36,
            yAxis: 0.1835,
            width: 0.022,
            height: 0.021
        },
        {
            time: 25,
            xAxis: 0.15,
            yAxis: 0.47,
            width: 0.04,
            height: 0.035
        },
        {
            time: 27,
            xAxis: 0.36,
            yAxis: 0.1835,
            width: 0.022,
            height: 0.021
        }
    ]
}
var itemFocusIndex = -1;

media.removeAttribute("controls");
media.src = "video/Dark_blue_clouds.mp4";
controls.style.visibility = "visible";

play.addEventListener("click", playPauseMedia);
stop.addEventListener("click", stopMedia);
media.addEventListener("ended", stopMedia);
media.addEventListener("timeupdate", checkTime);
focusArea.addEventListener("click", continuePlay);

function playMedia() {
    if (play.classList.contains("active")) {
        play.classList.remove("active");
    }
    play.setAttribute("data-icon", "u");
    media.play();
}

function pauseMedia() {
    if(autoPaused === true) {
        play.setAttribute("data-icon", "H");
        play.classList.add("active");
    } else {
        play.setAttribute("data-icon", "P");
    }
    media.pause();
}

function playPauseMedia() {
    if (media.paused) {
        if(autoPaused === false) {
            playMedia();
        }
    } else {
        pauseMedia();
    }
}

function stopMedia() {
    autoPaused = false;
    if (play.classList.contains("active")) {
        play.classList.remove("active");
    }
    media.pause();
    media.currentTime = 0;
    play.setAttribute("data-icon", "P");
    itemFocusIndex = -1;
    focusArea.style.display = "none";
}

function checkTime() {
    setPosition();
    setTime();
}

function setPosition() {
    for (
        i = itemFocusIndex + 1;
        i < timesAndCoordinates.Coordinates.length;
        i++
    ) {
        if (
            timesAndCoordinates.Coordinates[i].time == Math.floor(media.currentTime)
        ) {
            focusArea.style.display = "block";
            focusArea.style.position = "absolute";
            focusArea.style.left = timesAndCoordinates.Coordinates[i].xAxis * 100 + "%";
            focusArea.style.top = timesAndCoordinates.Coordinates[i].yAxis * 100 + "%";
            focusArea.style.width =
                timesAndCoordinates.Coordinates[i].width * 100 + "%";
            focusArea.style.height =
                timesAndCoordinates.Coordinates[i].height * 100 + "%";
            itemFocusIndex = i;
            autoPaused = true;
            pauseMedia();
            break;
        }
    }
}

function setTime() {
    var minutes = Math.floor(media.currentTime / 60);
    var seconds = Math.floor(media.currentTime - minutes * 60);
    var minuteValue;
    var secondValue;

    if (minutes < 10) {
        minuteValue = "0" + minutes;
    } else {
        minuteValue = minutes;
    }

    if (seconds < 10) {
        secondValue = "0" + seconds;
    } else {
        secondValue = seconds;
    }

    var mediaTime = minuteValue + ":" + secondValue;
    timer.textContent = mediaTime;

    var barLength =
        timerWrapper.clientWidth * (media.currentTime / media.duration);
    timerBar.style.width = barLength + "px";
}

function continuePlay() {
    focusArea.style.display = "none";
    playMedia();
}