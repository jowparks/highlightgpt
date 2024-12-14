chrome.storage.local.get('lastGptResponse', (result) => {
  const responseElement = document.getElementById('response');
  if (result.lastGptResponse) {
      responseElement.textContent = result.lastGptResponse;
  } else {
      responseElement.textContent = 'No response found.';
  }
});
