// Wordnik API :: INFLECTED FORM

// let debug_sentence = `A naturally abundant nonmetallic element that occurs in many inorganic and in all organic compounds, exists freely as graphite and diamond and as a constituent of coal, limestone, and petroleum, and is capable of chemical self-bonding to form an enormous number of chemically, biologically, and commercially important molecules. Atomic number 6; atomic weight 12.011; sublimation point above 3,500°C; boiling point 4,827°C; specific gravity of amorphous carbon 1.8 to 2.1, of diamond 3.15 to 3.53, of graphite 1.9 to 2.3; valence 2, 3, 4. See Table at element.`
// let utterance = new SpeechSynthesisUtterance(debug_sentence)

// speechUtteranceChunker(utterance, {
//     chunkLength: 200
// }, function () {
//     //some code to execute when done
//     console.log('done');
// });

console.log("Hello from Popup's Background!!")
console.log(speechSynthesis.getVoices())

let html = document.querySelector("html")
let p = document.querySelector("#defBox")
let heading = document.querySelector("#wordBar")
let def_utterance = new SpeechSynthesisUtterance("")
let word
let search_btn

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

chrome.tabs.getSelected(null, gotTab)
chrome.runtime.onMessage.addListener(gotWord)

function gotTab (tab) {
    chrome.tabs.sendMessage(tab.id, {})
    console.log("Msg SENT.")
}

function gotWord (request, sender) {
    // console.log(request)
    // console.log(`Word: ${request.word}`)
    // console.log(request.noLowerCase == undefined)

    // @TODO: implement `noCaseChange` for the first round in 'gotWord'

    word = request.word
    heading.innerText = word
    heading.style.padding = "8px 0 8px 16px"

    if (word) {
        let url

        // To be noted some words definitions given by Wordnik is based on diffrernt CASES (upper, lower, title)
        // Ex: "google" and "Google" have different set of definitions in Wordnik.
        
        if (request.noLowerCase == undefined) {
            // Some words in Wordnik is discoverable only when the word is in lowercase
            url = `http://api.wordnik.com:80/v4/word.json/${word.toLowerCase()}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`
        }
        else {
            // Applicable when the word is an abbreviation (eg. CSS, API).
            // Note: The following won't work.. "css" or "api". So, here `noLowerCase` property in 'request' can be used.
            url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`
        }

        loadJSON(url, gotResponse, connectionError)

        p.innerHTML = `<img src="./res/throbber_small.svg" style="vertical-align: middle;">&nbsp;&nbsp;
                        <span style="vertical-align: middle;">Fetching Content... HOLD ON</span>`
    }
    else {
        heading.innerText = ""
        p.innerHTML = `<span style="vertical-align: middle;">
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
                            
            
            heading.innerHTML = `<span id="speak_btn" style="vertical-align: -3px;">
                                    ${speaker_icon}
                                </span>

                                &nbsp;

                                <span style="vertical-align: 4px; font-size: 15px">
                                    ${word}
                                </span>`

            let speak_btn = document.querySelector("#speak_btn")
            let stop_btn

            if (speak_btn) {
                heading.style.padding = "6px 0 2px 16px"
                
                speak_btn.onclick = function () {
                    // Timeout is used since `speechSynthesis.getVoices()` is asyncronous
                    setTimeout(speakUp, 500);
                }

                function speakUp () {
                    console.log(speechSynthesis.getVoices())
                    def_utterance = new SpeechSynthesisUtterance(word + ". " + pureText)
                    def_utterance.voice = speechSynthesis.getVoices()[1]
    
                    def_utterance.onstart = function () {
                        heading.innerHTML = `<span id="stop_btn" style="vertical-align: -3px;">
                                                ${stop_icon}
                                            </span>

                                            &nbsp;

                                            <span style="vertical-align: 4px; font-size: 15px">
                                                ${word}
                                            </span>`

                        stop_btn = document.querySelector("#stop_btn")

                        stop_btn.onclick = function () {
                            speechSynthesis.cancel()
                        }
                    }

                    def_utterance.onend = function () {
                        heading.innerHTML = `<span id="speak_btn" style="vertical-align: -3px;">
                                                ${speaker_icon}
                                            </span>

                                            &nbsp;

                                            <span style="vertical-align: 4px; font-size: 15px">
                                                ${word}
                                            </span>`

                        speak_btn = document.querySelector("#speak_btn")

                        speak_btn.onclick = function () {
                            speakUp()
                        }
                    }
                    
                    window.speechSynthesis.speak(def_utterance)
                }
            }
        }
        else {
            if ("word" in response) {
                p.innerHTML = `<br>
                            <span style="vertical-align: middle;">
                                ${info_icon}
                            </span>

                            &nbsp;

                            <span style="vertical-align: 5px; font-size: 15px">
                                <b>Did you mean: </b>
                                ${response.word}
                            </span>
                            
                            &nbsp;
                            <button style="vertical-align: 5px;" id="search_btn">Yeah!</button>`

                search_btn = document.querySelector("#search_btn")
                search_btn.onclick = searchWord

                function searchWord() {
                    gotWord({word: response.word})
                }
            }

            else {
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
        p.innerHTML = `<br>
                        <span style="vertical-align: middle;">
                            ${error_icon}
                        </span>

                        &nbsp;

                        <span style="vertical-align: 5px; font-size: 15px">
                            <b>NOT FOUND!!</b>
                        </span>`

        console.log(word)

        if (word != word.toUpperCase()) {
            word = word.toUpperCase()
            gotWord({word: word, noLowerCase: 1})
        }

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
