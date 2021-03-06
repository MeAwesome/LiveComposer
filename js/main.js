var audioContext = undefined;
var stream = undefined;
var pitch = undefined;
var windowFocused = true;
var volumeLevel = undefined;
var prevVolumeLevel = undefined;
var hitDetected = false;
var wasInstrument = false;
const volumeLevelDistance = 5;

var notesHit = [];
var recentNotes = [];

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
      volumeLevel = Math.round(values / length);
      if(prevVolumeLevel == undefined){
        prevVolumeLevel = volumeLevel;
      }
      if(volumeLevel > prevVolumeLevel && (volumeLevel - prevVolumeLevel) >= volumeLevelDistance){
        hitDetected = true;
        setTimeout(() => {
          hitDetected = false;
        }, 100);
      }
      prevVolumeLevel = volumeLevel;
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
      if(wasInstrument){
        notesHit.push(note.noteName);
        wasInstrument = false;
      }
      document.getElementById("noteshit").textContent = "Notes Hit: " + notesHit;
      recentNotes.push(note.noteName);
    } else {
      document.getElementById("freq").textContent = "Current Frequency: _";
      document.getElementById("estfreq").textContent = "Current Guessed Frequency: _";
      document.getElementById("key").textContent = "Current Guessed Note: _";
      recentNotes.push(" ");
    }
    if(recentNotes.length > 10){
      recentNotes.shift();
    }
    document.getElementById("vol").textContent = "Current Volume: " + volumeLevel;
    document.getElementById("hit").textContent = "Hit Detected: " + hitDetected;
    document.getElementById("recnotes").textContent = "Recent Notes: " + recentNotes;
  });
  if(windowFocused == true){
    window.requestAnimationFrame(getPitch);
  }
}

const options = { probabilityThreshold: 0.5 };
const classifier = ml5.soundClassifier('https://teachablemachine.withgoogle.com/models/AdICwmWf/model.json', options, modelReady);

function modelReady() {
  // classify sound
  classifier.classify(gotResult);
}

function gotResult(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(result);
  if(result[0].label == "Marimba"){
    wasInstrument = true;
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
