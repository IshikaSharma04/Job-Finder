const CLIENT_ID = "842474940931-i7tsenmvpv9jc5p35ee3f8vi5bre33tp.apps.googleusercontent.com";
const API_KEY = "AIzaSyB_73abhzAD6t4FthLxJXakTjtks3blnvA";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
let gapiInited = false;
let gisInited = false;

// Initialize Google API client
function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

// Initialize the Google API client and OAuth 2.0
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    }).then(function () {
        gapiInited = true;
        checkAuth();
    });
}

// Check if the user is signed in
function checkAuth() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
}

// Update sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById("calendarButton").style.display = "block"; // Show calendar scheduling button
    } else {
        document.getElementById("calendarButton").style.display = "none"; // Hide calendar button if not signed in
    }
}

// Sign-in the user
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Sign-out the user
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Schedule Interview in Google Calendar
async function scheduleInterview() {
    const jobTitle = document.getElementById("jobTitle").value.trim();
    const company = document.getElementById("jobLocation").value.trim();
    const interviewTime = document.getElementById("interviewTime").value.trim();

    if (!jobTitle || !company || !interviewTime) {
        alert("Please fill in all the fields to schedule the interview.");
        return;
    }

    const event = {
        "summary": `Interview for ${jobTitle} at ${company}`,
        "description": `Interview for the ${jobTitle} position at ${company}`,
        "start": {
            "dateTime": interviewTime, // Should be in ISO 8601 format: "2025-02-15T10:00:00Z"
            "timeZone": "America/New_York"
        },
        "end": {
            "dateTime": new Date(new Date(interviewTime).getTime() + 60 * 60 * 1000).toISOString(), // 1-hour interview
            "timeZone": "America/New_York"
        },
        "attendees": [
            {
                "email": "example@example.com" // Use the interviewer's email address
            }
        ],
        "reminders": {
            "useDefault": true
        }
    };

    try {
        const response = await gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event
        });

        alert(`Interview scheduled successfully! Check your Google Calendar.`);
        console.log(response);
    } catch (error) {
        alert(`Error scheduling the interview: ${error.message}`);
    }
}

// Load Google API client library
function loadGoogleAPI() {
    gapi.load("client:auth2", handleClientLoad);
}
const OPENAI_API_KEY = "Bearer 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";
const JOB_API_KEY = "32751f2b6cmshfbe6e6ff654c749p13352bjsn9f07b98121de";

// 🔍 Function to Search for Jobs
async function searchJobs() {
    const jobTitle = document.getElementById("jobTitle").value;
    const jobLocation = document.getElementById("jobLocation").value;
    const jobResults = document.getElementById("jobResults");
    const loading = document.getElementById("loading");

    jobResults.innerHTML = "";
    loading.style.display = "block";

    if (!jobTitle || !jobLocation) {
        jobResults.innerHTML = `<p style="color: red;">⚠️ Please enter both job title and location.</p>`;
        loading.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${jobTitle}%20in%20${jobLocation}&page=1&num_pages=1`, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": JOB_API_KEY,
                "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: Unable to fetch job listings.`);
        }

        const data = await response.json();
        loading.style.display = "none";

        if (!data.data || data.data.length === 0) {
            jobResults.innerHTML = `<p style="color: yellow;">❗ No job results found. Try different keywords.</p>`;
            return;
        }

        jobResults.innerHTML = "<h3>📌 Job Listings:</h3>";
        data.data.forEach(job => {
            jobResults.innerHTML += `
                <div class="job">
                    <h3>${job.job_title}</h3>
                    <p><strong>Company:</strong> ${job.employer_name}</p>
                    <p><strong>Location:</strong> ${job.job_city}, ${job.job_country}</p>
                    <p><strong>Salary:</strong> ${job.salary_info || "Not specified"}</p>
                    <a href="${job.job_apply_link}" target="_blank">🔗 Apply Now</a>
                </div>
            `;
        });

    } catch (error) {
        loading.style.display = "none";
        jobResults.innerHTML = `<p style="color: red;">❌ ${error.message}</p>`;
    }
}

// 📄 AI-Powered Cover Letter Generator
async function generateCoverLetter() {
    const coverLetterOutput = document.getElementById("coverLetterOutput");

    coverLetterOutput.innerHTML = "<div class='loading-spinner'></div> Generating cover letter...";

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",  // Change to "gpt-3.5-turbo" if needed
                prompt: "Generate a professional cover letter for a Software Engineer position at Google.",
                max_tokens: 300
            })
        });

        if (!response.ok) {
            throw new Error(`AI API Error ${response.status}: Unable to generate cover letter.`);
        }

        const data = await response.json();
        coverLetterOutput.innerHTML = `<p>${data.choices[0].text.trim()}</p>`;

    } catch (error) {
        coverLetterOutput.innerHTML = `<p style="color: red;">❌ ${error.message}</p>`;
    }
}
