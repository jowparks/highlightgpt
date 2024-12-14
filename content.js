let askButton;

document.addEventListener('mouseup', async (event) => {
    if (event.target && event.target.className === 'chatgpt-popover-trigger') {
        return;
    }

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    removeButton();

    if (selectedText.length > 0) {
        // Create a small button to trigger GPT request
        askButton = document.createElement('div');
        askButton.className = 'chatgpt-popover-trigger';
        askButton.innerText = 'Ask GPT';

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        askButton.style.top = `${window.scrollY + rect.top - 40}px`;
        askButton.style.left = `${window.scrollX + rect.left}px`;

        document.body.appendChild(askButton);

        askButton.addEventListener('click', (event) => {
            console.log("CLICKED");
            askButton.innerText = 'Thinking...';
            askButton.classList.add('loading');
            queryGPT(selectedText);
        });
    }
});

function removeButton() {
    if (askButton) {
        askButton.remove();
        askButton = null;
    }
}

function queryGPT(prompt) {
    chrome.runtime.sendMessage({action: 'query_gpt', prompt: prompt}, (response) => {
        // Once we get a response from background, we just remove the button.
        removeButton();
    });
}
