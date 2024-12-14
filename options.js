document.getElementById('save').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value.trim();
  chrome.storage.sync.set({openaiApiKey: apiKey}, () => {
      alert('API key saved!');
  });
});

// Load the currently saved API key
chrome.storage.sync.get('openaiApiKey', (result) => {
  if (result.openaiApiKey) {
      document.getElementById('apiKey').value = result.openaiApiKey;
  }
});
