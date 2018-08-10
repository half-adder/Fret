var noteMap = {
    "E": "F2,FS2,G2,GS2,A2,AS2,B2,C3,CS3,D3,DS3,E3".split(','),
    "A": "AS2,B2,C3,CS3,D3,DS3,E3,F3,FS3,G3,GS3,A3".split(','),
    "D": "DS3,E3,F3,FS3,G3,GS3,A3,AS3,B3,C4,CS4,D4".split(','),
    "G": "GS3,A3,AS3,B3,C4,CS4,D4,DS4,E4,F4,FS4,G4".split(','),
    "B": "C4,CS4,D4,DS4,E4,F4,FS4,G4,GS4,A4,AS4,B4".split(','),
    "EHi": "F4,FS4,G4,GS4,A4,AS4,B4,C5,CS5,D5,DS5,E5".split(',')
};

var SELECTED_STRING = "E";

var IS_RUNNING = false;
var NOTE_INDEX = 0;
var USE_FLATS = false;

//create a synth and connect it to the master output (your speakers)
var SYNTH = new Tone.Synth().toMaster();

$('document').ready(function () {
    makeNoteGrid(noteMap[SELECTED_STRING]);

    selectString(SELECTED_STRING);

    $(".string").on('click', function () {
        selectString($(this).text());
    });

    $("#bpm-input").val(60);
    changeBPM(60);

    $("#flats-input").prop('checked', false);

    Tone.Transport.scheduleRepeat(function (time) {
        playNote(NOTE_INDEX);
    }, "4n");

    $("#start-button").mouseup(toggleExercise);

    $("#shuffle-button").mouseup(function () {
        shuffleNotes();
    });

    $("#bpm-input").change(function () {
        changeBPM(parseInt($("#bpm-input").val()));
    });

    $("#flats-input").change(function () {
        USE_FLATS = $("#flats-input").prop('checked');
        makeNoteGrid(noteMap[SELECTED_STRING]);
    });

    footerAlign();
});

$( window ).resize(function() {
    footerAlign();
  });

function selectString(S) {
    stopExcercise();
    SELECTED_STRING = S;
    $(".string").removeClass('selected');
    $("#" + jq("str-" + S)).addClass('selected');
    makeNoteGrid(noteMap[SELECTED_STRING]);
    shuffleNotes();
}

function changeBPM(newValue) {
    minBPM = 1;
    maxBPM = 500;

    newValue = Math.max(newValue, minBPM);
    newValue = Math.min(newValue, maxBPM);

    $("#bpm-input").val(newValue);

    Tone.Transport.bpm.rampTo(newValue, 2);
}

function shuffleNotes() {
    for (let i = 0; i < Object.keys(noteMap).length; i++) {
        S = Object.keys(noteMap)[i];
        noteMap[S] = shuffle(noteMap[S]);
    }
    stopExcercise();
    makeNoteGrid(noteMap[SELECTED_STRING]);
}

function playNote(noteIndex) {
    const noteName = noteMap[SELECTED_STRING][NOTE_INDEX % noteMap[SELECTED_STRING].length];
    const prevNoteName = noteMap[SELECTED_STRING][wrapIndex(NOTE_INDEX - 1, noteMap[SELECTED_STRING].length)];

    $("#note-" + noteName).addClass("note-name-selected");
    $("#note-" + prevNoteName).removeClass("note-name-selected");

    SYNTH.triggerAttackRelease(getFixedNoteName(noteName), "8n");
    NOTE_INDEX++;
}

function getDisplayNoteName(noteName) {
    displayName = getFixedNoteName(noteName).substring(0, noteName.length - 1);
    if (USE_FLATS && displayName.length > 1){
        note = displayName.substring(0, 1).charCodeAt();
        note = String.fromCharCode(note + 1);
        if (note === "H")
            note = "A"
        displayName = note + "♭";
    } else {
        displayName = displayName.replace("#", "♯")
    }

    return displayName;
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

    for (let i = 0; i < noteMap[SELECTED_STRING].length; i++) {
        const noteName = noteMap[SELECTED_STRING][i];
        $("#note-" + noteName).removeClass("note-name-selected");
    }
    IS_RUNNING = false;
}

function makeNote(noteName) {
    const parent = $("<div>", { id: "note-" + noteName, "class": "note-name noselect" });
    parent.append("<p>" + getDisplayNoteName(noteName) + "</p>");
    return parent;
}

function makeNoteGrid(noteStrings) {
    var noteGridElement = $("#note-grid");
    noteGridElement.empty();
    for (let col = 0; col < 3; col++) {
        var rowElement = $("<div>", { "class": "row" });
        for (let row = 0; row < 4; row++) {
            rowElement.append(makeNote(noteStrings[col * 4 + row]))
        }
        noteGridElement.append(rowElement);
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

function jq(myid) {
    return myid.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
}

function footerAlign() {
    $('footer').css('display', 'block');
    $('footer').css('height', 'auto');
    var footerHeight = $('footer').outerHeight();
    $('body').css('padding-bottom', footerHeight);
    $('footer').css('height', footerHeight);
}
