// List of common stop words (can be expanded)
const stopWords = [
  'the', 'a', 'an', 'and', 'or', 'but', 'with', 'for', 'to', 'in', 'on', 'at', 'by', 'of', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'i', 'it'
];

function extractKeywords(titles) {
  let allText = titles.join(" ");
  let words = allText.split(/\s+/);

  let keywords = {};
  words.forEach(word => {
    word = word.replace(/[^\w\s]|_/g, "").toLowerCase();

    if (!stopWords.includes(word) && word.length > 0) {
      if (!keywords[word]) {
        keywords[word] = 0;
      }
      keywords[word]++;
    }
  });

  const sortedKeywords = Object.entries(keywords)
    .sort(([, a], [, b]) => b - a) 
    .slice(0, 25); 

  const topKeywords = Object.fromEntries(sortedKeywords);

  return topKeywords;
}

document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const numTitles = document.getElementById('numTitles').value;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];

    if (activeTab.url.includes("youtube.com")) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['contentScript.js']
      }, () => {
        chrome.tabs.sendMessage(activeTab.id, { numTitles: numTitles });
      });
    } else {
      document.getElementById('results').innerText = 'Please navigate to a YouTube channel page!';
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.titles) {
    const keywords = extractKeywords(request.titles);

    document.getElementById('results').innerHTML = `
      <h3>Top 15 Keywords (Excluding Stop Words and Numbers):</h3>
      <pre>${JSON.stringify(keywords, null, 2)}</pre>
    `;
  }
});
