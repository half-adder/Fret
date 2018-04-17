// Note names
var noteList = "A,AS,B,C,CS,D,DS,E,F,FS,G,GS".split(',');

var IS_RUNNING = false;
var NOTE_INDEX = 0;

//create a synth and connect it to the master output (your speakers)
var SYNTH = new Tone.Synth().toMaster();

$('document').ready(function () {
    makeNoteGrid(noteList);
    $("#bpm-input").val(60);

    changeBPM(60);
    Tone.Transport.scheduleRepeat(function(time){
        playNote(NOTE_INDEX);
    }, "4n");

    $("#start-button").mouseup(toggleExercise);
    $("#shuffle-button").mouseup(function() {
        shuffleNotes();
    });
    $("#bpm-input").change(function() {
        changeBPM(parseInt($("#bpm-input").val()));
    });
});

function changeBPM(newValue) {
    Tone.Transport.bpm.rampTo(newValue, 2);
}

function shuffleNotes() {
    stopExcercise();
    noteList = shuffle(noteList);
    makeNoteGrid(noteList);
}

function playNote(noteIndex) {
    const noteName = noteList[NOTE_INDEX % noteList.length];
    const prevNoteName = noteList[wrapIndex(NOTE_INDEX - 1, noteList.length)];

    $("#note-" + noteName).addClass("note-name-selected");
    $("#note-" + prevNoteName).removeClass("note-name-selected");

    SYNTH.triggerAttackRelease(fixNoteName(noteName) + "3", "8n");
    NOTE_INDEX++;
}

function fixNoteName(noteName) { 
    console.log(noteName);
    if (noteName.substr(noteName.length - 1) === "S") {
        return noteName.slice(0,1) + "#";
    } else {
        return noteName;
    }
}

function toggleExercise() {
    if (!IS_RUNNING) {
        startExercise();
    } else {
        stopExcercise();
    }
}

function startExercise() {
    Tone.Transport.start();
    $("#start-button").text("Stop");
    NOTE_INDEX = 0;
    IS_RUNNING = true;
}

function stopExcercise() {
    Tone.Transport.stop();
    $("#start-button").text("Start");
    NOTE_INDEX = 0;

    for (let i = 0; i < noteList.length; i++) {
        const noteName = noteList[i];
        $("#note-" + noteName).removeClass("note-name-selected");
    }
    IS_RUNNING = false;
}

function makeNote(noteName) {
    const parent = $("<div>", {id: "note-" + noteName, "class": "note-name noselect"});
    parent.append("<p>" + fixNoteName(noteName) + "</p>");
    return parent;
}

function makeNoteGrid(noteStrings) {
    const noteGridElement = $("#note-grid");
    noteGridElement.empty();
    for (let i = 0; i < noteStrings.length; i++) {
        const noteString = noteStrings[i];
        
        noteGridElement.append(makeNote(noteString));
    }
}

function wrapIndex(i, i_max) {
    return ((i % i_max) + i_max) % i_max;
 }

 function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }