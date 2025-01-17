// Get the video element and button
const video = document.getElementById("video");
const captureButton = document.getElementById("captureButton");
const capturedDataDiv = document.getElementById("capturedData");
const nameInput = document.getElementById("nameInput");

let capturedData = []; // Array to store captured images and names

// Load the face-api.js models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(webCam);

// Start the webcam feed
function webCam() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: true, 
      })
      .then((stream) => {
        video.srcObject = stream;
        console.log("Webcam is running...");
      })
      .catch((error) => {
        console.error("Error accessing webcam: ", error);
        alert("There was an issue accessing the webcam. Please make sure you have granted permission.");
      });
  } else {
    console.error("Webcam access is not supported in this browser.");
    alert("Webcam access is not supported in this browser.");
  }
}

// Run the face detection when the video starts playing
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  const container = document.querySelector(".container"); 
  container.append(canvas);

  faceapi.matchDimensions(canvas, { width: video.width, height: video.height });

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    const resizedResults = faceapi.resizeResults(detections, {
      width: video.width,
      height: video.height,
    });

    faceapi.draw.drawDetections(canvas, resizedResults);
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
    faceapi.draw.drawFaceExpressions(canvas, resizedResults);

    resizedResults.forEach((detection) => {
      const box = detection.detection.box;
      const label = `${Math.round(detection.age)} year old ${detection.gender}`;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: label,
      });
      drawBox.draw(canvas);
    });

    console.log(detections);
  }, 100);
});

// Capture image and store data with timestamp when button is clicked
captureButton.addEventListener("click", () => {
  const now = new Date();
  const timestamp = now.toLocaleString("en-US", {
    hour12: true, // 12-hour format with AM/PM
    weekday: "short", // Optional: Shows the day of the week (e.g., "Mon")
    year: "numeric", // Full year
    month: "short", // Shortened month name (e.g., "Jan")
    day: "numeric", // Day of the month
    hour: "numeric", // Hour without leading zeros (e.g., 1, 2, 12)
    minute: "2-digit", // 2 digits for minutes (e.g., 01, 30, 59)
    second: "2-digit", // 2 digits for seconds (e.g., 03, 30, 59)
  });

  const name = nameInput.value.trim() || "Unknown";

  // Capture the image from the video
  const canvasCapture = document.createElement("canvas");
  canvasCapture.width = video.width;
  canvasCapture.height = video.height;
  const ctx = canvasCapture.getContext("2d");
  ctx.drawImage(video, 0, 0, canvasCapture.width, canvasCapture.height);

  // Convert canvas to image data URL
  const imageURL = canvasCapture.toDataURL();

  // Store captured data
  capturedData.push({
    name: name,
    timestamp: timestamp,
    image: imageURL,
  });

  // Display the stored data
  displayCapturedData();

  // Optionally: Store data in localStorage for persistence across sessions
  localStorage.setItem("capturedData", JSON.stringify(capturedData));

  console.log("Captured image and stored data", { name, timestamp });
});

// Display the stored captured data
function displayCapturedData() {
  capturedDataDiv.innerHTML = "";
  capturedData.forEach((data, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("captured-item");

    const imgElement = document.createElement("img");
    imgElement.src = data.image;
    imgElement.alt = "Captured Image";

    // Add Delete Button for each item
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => deleteCapturedData(index));

    itemDiv.innerHTML = ` 
      <strong>Entry ${index + 1}</strong><br>
      Name: ${data.name} <br>
      Timestamp: ${data.timestamp}
    `;
    itemDiv.appendChild(imgElement);
    itemDiv.appendChild(deleteButton); // Append the delete button
    capturedDataDiv.appendChild(itemDiv);
  });
}

// Delete captured data entry
function deleteCapturedData(index) {
  // Remove the entry from the array
  capturedData.splice(index, 1);

  // Update the displayed data
  displayCapturedData();

  // Update localStorage
  localStorage.setItem("capturedData", JSON.stringify(capturedData));
}

// Load captured data from localStorage if available
window.onload = () => {
  const storedData = localStorage.getItem("capturedData");
  if (storedData) {
    capturedData = JSON.parse(storedData);
    displayCapturedData();
  }
};
