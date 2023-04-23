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
let participants = [];
let golfers = [];

// Fetch participants and golfers from the Firebase database
const fetchData = async () => {
    const participantsSnapshot = await database.ref("participants").once("value");
    participants = Object.values(participantsSnapshot.val()) || [];
    const golfersSnapshot = await database.ref("golfers").once("value");
    golfers = Object.values(golfersSnapshot.val()) || [];

    renderLeaderboard();
};

const renderLeaderboard = () => {
// Calculate the scores and total points for each participant
participants.forEach(participant => {
    participant.score = 0;
    if (participant.selectedGolfers) {
      participant.selectedGolfers.forEach(golferId => {
        const golfer = golfers.find(g => g.id === golferId);
        if (golfer) {
          participant.score += golfer.score;
        }
      });
    }
    participant.totalPoints = participant.score;
  });
  

    // Sort participants by score
    participants.sort((a, b) => a.score - b.score);

    // Render the leaderboard
    app.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Participant</th>
            <th>Total Points</th>
            <th>Chosen Golfers</th>
          </tr>
        </thead>
        <tbody>
          ${participants
            .map((participant, index) => {
              const golfersList = participant.selectedGolfers
                .map(
                  (golferId) =>
                    `${golfers.find((golfer) => golfer.id === golferId).name}`
                )
                .join(", ");
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${participant.name}</td>
                  <td>${participant.totalPoints}</td>
                  <td>${golfersList}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;
};

// Initialize the leaderboard
fetchData();
