const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const preview = document.getElementById("preview");
const statusText = document.getElementById("status");

/*
=====================================
PASTE YOUR GEMINI API KEY HERE
=====================================
*/

const API_KEY = "AIzaSyBmG1rp1F7sByD0tjoCzPu6T6E6VZWK7ws";

generateBtn.addEventListener("click", async () => {

  const userPrompt = promptInput.value.trim();

  if (!userPrompt) {
    alert("Please enter a prompt");
    return;
  

  statusText.innerText = "Generating app...";

  try {

    const fullPrompt = `
Generate a complete single-file HTML app.

Requirements:
- Include HTML, CSS, and JavaScript
- Mobile responsive
- Beautiful modern UI
- Return ONLY code
- No markdown
- No explanations

User request:
${userPrompt}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    // CHECK RESPONSE
    if (!response.ok) {

      const errorText = await response.text();

      console.log(errorText);

      statusText.innerText =
        "API Error: " + response.status;

      return;
    }

    const data = await response.json();

    console.log(data);

    // SAFETY CHECK
    if (
      !data.candidates ||
      !data.candidates[0]
    ) {

      statusText.innerText =
        "No response from AI";

      return;
    }

    let generatedCode =
      data.candidates[0]
      .content.parts[0].text;

    // REMOVE MARKDOWN
    generatedCode = generatedCode
      .replace(/```html/g, "")
      .replace(/```/g, "");

    // SHOW APP
    preview.srcdoc = generatedCode;

    statusText.innerText =
      "App generated successfully";

  } catch (error) {

    console.error(error);

    statusText.innerText =
      "Error: " + error.message;

  }

});
