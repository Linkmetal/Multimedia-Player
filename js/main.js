let mediaData = [];
let currentTime = "00:00";
let totalTime = "00:00";
let currentMedia = 0;

if($(document).ready()){
    $.getJSON("data/media.json", function(data){
        console.log(data);
        mediaData = data;
        for(let i = 0; i < data.length; i++){
            if(data[i].type == "audio"){
                $("#playlist").append("<div class='media' id='media" + i + "'><img class='typeLogo' src='img/audio.svg'/><span>" + data[i].title + "</span>");
            }
            else{
                $("#playlist").append("<div class='media' id='media" + i + "'><img class='typeLogo' src='img/video.svg'/><span>" + data[i].title + "</span>");
            }
        }
        $(".media").click(changeMedia);
        $(".media").first().addClass("playing");
        document.getElementById("display").addEventListener('loadedmetadata', function() {
            playMedia();
        });
    });
}

function playMedia(){
    totalTime = getTotalTime();
    setInterval(changeTime, 1000);
     $("#display")[0].play();
     $("#play").css("background-image", "url('img/pause.svg')");
     $("#play").attr("onclick", "pauseMedia()");
}

function pauseMedia(){
    $("#display")[0].pause();
    $("#play").css("background-image", "url('img/play.svg')");
    $("#play").attr("onclick", "playMedia()");
}

function changeMedia(e){
    $(".media").removeClass("playing");
    $(e.currentTarget).addClass("playing");
    let id = e.currentTarget.id;
    let index = id.split("media");
    index = index[1];
    currentMedia = parseInt(index);
    $("#display").attr("src", mediaData[index].url + mediaData[index].extensions[0]);
    if(mediaData[index].type == "audio"){
        $("#display").attr("type", "audio/mp3");
    }
    else{
        $("#display").attr("type", "video/mp4");
    }
    document.getElementById("display").addEventListener('loadedmetadata', function() {
        playMedia();
    });
}

function changeTime(){
    currentTime = getCurrentTime();
    $("#time").text(currentTime + " / " + totalTime);
    $("#timeBar2").css("width",($("#display")[0].currentTime / $("#display")[0].duration) * 100 + "%");
    if($("#display")[0].currentTime == $("#display")[0].duration){
        currentMedia++;
        if(currentMedia == mediaData.length-1){
            currentMedia = 0;
        }
        $(".media")[currentMedia].click();
    }
}

function getTotalTime(){
    let seg = Math.round($("#display")[0].duration);
    let min = Math.round(seg / 60);
    let result = "";
    seg = seg % 60;
    if(min <= 9){
        result += "0" + min + ":";
    }
    else{
        result += min + ":";
    }
    if(seg <= 9){
        result += "0" + seg;
    }
    else{
        result += seg;
    }
    return result;
}

function getCurrentTime(){
    let seg = Math.round($("#display")[0].currentTime);
    let min = Math.round(seg / 60);
    let result = "";
    seg = seg % 60;
    if(min <= 9){
        result += "0" + min + ":";
    }
    else{
        result += min + ":";
    }
    if(seg <= 9){
        result += "0" + seg;
    }
    else{
        result += seg;
    }
    return result;
}

function forward(){
    $("#display")[0].currentTime = $("#display")[0].currentTime + 10;
    changeTime();
}

function backward(){
    $("#display")[0].currentTime = $("#display")[0].currentTime - 10;
    changeTime();
}

function next(){
    let aux = currentMedia + 1;
    if(aux == mediaData.length){
        aux = 0;
    }
    $(".media")[aux].click();
}

function prev(){
    let aux = currentMedia - 1;
    if(aux == -1){
        aux = mediaData.length-1;
    }
    $(".media")[aux].click();
}