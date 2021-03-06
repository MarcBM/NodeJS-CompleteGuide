let time = 1;
let played = false;

const countUp = setInterval(() => {
    document.getElementById("time").innerHTML = "Time Active: " + time + "s";

    if (time >= 10 && !played) {
        document.getElementById("concerto").play();
        played = true;
    }

    time++;
}, 1000);