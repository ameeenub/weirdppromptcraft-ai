const promptInput = document.getElementById("promptInput");
const platformSelect = document.getElementById("platformSelect");
const modeSelect = document.getElementById("modeSelect");
const generateBtn = document.getElementById("generateBtn");
const outputArea = document.getElementById("outputArea");
const outputWrapper = document.getElementById("outputWrapper");

function cleanHeadings(markdownHTML) {
  return markdownHTML
    .replace(/<h1.*?>(.*?)<\/h1>/gi, "<strong>$1</strong><br>")
    .replace(/<h2.*?>(.*?)<\/h2>/gi, "<strong>$1</strong><br>")
    .replace(/<h3.*?>(.*?)<\/h3>/gi, "<strong>$1</strong><br>")
    .replace(/<h4.*?>(.*?)<\/h4>/gi, "<strong>$1</strong><br>");
}

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  const platform = platformSelect.value;
  const mode = modeSelect.value;

  if (!prompt) {
    alert("Please enter a prompt to optimize.");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  outputWrapper.classList.remove("hidden");
  outputArea.innerHTML = `<em>Generating your optimized prompt...</em>`;

  try {
    const response = await fetch("/api/generate-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, platform, mode }),
    });

    if (!response.ok) {
      const err = await response.text();
      outputArea.innerHTML = `<strong>❌ API Error:</strong> ${response.status} - ${err}`;
      return;
    }

    const data = await response.json();
    const rawHTML = marked.parse(data.result);
    const cleanedHTML = cleanHeadings(rawHTML);
    outputArea.innerHTML = cleanedHTML;
  } catch (error) {
    outputArea.innerHTML = `<strong>❌ Fetch error:</strong> ${error.message}`;
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Optimized Prompt";
  }
});
