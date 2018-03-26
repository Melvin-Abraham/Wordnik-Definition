console.log("Running 'Wordnik Popup' CONTENT")

chrome.runtime.onMessage.addListener(gotMsg)

function gotMsg (request, sender, sendResponse) {
    console.log("Popup TRIGGERED Content Script!!")

    let word = window.getSelection().toString().trim()

    if (word == word.toUpperCase()) {
        chrome.runtime.sendMessage({word: word.toLowerCase()})
    }
    else {
        chrome.runtime.sendMessage({word: word})
    }
}
