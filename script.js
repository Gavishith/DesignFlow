
// DesignFlow - Main JavaScript

// Get saved information or use sample data
let projects = JSON.parse(localStorage.getItem("projects")) || [
  { name: "Modern Living Room", client: "Alex", status: "In Review" },
  { name: "Dream Bedroom", client: "Sarah", status: "Approved" },
  { name: "Elegant Kitchen", client: "John", status: "In Review" }
];

let feedback = JSON.parse(localStorage.getItem("feedback")) || [];
let approvals = JSON.parse(localStorage.getItem("approvals")) || [
  { name: "Living Room Concept", status: "Pending" },
  { name: "Bedroom Concept", status: "Approved" },
  { name: "Kitchen Concept", status: "Pending" }
];

const designs = [
  ["Modern Living", "Clean lines and neutral colours.", "🛋️"],
  ["Minimal Bedroom", "Simple furniture and soft tones.", "🛏️"],
  ["Luxury Kitchen", "Elegant finishes and modern layouts.", "🍽️"],
  ["Scandinavian", "Natural materials and bright spaces.", "🌿"],
  ["Contemporary", "Modern shapes and creative details.", "🏠"],
  ["Classic Interior", "Traditional style with warm colours.", "🪑"]
];

const materials = [
  ["Oak Wood", "Natural", "High", "₹2,500"],
  ["Marble", "Smooth", "High", "₹4,000"],
  ["Granite", "Polished", "Very High", "₹3,000"],
  ["Laminate", "Matte", "Medium", "₹1,200"],
  ["Ceramic", "Glossy", "High", "₹1,800"],
  ["Bamboo", "Natural", "Medium", "₹2,000"]
];

let selectedMaterials = [];

// Save data in browser storage
function saveData() {
  localStorage.setItem("projects", JSON.stringify(projects));
  localStorage.setItem("feedback", JSON.stringify(feedback));
  localStorage.setItem("approvals", JSON.stringify(approvals));
}

// Show a selected page
document.querySelectorAll("nav button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));

    document.getElementById(button.dataset.page).classList.add("active");
    button.classList.add("active");
    document.getElementById("page-title").textContent = button.textContent.trim().replace(/^[^\w]+/, "");
  });
});

// Display project cards
function showProjects() {
  const html = projects.map((project, index) => `
    <div class="card">
      <div class="emoji">🏡</div>
      <h3>${escapeHTML(project.name)}</h3>
      <p>Client: ${escapeHTML(project.client)}</p>
      <p>Status: ${escapeHTML(project.status)}</p>
      <button class="primary" onclick="deleteProject(${index})">Delete</button>
    </div>
  `).join("");

  document.getElementById("project-list").innerHTML = html;
  document.getElementById("recent-projects").innerHTML =
    html.split('<button')[0] || "<p>No projects available.</p>";

  document.getElementById("project-count").textContent = projects.length;
  document.getElementById("pending-count").textContent =
    approvals.filter(item => item.status === "Pending").length;

  document.getElementById("feedback-project").innerHTML =
    projects.map(p => `<option>${escapeHTML(p.name)}</option>`).join("");
}

// Add a new project
document.getElementById("add-project").addEventListener("click", () => {
  document.getElementById("project-form").classList.toggle("hidden");
});

document.getElementById("project-form").addEventListener("submit", event => {
  event.preventDefault();

  projects.push({
    name: document.getElementById("project-name").value,
    client: document.getElementById("client-name").value,
    status: "In Review"
  });

  saveData();
  showProjects();
  event.target.reset();
  event.target.classList.add("hidden");
});

// Delete a project
function deleteProject(index) {
  projects.splice(index, 1);
  saveData();
  showProjects();
}

// Display design options
function showDesigns() {
  document.getElementById("design-list").innerHTML = designs.map(item => `
    <div class="card">
      <div class="emoji">${item[2]}</div>
      <h3>${item[0]}</h3>
      <p>${item[1]}</p>
    </div>
  `).join("");
}

// Display materials
function showMaterials() {
  document.getElementById("material-list").innerHTML = materials.map((item, index) => `
    <div class="card">
      <div class="emoji">◈</div>
      <h3>${item[0]}</h3>
      <p>Finish: ${item[1]}</p>
      <p>Durability: ${item[2]}</p>
      <p>Price: ${item[3]}</p>
      <button class="primary" onclick="compareMaterial(${index})">Compare</button>
    </div>
  `).join("");
}

// Select materials for comparison
function compareMaterial(index) {
  if (selectedMaterials.includes(index)) {
    selectedMaterials = selectedMaterials.filter(i => i !== index);
  } else if (selectedMaterials.length < 2) {
    selectedMaterials.push(index);
  } else {
    selectedMaterials.shift();
    selectedMaterials.push(index);
  }

  const result = selectedMaterials.map(i => {
    const item = materials[i];
    return `${item[0]} | ${item[1]} finish | ${item[2]} durability | ${item[3]}`;
  });

  document.getElementById("comparison").textContent =
    result.length ? result.join("  VS  ") : "Select materials above to compare them.";
}

// Submit client feedback
document.getElementById("feedback-form").addEventListener("submit", event => {
  event.preventDefault();

  feedback.push({
    client: document.getElementById("feedback-client").value,
    project: document.getElementById("feedback-project").value,
    message: document.getElementById("feedback-message").value
  });

  saveData();
  showFeedback();
  event.target.reset();
  alert("Feedback submitted successfully!");
});

// Display feedback
function showFeedback() {
  document.getElementById("feedback-list").innerHTML = feedback.map(item => `
    <div class="card">
      <h3>${escapeHTML(item.client)}</h3>
      <small>${escapeHTML(item.project)}</small>
      <p>${escapeHTML(item.message)}</p>
    </div>
  `).join("") || "<p>No feedback received yet.</p>";
}

// Display and update approvals
function showApprovals() {
  document.getElementById("approval-list").innerHTML = approvals.map((item, index) => `
    <div class="card">
      <div class="emoji">✓</div>
      <h3>${escapeHTML(item.name)}</h3>
      <p>Status: <b>${escapeHTML(item.status)}</b></p>
      <button class="primary" onclick="updateApproval(${index}, 'Approved')">Approve</button>
      <button class="primary" onclick="updateApproval(${index}, 'Rejected')">Reject</button>
      <button class="primary" onclick="updateApproval(${index}, 'Changes Requested')">Request Changes</button>
    </div>
  `).join("");
}

// Change approval status
function updateApproval(index, status) {
  approvals[index].status = status;
  saveData();
  showApprovals();
  showProjects();
}

// Safely display user-entered text in HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[char]);
}

// Load all sections when website opens
showProjects();
showDesigns();
showMaterials();
showFeedback();
showApprovals();
