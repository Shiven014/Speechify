const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const imageInput = document.getElementById('imageInput');
const speechifyButton = document.getElementById('speechifyButton');
const stopButton = document.getElementById('stopButton');
const output = document.getElementById('output');

const synth = window.speechSynthesis;
let voices = [];
let isSpeaking = false; // Track speaking state
let currentUtterance = null; // Store the current utterance

// Load voices when available
function loadVoices() {
  voices = synth.getVoices();
  if (voices.length === 0) {
    synth.addEventListener('voiceschanged', () => {
      voices = synth.getVoices();
    });
  }
}

loadVoices();

// Function to handle speaking
function speak(text) {
  if (!isSpeaking && text.trim() !== '') {
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.voice = voices[0]; // Set default voice
    currentUtterance.rate = 1.0; // Set speaking rate
    currentUtterance.pitch = 1.0; // Set pitch

    isSpeaking = true;
    synth.speak(currentUtterance);

    currentUtterance.onend = () => {
      console.log('Speech finished');
      isSpeaking = false; // Reset speaking state after speech finishes
    };

    currentUtterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      isSpeaking = false;
    };
  } else if (synth.speaking) {
    console.log('Speech is already in progress');
  }
}

// Handle text input and speak when button is clicked
speechifyButton.addEventListener('click', () => {
  if (!isSpeaking) {
    const textToSpeak = textInput.value;
    if (textToSpeak) {
      speak(textToSpeak);
    } else {
      console.log('Please enter some text.');
    }
  }
});

// Handle file upload and speak its content
function handleFileUpload(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const fileText = event.target.result;
    if (fileText.trim() !== '') {
      speak(fileText);
    } else {
      console.log('The uploaded file is empty.');
    }
  };
  reader.readAsText(file);
}

// Handle image upload, extract text using OCR, and speak
function handleImageUpload(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const imageData = event.target.result;
    // Replace `yourOCRlibrary` with actual OCR library function
    yourOCRlibrary.extractTextFromImage(imageData).then((text) => {
      if (text.trim() !== '') {
        speak(text);
      } else {
        console.log('No text found in the image.');
      }
    }).catch((error) => {
      console.error('Error extracting text from image:', error);
    });
  };
  reader.readAsDataURL(file);
}

// Event listener for file upload
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!isSpeaking && file && file.type === 'text/plain') {
    handleFileUpload(file);
  } else {
    console.log('Please upload a valid .txt file.');
  }
});

// Event listener for image upload
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!isSpeaking && file && file.type.startsWith('image/')) {
    handleImageUpload(file);
  } else {
    console.log('Please upload a valid image file.');
  }
});

// Stop the speech when stop button is clicked
stopButton.addEventListener('click', () => {
  if (synth.speaking) {
    synth.cancel(); // Stops the speech immediately
    isSpeaking = false; // Reset speaking state after stopping
    console.log('Speech stopped');
  }
});   