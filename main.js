// Note names
var noteList = "A2,AS2,B2,C2,CS2,D2,DS2,E3,F2,FS2,G2,GS2".split(',');

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

    SYNTH.triggerAttackRelease(getFixedNoteName(noteName), "8n");
    NOTE_INDEX++;
}

function getDisplayNoteName(noteName) {
    return getFixedNoteName(noteName).substring(0, noteName.length - 1);
}

function getFixedNoteName(noteName) {
    return noteName.replace("S", "#");
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
    parent.append("<p>" + getDisplayNoteName(noteName) + "</p>");
    return parent;
}

function makeNoteGrid(noteStrings) {
    var noteGridElement = $("#note-grid");
    noteGridElement.empty();
    for (let col = 0; col < 4; col++) {
        var column = $("<div>", {"class": "col"});
        for (let row = 0; row < 3; row++) {
            column.append(makeNote(noteStrings[row*4 + col]))
        }
        noteGridElement.append(column);
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