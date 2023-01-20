const onGenerating = () => {
  document.body.style = "cursor: wait!important";
};

const onGenerated = (message) => {
  document.body.style = "cursor: initial";
  const content = message.content.replace(/^\n+/, "");
  navigator.clipboard.writeText(`"${content}"`);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.type === "controversial-take-generating") {
      onGenerating();
    } else if (message.type === "controversial-take-generated") {
      onGenerated(message);
    }

    sendResponse({ status: "success" });
  } catch (e) {
    sendResponse({ status: "failed" });
  }
});
