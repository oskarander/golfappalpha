// TODO: Replace with your own Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlZ-1x8gQgfTT0MsAIREtu1e6OQ4Rtg1Q",
    authDomain: "golfpicker-e033a.firebaseapp.com",
    databaseURL: "https://golfpicker-e033a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "golfpicker-e033a",
    storageBucket: "golfpicker-e033a.appspot.com",
    messagingSenderId: "572092058630",
    appId: "1:572092058630:web:8464cdecfc9d50dcec8787"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  const app = document.getElementById("app");
  let activeParticipantIndex = 0;
  let participants = [];
  let golfers = [];
  
  // Fetch participants and golfers from the Firebase database
const fetchData = async () => {
    const participantsSnapshot = await database.ref("participants").once("value");
    participants = Object.values(participantsSnapshot.val()) || [];
    const golfersSnapshot = await database.ref("golfers").once("value");
    golfers = Object.values(golfersSnapshot.val()) || [];
  
    renderApp();
  };
  
  
  const renderApp = () => {
    app.innerHTML = `
      <div class="participants">
        ${participants.map((participant, index) => `
          <div class="participant ${index === activeParticipantIndex ? "active" : ""}">
            <h3>${participant.name}</h3>
            <ul>
              ${(participant.selectedGolfers || []).map(golferId => `
                <li data-participant-index="${index}" data-golfer-id="${golferId}">${golfers.find(golfer => golfer.id === golferId).name}</li>
              `).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
      <div class="golfers">
        ${golfers.map(golfer => `
          <button class="golfer ${participants.some(p => (p.selectedGolfers || []).includes(golfer.id)) ? "disabled" : ""}" data-id="${golfer.id}">
            ${golfer.name}
          </button>
        `).join("")}
      </div>
    `;
  
    // Attach event listeners to golfer buttons
    const golferButtons = app.querySelectorAll(".golfer:not(.disabled)");
    golferButtons.forEach(button => {
      button.addEventListener("click", selectGolfer);
    });
  
    // Attach event listeners to golfer list items
    const golferListItems = app.querySelectorAll(".participant.active li");
    golferListItems.forEach(listItem => {
      listItem.addEventListener("click", removeGolfer);
    });
  };
  
  
  
  // Select a golfer for the active participant
const selectGolfer = (e) => {
    const golferId = e.target.dataset.id;
    const activeParticipant = participants[activeParticipantIndex];
  
    if (!activeParticipant.selectedGolfers) {
      activeParticipant.selectedGolfers = [];
    }
  
    if (activeParticipant.selectedGolfers.length < 2) {
      activeParticipant.selectedGolfers.push(golferId);
      database.ref(`participants/${activeParticipantIndex}`).set(activeParticipant);
      activeParticipantIndex = (activeParticipantIndex + 1) % participants.length;
      renderApp();
    }
  };
  // Remove a golfer from the active participant
const removeGolfer = (e) => {
    const participantIndex = parseInt(e.target.dataset.participantIndex, 10);
    const golferId = e.target.dataset.golferId;
  
    const participant = participants[participantIndex];
  
    if (participant.selectedGolfers) {
      participant.selectedGolfers = participant.selectedGolfers.filter(id => id !== golferId);
      database.ref(`participants/${participantIndex}`).set(participant);
      renderApp();
    }
  };
  
  
  // Initialize the app
  fetchData();
  