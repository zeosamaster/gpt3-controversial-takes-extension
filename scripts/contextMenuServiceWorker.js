const STORAGE_KEY = "openai-key";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "context-run",
    title: "Generate controversial take",
    contexts: ["selection"],
  });
});

const getKey = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) =>
      result[STORAGE_KEY] ? resolve(atob(result[STORAGE_KEY])) : reject()
    );
  });
};

const generate = async (prompt) => {
  const key = await getKey();
  const url = "https://api.openai.com/v1/completions";

  const completionResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });

  const completion = await completionResponse.json();
  return completion.choices.pop();
};

const generateCompletionAction = async (info) => {
  try {
    sendMessage("controversial-take-generating");

    const { selectionText } = info;
    const prompt = `Generate a controversial take on the following topic: "${selectionText}".\n`;
    const { text } = await generate(prompt);

    sendMessage("controversial-take-generated", text);
  } catch (error) {
    console.log(error);
  }
};

chrome.contextMenus.onClicked.addListener(generateCompletionAction);

const sendMessage = (type, content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(activeTab, { type, content }, (response) => {
      if (response.status === "failed") {
        console.log("injection failed.");
      }
    });
  });
};
