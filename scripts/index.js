    //setup a polyphonic sampler
    var keys = new Tone.MultiPlayer({
        urls: {
            "BD": "./audio/505/kick.mp3",
            "SD": "./audio/505/snare.mp3",
            "HHC": "./audio/505/hh.mp3",
            "HHO": "./audio/505/hho.mp3",
            "AH": "./audio/505/agogoHigh.mp3"
        },
        volume: 0,
        fadeOut: 0.1
    }).toMaster();

    var feedbackDelaySend = keys.send("feedbackDelay", -Infinity);
    var chebySend = keys.send("cheby", -Infinity);
    var reverbSend = keys.send("reverb", -Infinity);
    var bitCrushSend = keys.send("bitCrush", -Infinity);
    var pitchShiftSend = keys.send("pitchShift", -Infinity);

    var bitCrush = new Tone.BitCrusher(2).receive("bitCrush").toMaster();

    var feedbackDelay = new Tone.FeedbackDelay({
      "delayTime" : ("1 @ 2m"),
      "feedback" : 0.5,
    }).receive("feedbackDelay").toMaster();

    var pitchShift = new Tone.PitchShift({
    	"pitch" : 2,
    	"windowSize" : 0.1,
    	"delayTime" : 0,
    	"feedback" : .4,
    }).receive("pitchShift").toMaster();

    var cheby = new Tone.Chebyshev({
      "order" : 50,
      "oversample" : "4x",
    }).receive("cheby").toMaster();

    var reverb = new Tone.Freeverb({
      "roomSize" : 0.9,
      "dampening" : 2000,
    }).receive("reverb").toMaster();

    var noteNames = ["BD", "SD", "HHC", "HHO", "AH"];

    var loop = new Tone.Sequence(function (time, col) {
        var column = matrix1.matrix[col];
        for (var i = 0; i < 6; i++) {
            if (column[i] === 1) {
                //slightly randomized velocities
                var vel = 1;
                keys.start(noteNames[i], time, 0, "32n", 0, vel);
            }
        }
    }, [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23
    ], "24n");

    Tone.Transport.start();

    nx.onload = function () {
        nx.colorize("#696969");

        matrix1.col = 24;
        matrix1.init();
        matrix1.resize($("#Content").width(), 250);
        matrix1.draw();
    }

    $(function () {

        Interface.Slider({
            name: "BPM",
            parent: $("#Beats"),
            min: 10,
            max: 300,
            value: Tone.Transport.bpm.value,
            drag: function (val) {
                Tone.Transport.bpm.value = val;

            }
        });
        Interface.Slider({
            name: "WAVESHAPER",
            parent: $("#Sliders"),
            min: -10,
            max: 100,
            drag: function (val) {
                chebySend.gain.value = val;
            }
        });

        Interface.Slider({
            name: "DELAY TIME",
            parent: $("#Sliders"),
            min: 0,
            max: 1.0,
            drag: function (val) {
                feedbackDelay.delayTime.value = val;
            }
        });

        Interface.Slider({
            name: "PITCH DELAY",
            parent: $("#Sliders"),
            min: 0,
            max: 1,
            drag: function (val) {
                pitchShift.delayTime.value = val;
            }
        });

        Interface.Slider({
            name: "REVERB DAMP",
            parent: $("#Sliders2"),
            min: 100,
            max: 8000,
            drag: function (val) {
                reverb.dampening.value = val;
            }
        });

        Interface.Slider({
            name: "REVERB GAIN",
            parent: $("#Sliders2"),
            min: 0,
            max: 10,
            drag: function (val) {
                reverbSend.gain.value = val;
            }
        });

        Interface.Button({
            parent: $("#ButtonHome"),
            text: "BITCRUSH",
            activeText: "BITCRUSH",
            type: "toggle",
            start: function (val) {
                bitCrushSend.gain.value = -20;
            },
            end: function (val) {
                bitCrushSend.gain.value = -100;
            }
        });

        Interface.Button({
            parent: $("#ButtonHome"),
            text: "PITCHSHIFT",
            activeText: "PITCHSHIFT",
            type: "toggle",
            start: function (val) {
                pitchShiftSend.gain.value = 0;
            },
            end: function (val) {
                pitchShiftSend.gain.value = -100;
            }
        });

        Interface.Button({
            parent: $("#ButtonHome"),
            text: "DELAY",
            activeText: "DELAY",
            type: "toggle",
            start: function (val) {
                feedbackDelaySend.gain.value = 0;
            },
            end: function (val) {
                feedbackDelaySend.gain.value = -100;
            }
        });

        Interface.Button({
            parent: $("#ButtonHome"),
            text: "START", activeText: "STOP", type: "toggle", key: 32, //spacebar
            start: function () {
                loop.start();
            },
            end: function () {
                loop.stop();
            }
        });

        Interface.Loader();

        $(window).on("resize", function () {
            matrix1.resize($("#Content").width(), 350);
            matrix1.draw();
        });
    });
