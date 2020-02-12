var audioContext;
var stream;
var pitch;

setup();

async function setup() {
  audioContext = new AudioContext();
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
      var note = new Note();
      note.setData(frequency);
      document.getElementById("key").textContent = note.noteName;
      return;
    } else {
      document.getElementById("key").textContent = "_";
    }
  });
  window.requestAnimationFrame(getPitch);
}

//var synth = new Tone.FMSynth().toMaster()

//schedule a series of notes, one per second
//synth.triggerAttackRelease('C4', '4n', '8n')
//synth.triggerAttackRelease('E4', '8n', Tone.Time('4n') + Tone.Time('8n'))
//synth.triggerAttackRelease('G4', '16n', '2n')
//synth.triggerAttackRelease('B4', '16n', Tone.Time('2n') + Tone.Time('8t'))
//synth.triggerAttackRelease('G4', '16', Tone.Time('2n') + Tone.Time('8t')*2)
//synth.triggerAttackRelease('E4', '2n', '0:3')
