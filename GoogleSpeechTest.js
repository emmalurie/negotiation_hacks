var fs = require('fs');

var negotiate = function () {

  if(fs.existsSync('../../downloads/video.webm')){
//var fs = require('fs'),
cloudconvert = new (require('cloudconvert'))('hwcepP9agCGP-8xWIa-lqjhc8KnPjAtnegMRNSy3q1qDHLow25ckwIueVyx73PWXr2oV0b9MxkBRoskc9VPVZg');

fs.createReadStream('../../downloads/video.webm')
.pipe(cloudconvert.convert({
  "inputformat": "webm",
  "outputformat": "flac",
  "input": "upload",
  "wait": "true"
}))

.pipe(fs.createWriteStream('outputfile.flac')).on('finish', function(file){


// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');

// Your Google Cloud Platform project ID
const projectId = 'bamboo-depth-158505';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The name of the audio file to transcribe
const fileName = 'outputfile.flac';

// The audio file's encoding and sample rate
const options = {
  encoding: 'FLAC',
  sampleRate: 48000
};

// Detects speech in the audio file
speechClient.recognize(fileName, options)
.then((results) => {
  const transcription = results[0];
  fs.writeFile('log.txt', transcription, function (err) {
    if (err) {
  // append failed
} else {
  // done
}
})
  console.log(`Transcription: ${transcription}`);
});
});

fs.unlinkSync('../../downloads/video.webm');
};

setTimeout(negotiate, 1000);
console.log("else");
};
negotiate();
