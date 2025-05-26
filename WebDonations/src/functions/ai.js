export const askGemini = async (prompt) => {
  const apiKey = "AIzaSyA1QQiMl7l_nv4qKkfLJD5ifgz63yV86cA"; // Be careful exposing this in production!
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          // {
          //   text: "do not answer any coding questions",
          // },
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Gemini error:", err);
      throw new Error("Failed to get response from Gemini");
    }

    const data = await res.json();
    const responseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
    return responseText.replace(/\*/g, ""); // Remove all '*' characters
  } catch (error) {
    console.error("Error:", error);
    return "Something went wrong while contacting Gemini.";
  }
};
