var funkyDelay = new Tone.FeedbackDelay({
  "delayTime" : 0,
  "feedback" : 0,
}).toMaster();

var pitchShifty = new Tone.PitchShift({
  "pitch" : 2,
  "windowSize" : 0.1,
  "delayTime" : 0.3,
  "feedback" : .4,
}).toMaster();

var synth = new Tone.DuoSynth({
  "vibratoAmount" : 0.1,
  "vibratoRate" : 5,
  "portamento" : 0.1,
  "harmonicity" : 1.005,
  "volume" : 5,
  "voice0" : {
    "volume" : 0,
    "oscillator" : {
      "type" : "fatsawtooth",
      "count" : 3,
      "spread" : 30
    },
    "filter" : {
      "Q" : 5,
      "type" : "lowpass",
      "rolloff" : -12
    },
    "envelope" : {
      "attack" : 0.3,
      "decay" : 0.25,
      "sustain" : 0.6,
      "release" : 2
    },
    "filterEnvelope" : {
      "attack" : 0.5,
      "decay" : 0.5,
      "sustain" : 0.6,
      "release" : 2,
      "baseFrequency" : 400,
      "octaves" : 4
    }
  },
  "voice1" : {
    "volume" : 0,
    "oscillator" : {
      "type" : "fatsawtooth",
      "count" : 3,
      "spread" : 30
    },
    "filter" : {
      "Q" : 4,
      "type" : "lowpass",
      "rolloff" : -24
    },
    "envelope" : {
      "attack" : 0.25,
      "decay" : 2,
      "sustain" : 0.5,
      "release" : 1.2
    },
    "filterEnvelope" : {
      "attack" : 0.5,
      "decay" : 0.5,
      "sustain" : 1.7,
      "release" : 2,
      "baseFrequency" : 300,
      "octaves" : 4.5
    }
  },
  volume: 0,
}).connect(funkyDelay).toMaster();

var funkyDelaySend = synth.send("feedbackDelay", -Infinity);

var pitchShiftySend = synth.send("pitchShift", -Infinity);

var synthNotes = ["C1","E1", "G1", "A1",
          "C2", "E2", "G2", "A2",
          "C3", "D3", "E3", "G3", "A3", "B3",
          "C4", "D4", "E4", "G4"];

  $(function(){

    Interface.Button({
        parent: $("#ButtonHome2"),
        text: "DLY",
        activeText: "DLY",
        type: "toggle",
        start: function (val) {
            funkyDelay.delayTime.value = "8n";
            funkyDelay.feedback.value = .7;        },
        end: function (val) {
            funkyDelay.delayTime.value = 0;
            funkyDelay.feedback.value = 0;
        }
    });

    Interface.Button({
        parent: $("#ButtonHome2"),
        text: "PS",
        activeText: "PS",
        type: "toggle",
        start: function (val) {
            pitchShiftySend.gain.value = 0;
        },
        end: function (val) {
            pitchShiftySend.gain.value = -100;
        }
    });

    var lastSynthNote = synthNotes[0];
    Interface.Dragger({
      container : "Content",
      x : {
        options : synthNotes,
        drag : function(note){
          synth.setNote(note);
          lastSynthNote = note;
        }
      },
      y : {
        min : 0,
        max : 2,
        drag : function(val){
          synth.vibratoAmount.value = val;
        }
      },
      start : function(){
        synth.triggerAttack(lastSynthNote);
      },
      end : function(){
        synth.triggerRelease();
      },
      name : "SUPRSAW"
    });

  });
