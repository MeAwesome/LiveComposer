function Note(){
  this.realFrequency = undefined;
  this.estimatedFrequency = undefined;
  this.noteName = undefined;

  this.setData = function(frequency){
    this.realFrequency = frequency;
    this.estimatedFrequency = this._estimateFrequency(this.realFrequency);
    this.noteName = this._estimateNoteName(this.estimatedFrequency);
  }

  this._estimateFrequency = function(frequency){
    var estimation = Number(frequency.toFixed(2));
    for(var n = 0; n < 11; n++){
      for(var f = 0; f < 4; f++){
        if(estimation >= noteData[n].frequencies[f] && estimation < noteData[n + 1].frequencies[f]){
          if(Math.abs(estimation - noteData[n].frequencies[f]) <= Math.abs(estimation - noteData[n + 1].frequencies[f])){
            return noteData[n].frequencies[f];
          } else {
            return noteData[n + 1].frequencies[f];
          }
        }
      }
    }
    return estimation;
  }

  this._estimateNoteName = function(frequency){
    return noteData[Math.floor(frequency % 12)].name;
  }
}

const noteData = [
  {
    "name":"C",
    "frequencies":[
      130.82,
      261.63,
      523.25,
      1046.5,
      2093
    ]
  },
  {
    "name":"C#",
    "frequencies":[
      138.59,
      277.18,
      554.37,
      1108.73
    ]
  },
  {
    "name":"D",
    "frequencies":[
      146.83,
      293.66,
      587.33,
      1174.66
    ]
  },
  {
    "name":"D#",
    "frequencies":[
      155.56,
      311.13,
      622.25,
      1244.51
    ]
  },
  {
    "name":"E",
    "frequencies":[
      164.81,
      329.63,
      659.26,
      1318.51
    ]
  },
  {
    "name":"F",
    "frequencies":[
      174.61,
      349.23,
      698.46,
      1396.91
    ]
  },
  {
    "name":"F#",
    "frequencies":[
      185,
      369.99,
      739.99,
      1479.98
    ]
  },
  {
    "name":"G",
    "frequencies":[
      196,
      392,
      783.99,
      1567.98
    ]
  },
  {
    "name":"G#",
    "frequencies":[
      207.65,
      415.3,
      830.61,
      1661.22
    ]
  },
  {
    "name":"A",
    "frequencies":[
      220,
      440,
      880,
      1760
    ]
  },
  {
    "name":"A#",
    "frequencies":[
      233.08,
      466.16,
      932.33,
      1864.66
    ]
  },
  {
    "name":"B",
    "frequencies":[
      246.94,
      493.88,
      987.77,
      1975.53
    ]
  }
]
