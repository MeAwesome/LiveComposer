var audioContext;
var stream;
var pitch;

setup();

async function setup() {
  audioContext = Tone.context;
  stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  audioContext.resume();
  startPitch(stream, audioContext);
}

function startPitch(stream, audioContext) {
  pitch = ml5.pitchDetection("https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/", audioContext , stream, getPitch);
}

function getPitch() {
  pitch.getPitch((err, frequency) => {
    if(frequency){
      note = new Note();
      note.setData(frequency);
      document.getElementById("key").textContent = note.noteName;
      return;
    } else {
      document.getElementById("key").textContent = "_";
    }
  });
  window.requestAnimationFrame(getPitch);
}
