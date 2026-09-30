async function askGemini() {
    const question = document.getElementById("question").value;
    const answer = document.getElementById("answer");

    if (question.trim() === "") {
        answer.innerText = "Please enter a question.";
        return;
    }

    answer.innerText = "Thinking...";

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: question
            })
        });

        const data = await response.json();

        if (data.reply) {
            answer.innerText = data.reply;
        } else {
            answer.innerText = data.error || "No response received.";
        }

    } catch (error) {
        console.error(error);
        answer.innerText = "Sorry, something went wrong.";
    }
}