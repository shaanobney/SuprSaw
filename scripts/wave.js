var fft = new Tone.Analyser("fft", 32);
//get the waveform data for the audio
var waveform = new Tone.Analyser("waveform", 1024);
var player = new Tone.Player({
  "url" : "./audio/FWDL.mp3",
  "loop" : true
}).fan(fft, waveform).toMaster();

var fftContext = $("<canvas>",{
  "id" : "fft"
}).appendTo("#Content").get(0).getContext("2d");
function drawFFT(values){
  fftContext.clearRect(0, 0, canvasWidth, canvasHeight);
  var barWidth = canvasWidth / fft.size;
  for (var i = 0, len = values.length; i < len; i++){
    var val = values[i] / 255;
    var x = canvasWidth * (i / len);
    var y = val * canvasHeight;
    fftContext.fillStyle = "rgba(0, 0, 0, " + val + ")";
    fftContext.fillRect(x, canvasHeight - y, barWidth, canvasHeight);
  }
}
//the waveform data
var waveContext = $("<canvas>", {
  "id" : "waveform"
}).appendTo("#Content").get(0).getContext("2d");
var waveformGradient;
function drawWaveform(values){
  //draw the waveform
  waveContext.clearRect(0, 0, canvasWidth, canvasHeight);
  var values = waveform.analyse();
  waveContext.beginPath();
  waveContext.lineJoin = "round";
  waveContext.lineWidth = 6;
  waveContext.strokeStyle = waveformGradient;
  waveContext.moveTo(0, (values[0] / 255) * canvasHeight);
  for (var i = 1, len = values.length; i < len; i++){
    var val = values[i] / 255;
    var x = canvasWidth * (i / len);
    var y = val * canvasHeight;
    waveContext.lineTo(x, y);
  }
  waveContext.stroke();
}
//size the canvases
var canvasWidth, canvasHeight;
function sizeCanvases(){
  canvasWidth = $("#fft").width();
  canvasHeight = $("#fft").height();
  waveContext.canvas.width = canvasWidth;
  fftContext.canvas.width = canvasWidth;
  waveContext.canvas.height = canvasHeight;
  fftContext.canvas.height = canvasHeight;
  //make the gradient
  waveformGradient = waveContext.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  waveformGradient.addColorStop(0, "#ddd");
  waveformGradient.addColorStop(1, "#000");
}
sizeCanvases();
$(window).resize(sizeCanvases);
function loop(){
  requestAnimationFrame(loop);
  //get the fft data and draw it
  var fftValues = fft.analyse();
  drawFFT(fftValues);
  //get the waveform valeus and draw it
  var waveformValues = waveform.analyse();
  drawWaveform(waveformValues);
}
loop();
});
