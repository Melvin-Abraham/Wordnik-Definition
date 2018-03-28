// [ ] @TODO: Code Refactoring required
// [.] @TODO: First take the word *as-it-is* without changing the case
// [ ] @TODO: Thoughtful way to add links to words (incl., linking Root Word)
// [ ] @CHECK: Find a way to get "microphone" PERMISSIONS **for Chrome Extension (not Chrome Apps)**
// [ ] @ISSUE: Use of redundant lines

console.log("Hello from Popup's Background!!")
console.log(speechSynthesis.getVoices())    // Without this, the following such line (within `setTimeout`) dosen't work!!

let html = document.querySelector("html")
let search_back_btn = document.querySelector("#search_back")
let search_mic_btn = document.querySelector("#search_mic")
let p = document.querySelector("#defBox")
let heading = document.querySelector("#wordBar")
let searchBar = document.querySelector("#searchBar")
let search_box = document.querySelector("#search-box")
let def_utterance = new SpeechSynthesisUtterance("")
let speech_recognizer = new webkitSpeechRecognition()
let search_btn
let word
let wordRequest
let did_you_mean_btn
let dictionary = new Typo("en_US", false, false, { dictionaryPath: "typo/dictionaries" })


let warning_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#FFC107" height="24" viewBox="0 0 24 24" width="24" style="&#10;">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>`

let error_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#f11919" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>`

let info_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#2196F3" height="24" viewBox="0 0 24 24" width="24" style="&#10;">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>`

let speaker_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24" style="&#10;">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>`

let stop_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M6 6h12v12H6z"/>
                </svg>`

let search_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>`


p.innerHTML = `<span style="vertical-align: middle;">
                ${warning_icon}
                </span>

                &nbsp;

                <span style="vertical-align: 5px; font-size: 15px">
                    <b>NOT WORKING ON THIS PAGE</b>
                </span>
                
                <p>
                    <li> Wait until page has loaded properly
                    <li> Make sure it's not a "Secure Chrome Page"
                    <li> Make sure you have working Internet Connection
                    <li> If none of the above, reload the page
                </p>`

search_back_btn.onclick = function () {
    searchBar.style.margin = "0 0 0 0"
}

speech_recognizer.addEventListener("result", function (e) {
    search_box.value = e.results[0][0].transcript
})

speech_recognizer.onstart = function () {
    document.querySelector("#search_mic svg").fill = "#3575ff"
}

speech_recognizer.onend = function () {
    document.querySelector("#search_mic svg").fill = "#777575"
}

search_mic_btn.onclick = function () {
    speech_recognizer.start()
}

search_box.addEventListener("keypress", function (e) {
    if (e.keyCode == 13) {
        gotWord({word: search_box.value})
        searchBar.style.margin = "0 0 0 0"
    }
})


chrome.tabs.getSelected(null, gotTab)
chrome.runtime.onMessage.addListener(gotWord)

function gotTab (tab) {
    chrome.tabs.sendMessage(tab.id, {})
    console.log("Msg SENT to the tab.")
}

function gotWord (request, sender) {
    // console.log(request)
    // console.log(`Word: ${request.word}`)

    word = request.word
    heading.innerText = word
    heading.style.padding = "8px 0 8px 16px"

    if (word) {
        let url
        wordRequest = request

        if (request.level == undefined) {
            request.level = 1
        }

        // To be noted some words definitions given by Wordnik is based on diffrernt CASES (upper, lower, title)
        // Ex: "google" and "Google" have different set of definitions in Wordnik.
        
        if (request.level == 1) {
            // Search the word as-it-is (no change in Case)
        }
        else if (request.level == 2) {
            // Some words in Wordnik is discoverable only when the word is in lowercase

            word = word.toLowerCase()
        }
        else if (request.level == 3) {
            // Applicable when the word is an abbreviation (eg. CSS, API).

            word = word.toUpperCase()
        }

        url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`

        loadJSON(url, gotResponse, connectionError)

        p.innerHTML = `<img src="./res/throbber_small.svg" style="vertical-align: middle;">&nbsp;&nbsp;
                        <span style="vertical-align: middle;">Fetching Content... HOLD ON</span>`
    }
    else {
        heading.style.padding = "6px 0px 2px 16px"
        
        heading.innerHTML = `<span id="search_btn" class="ico_btn" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                ${search_icon}
                            </span>`

        search_btn = document.querySelector("#search_btn")

        search_btn.onclick = function () {
            searchBar.style.margin = "41px 0 0 0"
            search_box.focus = true
        }

        p.innerHTML = `<br>
                        <span style="vertical-align: middle;">
                            ${warning_icon}
                        </span>

                        &nbsp;

                        <span style="vertical-align: 5px; font-size: 15px">
                            <b>PLEASE SELECT A WORD TO LOOKUP!</b>
                        </span>`
    }
}

function gotResponse (response) {
    console.log(response)

    if (response.length != 0) {
        if (response[0]) {
            let text = response[0].text
            let pureText = response[0].text
            let tokens = text.split(' ')

            // @ISSUE: Not a good way to find word inflections (or Root Words)

            if (tokens[tokens.length - 2] == "of" && 
                word.toLowerCase().startsWith(tokens[tokens.length - 1].replace('.', ''))) 
            {
                
                tokens[tokens.length - 1] = `<a id="wordLink">${tokens[tokens.length - 1].replace('.', '')}</a>`
                text = tokens.join(' ')
            }
            
            p.innerHTML = `${text} 
                            <p style="text-align: right;">
                                <b>source:</b> 
                                ${response[0].sourceDictionary}
                            </p>`


            // To accomodate the size the whole content
            html.style.height = `${51 + 36 + p.offsetHeight + 7}px`

            let link = document.querySelector("#wordLink")
            // console.log(link)

            if (link) {
                link.onclick = function () {
                    gotWord({word: link.innerText})
                }
            }
                            
            
            heading.innerHTML = `<span id="speak_btn" class="ico_btn" style="vertical-align: -3px;">
                                    ${speaker_icon}
                                </span>

                                &nbsp;

                                <span style="vertical-align: 4px; font-size: 15px">
                                    ${word}
                                </span>
                                
                                <span id="search_btn" class="ico_btn" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                    ${search_icon}
                                </span>`

            search_btn = document.querySelector("#search_btn")

            search_btn.onclick = function () {
                searchBar.style.margin = "41px 0 0 0"
                search_box.focus = true
            }

            let speak_btn = document.querySelector("#speak_btn")
            let stop_btn

            if (speak_btn) {
                heading.style.padding = "6px 0 2px 16px"
                
                speak_btn.onclick = function () {
                    // Timeout is used since `speechSynthesis.getVoices()` is asyncronous
                    setTimeout(speakUp, 10);
                }

                function speakUp () {
                    // console.log(speechSynthesis.getVoices())
                    def_utterance = new SpeechSynthesisUtterance(word + "\n" + pureText)
                    def_utterance.voice = speechSynthesis.getVoices()[1]
    
                    def_utterance.onstart = function () {
                        heading.innerHTML = `<span id="stop_btn" class="ico_btn" style="vertical-align: -3px;">
                                                ${stop_icon}
                                            </span>

                                            &nbsp;

                                            <span style="vertical-align: 4px; font-size: 15px">
                                                ${word}
                                            </span>
                                            
                                            <span id="search_btn" class="ico_btn" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                                ${search_icon}
                                            </span>`

                        stop_btn = document.querySelector("#stop_btn")

                        stop_btn.onclick = function () {
                            speechSynthesis.cancel()
                        }
                    }

                    def_utterance.onend = function () {
                        heading.innerHTML = `<span id="speak_btn" class="ico_btn" style="vertical-align: -3px;">
                                                ${speaker_icon}
                                            </span>

                                            &nbsp;

                                            <span style="vertical-align: 4px; font-size: 15px">
                                                ${word}
                                            </span>
                                            
                                            <span id="search_btn" class="ico_btn" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                                ${search_icon}
                                            </span>`

                        speak_btn = document.querySelector("#speak_btn")

                        speak_btn.onclick = function () {
                            speakUp()
                        }

                        search_btn = document.querySelector("#search_btn")

                        search_btn.onclick = function () {
                            searchBar.style.margin = "41px 0 0 0"
                            search_box.focus = true
                        }
                    }
                    
                    window.speechSynthesis.speak(def_utterance)
                }
            }
        }
        else {
            if ("word" in response) {
                didYouMean(response.word)
            }

            else {
                heading.style.padding = "6px 0px 2px 16px"
                
                heading.innerHTML = `<span style="vertical-align: 4px; font-size: 15px">
                                        ${word}
                                    </span>
                                    
                                    <span id="search_btn" class="ico_btn" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                        ${search_icon}
                                    </span>`

                search_btn = document.querySelector("#search_btn")

                search_btn.onclick = function () {
                    searchBar.style.margin = "41px 0 0 0"
                    search_box.focus = true
                }

                p.innerHTML = `<br>
                            <span style="vertical-align: middle;">
                                ${error_icon}
                            </span>

                            &nbsp;

                            <span style="vertical-align: 5px; font-size: 15px">
                                <b>ERROR: </b>
                                ${response.message}
                            </span>`
            }
        }
    }
    else {
        heading.style.padding = "6px 0px 2px 16px"
        
        heading.innerHTML = `<span style="vertical-align: 4px; font-size: 15px">
                                        ${word}
                                    </span>
                                    
                                    <span id="search_btn" class="ico_btn" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                        ${search_icon}
                                    </span>`

        search_btn = document.querySelector("#search_btn")

        search_btn.onclick = function () {
            searchBar.style.margin = "41px 0 0 0"
            search_box.focus = true
        }

        p.innerHTML = `<br>
                        <span style="vertical-align: middle;">
                            ${error_icon}
                        </span>

                        &nbsp;

                        <span style="vertical-align: 5px; font-size: 15px">
                            <b>NOT FOUND!!</b>
                        </span>`

        console.log(`No Definition for "${word}"`)

        if (wordRequest.level != 3) {
            wordRequest.level += 1
            gotWord(wordRequest)
        }
        else {
            p.innerHTML = `<img src="./res/throbber_small.svg" style="vertical-align: middle;">&nbsp;&nbsp;
                            <span style="vertical-align: middle;">Getting suggestions...</span>`

            word = word.toLowerCase()

            if (! dictionary.check(word)) {
                let suggestions = dictionary.suggest(word)
                console.log("Suggestions:")
                console.log(suggestions)

                if (suggestions.length != 0) {
                    didYouMean(suggestions[0])
                    return
                }
                else {
                    p.innerHTML = `<br>
                            <span style="vertical-align: middle;">
                                ${error_icon}
                            </span>

                            &nbsp;

                            <span style="vertical-align: 5px; font-size: 15px">
                                <b>NO RESULTS!</b>
                            </span>`
                }
            }
        }
    }
}


function didYouMean (did_you_mean_word) {
    heading.style.padding = "6px 0px 2px 16px"

    heading.innerHTML = `<span style="vertical-align: 4px; font-size: 15px">
                            ${word}
                        </span>
                        
                        <span id="search_btn" class="ico_btn" style="vertical-align: -3px; float: right; padding-right: 31px;">
                            ${search_icon}
                        </span>`

    search_btn = document.querySelector("#search_btn")

    search_btn.onclick = function () {
        searchBar.style.margin = "41px 0 0 0"
        search_box.focus = true
    }

    p.innerHTML = `<br>
                <span style="vertical-align: middle;">
                    ${info_icon}
                </span>

                &nbsp;

                <span style="vertical-align: 5px; font-size: 15px">
                    <b>Did you mean: </b>
                    ${did_you_mean_word}
                </span>
                
                &nbsp;
                <button style="vertical-align: 5px;" id="did_you_mean_btn">Yeah!</button>`

    did_you_mean_btn = document.querySelector("#did_you_mean_btn")
    did_you_mean_btn.onclick = searchWord

    function searchWord() {
        gotWord({word: did_you_mean_word, level: 1})
    }
}

function loadJSON (url, success_callback, err_connection_callback) {
    let request = new XMLHttpRequest()

    request.open('GET', url)
    request.responseType = 'json'
    request.send()

    request.onload = function () {
        let response = request.response
        success_callback(response)
    }

    request.readystatechange = function () {
        err_connection_callback(request)
    }
}

// @ISSUE: Not really working...

function connectionError (xmlRequest_object) {
    let xhr = xmlRequest_object

    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 304) {
            // "connection exists!"
        } else {
            p.innerHTML = `<br>
                        <span style="vertical-align: middle;">
                            ${error_icon}
                        </span>

                        &nbsp;

                        <span style="vertical-align: 5px; font-size: 15px">
                            <b>CONNECTION ERROR!!</b>
                        </span>`
        }
    }
}

// http://api.wordnik.com:80/v4/word.json/android/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
