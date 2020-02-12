const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function Note(){
  this.frequency = undefined;
  this.noteName = undefined;

  this.setData = function(frequency){
    frequency = Number(frequency.toFixed(4));
    this.frequency = Math.round(12 * (Math.log(frequency / 440) / Math.log(2))) + 69;
    this.noteName = noteNames[this.frequency % 12];
  }
}
