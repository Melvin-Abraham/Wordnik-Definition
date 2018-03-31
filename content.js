console.log("Running 'Wordnik Popup' CONTENT")

chrome.runtime.onMessage.addListener(gotMsg)

function gotMsg (request, sender, sendResponse) {
    console.log("Popup TRIGGERED Content Script!!")
    
    if (request.action == "get_user_voice_input") {
        // @CONSIDER: This would require to turn on microphone permissions 
        //            even on untrusted pages.

        // NOT IMPLEMENTED YET!

        let speech = new webkitSpeechRecognition()
        speech.start()
    }

    if (request.action == "get_selected_word") {
        let word = window.getSelection().toString().trim()
        chrome.runtime.sendMessage({word: word})
    }
}
