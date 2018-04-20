console.log("Running 'Wordnik Popup' CONTENT")

chrome.runtime.onMessage.addListener(gotMsg)

function gotMsg (request, sender, sendResponse) {
    console.log("Popup TRIGGERED Content Script!!")
    
    if (request.action == "get_user_voice_input") {
        // @CONSIDER: This would require to turn on microphone permissions 
        //            even on untrusted pages.

        let speech = new webkitSpeechRecognition()
        let recognizedText

        speech.lang = "en-US"

        speech.onresult = function (object) {
            recognizedText = object.results[0][0].transcript
            chrome.runtime.sendMessage({voice_text: recognizedText})
        }

        speech.onerror = function (e) {
            chrome.runtime.sendMessage({voice_text: ""})
        }

        speech.onnomatch = function (e) {
            chrome.runtime.sendMessage({voice_text: ""})
        }

        speech.start()
    }

    if (request.action == "get_selected_word") {
        let word = window.getSelection().toString().trim()
        chrome.runtime.sendMessage({word: word})
    }
}
