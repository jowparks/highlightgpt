chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'query_gpt') {
      const promptText = request.prompt;

      // Retrieve the API key from storage
      chrome.storage.sync.get(['openaiApiKey'], async (result) => {
          const apiKey = result.openaiApiKey;
          if (!apiKey) {
              sendResponse({error: 'No API key provided'});
              return;
          }

          try {
              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                      model: "gpt-4",
                      messages: [{role: 'user', content: promptText}],
                      max_tokens: 200,
                      temperature: 0.7
                  })
              });

              if (!response.ok) {
                  const errorText = await response.text();
                  sendResponse({error: `API Error: ${errorText}`});
                  return;
              }

              const data = await response.json();
              if (data.choices && data.choices.length > 0) {
                  const gptResponse = data.choices[0].message.content.trim();

                  // Store the response in storage
                  chrome.storage.local.set({ lastGptResponse: gptResponse }, () => {
                      // Open a new window to display the response
                      chrome.windows.create({
                          url: 'response.html',
                          type: 'popup',
                          width: 600,
                          height: 400
                      });
                  });

                  sendResponse({response: gptResponse});
              } else {
                  sendResponse({error: 'No response from GPT.'});
              }
          } catch (error) {
              sendResponse({error: error.toString()});
          }
      });

      // Indicate asynchronous response
      return true;
  }
});
