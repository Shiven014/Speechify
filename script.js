
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
      console.log('Voices loaded:', voices); // Log available voices
    });
  } else {
    console.log('Voices loaded:', voices); // Log available voices immediately
  }
}

loadVoices();

// Function to handle speaking
function speak(text) {
  if (text.trim() === '') {
    console.log('No text to speak');
    return;
  }

  if (!isSpeaking) {
    // Create a new SpeechSynthesisUtterance instance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.voice = voices.length > 0 ? voices[0] : null; // Check for available voices

    // Log voice info for debugging
    if (!currentUtterance.voice) {
      console.error('No voice available for speech synthesis.');
      return;
    }

    currentUtterance.rate = 1.0; // Set speaking rate
    currentUtterance.pitch = 1.0; // Set pitch

    isSpeaking = true;
    console.log('Speaking:', text); // Log the text being spoken
    synth.speak(currentUtterance);

    currentUtterance.onend = () => {
      console.log('Speech finished');
      isSpeaking = false; // Reset speaking state after speech finishes
      currentUtterance = null; // Reset the utterance for future use
    };

    currentUtterance.onerror = (event) => {
      // Handle error during speech synthesis
      console.error('Error occurred during speech synthesis:', event);
      isSpeaking = false;
      currentUtterance = null; // Reset the utterance to avoid further issues
    };
  } else {
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
  } else {
    console.log('Speech is currently in progress. Please stop it before speaking again.');
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
  
  reader.onerror = () => {
    console.log('Error reading the file.');
  };

  if (file.type === 'text/plain') {
    reader.readAsText(file);
  } else {
    console.log('Please upload a valid .txt file.');
  }
}

// Handle image upload, extract text using OCR, and speak
function handleImageUpload(file) {
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const imageData = event.target.result;
    console.log("Image Data: ", imageData);  // Log the base64 image data
    
    // Ensure Tesseract.js is available
    if (typeof Tesseract === 'undefined') {
      console.error('Tesseract.js is not loaded.');
      return;
    }
    
    try {
      // Attempt to recognize text from the image using Tesseract.js
      Tesseract.recognize(
        imageData, 
        'eng',  // Use English OCR
        { logger: (info) => console.log(info) }  // Log the OCR progress
      ).then(({ data: { text } }) => {
        console.log("Extracted Text: ", text);  // Log the extracted text
        if (text.trim() !== '') {
          speak(text);  // Speak the extracted text
        } else {
          console.log('No text found in the image.');
        }
      }).catch((error) => {
        console.error('Tesseract recognition failed:', error);
      });
    } catch (err) {
      console.error('Tesseract.js failed to process the image:', err);
    }
  };
  
  reader.onerror = () => {
    console.log('Error reading the image file.');
  };
  
  if (file.type.startsWith('image/')) {
    reader.readAsDataURL(file);  // Convert the image file to a base64 data URL
  } else {
    console.log('Please upload a valid image file.');
  }
}

// Event listener for file upload
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!isSpeaking && file) {
    handleFileUpload(file);
  }
});

// Event listener for image upload
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!isSpeaking && file) {
    handleImageUpload(file);
  }
});

// Stop the speech when stop button is clicked
stopButton.addEventListener('click', () => {
  if (synth.speaking) {
    synth.cancel(); // Stops the speech immediately
    isSpeaking = false; // Reset speaking state after stopping
    currentUtterance = null; // Clear the current utterance
    console.log('Speech stopped');
  } else {
    console.log('No speech to stop.');
  }
});
