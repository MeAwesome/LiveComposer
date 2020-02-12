var audioContext = undefined;
var stream = undefined;
var pitch = undefined;

setup();

async function setup(){
  audioContext = Tone.context;
  stream = await navigator.mediaDevices.getUserMedia({
    audio:true,
    video:false
  });
  audioContext.resume();
  pitch = ml5.pitchDetection("https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/", audioContext , stream, getPitch);
}

function getPitch(){
  pitch.getPitch((err, frequency) => {
    if(frequency){
      note = new Note();
      note.setData(frequency);
      document.getElementById("freq").textContent = "Current Frequency: " + note.realFrequency + "hz";
      document.getElementById("estfreq").textContent = "Current Guessed Frequency: " + note.estimatedFrequency + "hz";
      document.getElementById("key").textContent = "Current Guessed Note: " + note.noteName;
      return;
    } else {
      document.getElementById("freq").textContent = "Current Frequency: _";
      document.getElementById("estfreq").textContent = "Current Guessed Frequency: _";
      document.getElementById("key").textContent = "Current Guessed Note: _";
    }
  });
  window.requestAnimationFrame(getPitch);
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
