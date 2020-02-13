var audioContext = undefined;
var stream = undefined;
var pitch = undefined;
var windowFocused = true;

setup();

async function setup(){
  audioContext = Tone.context;
  stream = await navigator.mediaDevices.getUserMedia({
    audio:true,
    video:false
  });
  analyser = audioContext.createAnalyser();
  microphone = audioContext.createMediaStreamSource(stream);
  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;
  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
  javascriptNode.onaudioprocess = function() {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;
      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += (array[i]);
      }
      var average = values / length;
    console.log(Math.round(average));
  }
  audioContext.resume();
  pitch = ml5.pitchDetection("https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/", audioContext , stream, getPitch);
}

function getPitch(){
  pitch.getPitch((err, frequency) => {
    if(frequency != null){
      note = new Note();
      note.setData(frequency);
      document.getElementById("freq").textContent = "Current Frequency: " + note.realFrequency + "hz";
      document.getElementById("estfreq").textContent = "Current Guessed Frequency: " + note.estimatedFrequency + "hz";
      document.getElementById("key").textContent = "Current Guessed Note: " + note.noteName;
    } else {
      document.getElementById("freq").textContent = "Current Frequency: _";
      document.getElementById("estfreq").textContent = "Current Guessed Frequency: _";
      document.getElementById("key").textContent = "Current Guessed Note: _";
    }
  });
  if(windowFocused == true){
    window.requestAnimationFrame(getPitch);
  }
}

window.onblur = function(){
  audioContext.suspend();
  audioContext.suspend().then(() => {
    windowFocused = false;
    console.log("user away");
  });
}

window.onfocus = function(){
  audioContext.resume();
  audioContext.resume().then(() => {
    windowFocused = true;
    console.log("user back");
    window.requestAnimationFrame(getPitch);
  });
}
/*
const options = { probabilityThreshold: 0.7 };
const classifier = ml5.soundClassifier('SpeechCommands18w', options, modelReady);

function modelReady() {
  // classify sound
  classifier.classify(gotResult);
}

function gotResult(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  // log the result
  console.log(result);
}
*/
