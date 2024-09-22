chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const numTitles = message.numTitles;
    let titles = [];
  
    document.querySelectorAll('#video-title').forEach((titleElement, index) => {
      if (index < numTitles) {
        titles.push(titleElement.innerText);
      }
    });
  
   
    chrome.runtime.sendMessage({ titles: titles });
  });
  