var media = document.querySelector("video");
var controls = document.querySelector(".controls");

var play = document.querySelector(".play");
var stop = document.querySelector(".stop");
var rwd = document.querySelector(".rwd");
var fwd = document.querySelector(".fwd");

var timerWrapper = document.querySelector(".timer");
var timer = document.querySelector(".timer span");
var timerBar = document.querySelector(".timer div");

var focusArea = document.querySelector(".focusArea");
var avgSpan = document.getElementById("avgSpan");
var maxSpan = document.getElementById("maxSpan");

var intervalFwd;
var intervalRwd;
var intervalPolling;

var autoPaused = false;
var isWinding = false;

var timesAndCoordinates = {
    Coordinates: [
        {
            time: 5,
            xAxis: 0.36,
            yAxis: 0.147,
            width: 0.1,
            height: 0.1
        },
        {
            time: 10,
            xAxis: 0.10,
            yAxis: 0.42,
            width: 0.1,
            height: 0.1
        },
        {
            time: 15,
            xAxis: 0.018,
            yAxis: 0.147,
            width: 0.1,
            height: 0.1
        },
        {
            time: 15.6,
            xAxis: 0.018,
            yAxis: 0.22,
            width: 0.1,
            height: 0.1
        },
        {
            time: 19.2,
            xAxis: 0.36,
            yAxis: 0.147,
            width: 0.022,
            height: 0.021
        },
        {
            time: 19.8,
            xAxis: 0.36,
            yAxis: 0.1835,
            width: 0.1,
            height: 0.1
        },
        {
            time: 22,
            xAxis: 0.15,
            yAxis: 0.47,
            width: 0.1,
            height: 0.1
        },
        {
            time: 27,
            xAxis: 0.36,
            yAxis: 0.1835,
            width: 0.1,
            height: 0.1
        }
    ]
}
var itemFocusIndex = -1;
var previousTime = 0;
var delta = 0;
var avgDelta = 0;
var maxDelta = 0;
var deltas = [];
console.log(timesAndCoordinates);
console.log("Initial time:" + previousTime);
console.log("Initial delta:" + delta);

media.removeAttribute("controls");
media.src = "../video/Dark_blue_clouds.mp4";
controls.style.visibility = "visible";

play.addEventListener("click", playPauseMedia);
stop.addEventListener("click", stopMedia);
media.addEventListener("ended", stopMedia);
//media.addEventListener("timeupdate", checkTime);
rwd.addEventListener("click", mediaBackward);
fwd.addEventListener("click", mediaForward);
focusArea.addEventListener("click", continuePlay);

intervalPolling = setInterval(checkTime, 100);

function playMedia() {
    isWinding = false;
    focusArea.style.display = "none";
    rwd.classList.remove("active");
    fwd.classList.remove("active");
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    if (play.classList.contains("active")) {
        play.classList.remove("active");
    }
    play.setAttribute("data-icon", "u");
    media.play();
}

function pauseMedia() {
    isWinding = false;
    rwd.classList.remove("active");
    fwd.classList.remove("active");
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
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
    isWinding = false;
    rwd.classList.remove("active");
    fwd.classList.remove("active");
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    media.pause();
    media.currentTime = 0;
    play.setAttribute("data-icon", "P");
    resetVarsOnRwFwOrStop();
}

function mediaBackward() {
    clearInterval(intervalFwd);
    fwd.classList.remove("active");
    resetVarsOnRwFwOrStop();

    if (rwd.classList.contains("active")) {
        isWinding = false;
        rwd.classList.remove("active");
        clearInterval(intervalRwd);        
        play.setAttribute("data-icon", "u");
        media.play();
    } else {
        isWinding = true;
        rwd.classList.add("active");
        play.setAttribute("data-icon", "P");
        media.pause();
        intervalRwd = setInterval(windBackward, 200);
    }
}

function mediaForward() {
    clearInterval(intervalRwd);
    rwd.classList.remove("active");
    resetVarsOnRwFwOrStop();

    if (fwd.classList.contains("active")) {
        isWinding = false;
        fwd.classList.remove("active");
        clearInterval(intervalFwd);
        play.setAttribute("data-icon", "u");
        media.play();
    } else {
        isWinding = true;
        fwd.classList.add("active");
        play.setAttribute("data-icon", "P");
        media.pause();
        intervalFwd = setInterval(windForward, 200);
    }
}

function windBackward() {
    if (media.currentTime <= 1) {
        stopMedia();
    } else {
        media.currentTime -= 1;
    }
}

function windForward() {
    if (media.currentTime >= media.duration - 1) {
        stopMedia();
    } else {
        media.currentTime += 1;
    }
}

function checkTime() {
    setPosition();
    setTime();
}

function setPosition() {
    if(isWinding===false) {
        checkDeltas();

        for (
            i = itemFocusIndex + 1;
            i < timesAndCoordinates.Coordinates.length;
            i++
        ) {
            if (
                timesAndCoordinates.Coordinates[i].time == Math.floor(media.currentTime)
            ) {
                console.log(i);
                console.log(timesAndCoordinates.Coordinates[i].time);
                console.log(media.currentTime);

                focusArea.style.display = "block";
                focusArea.style.position = "absolute";
                focusArea.style.border = "2px solid yellow";
                focusArea.style.left = timesAndCoordinates.Coordinates[i].xAxis * 100 + "%";
                focusArea.style.top = timesAndCoordinates.Coordinates[i].yAxis * 100 + "%";
                focusArea.style.width =
                    timesAndCoordinates.Coordinates[i].width * 100 + "%";
                focusArea.style.height =
                    timesAndCoordinates.Coordinates[i].height * 100 + "%";
                itemFocusIndex = i;
                autoPaused = true;
                pauseMedia();
                console.log(focusArea);
                break;
            }
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

function resetVarsOnRwFwOrStop() {
    itemFocusIndex = -1;
    previousTime = 0;
    autoPaused = false;
    if (play.classList.contains("active")) {
        play.classList.remove("active");
    }
    focusArea.style.display = "none";
}

function checkDeltas() {
    if(media.currentTime > previousTime && previousTime > 0){
        delta = media.currentTime - previousTime;
        previousTime = media.currentTime;
        console.log("Delta:" + delta);
        deltas.push(delta);
        maxDelta = deltas.reduce(function(a, b) {
            return Math.max(a, b);
        });
        avgDelta = deltas.reduce(function(a, b) {
            return a + b;
        });
        avgDelta = avgDelta/deltas.length;
        maxSpan.innerText = maxDelta.toPrecision(3).toString();
        avgSpan.innerText = avgDelta.toPrecision(3).toString();
    } else {
        previousTime = media.currentTime;
    }
}