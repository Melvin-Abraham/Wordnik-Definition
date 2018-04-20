// [#] @TODO: About Page
// [.] @TODO: Add "random word" feature
// [.] @TODO: Code Refactoring required
// [ ] @TODO: Thoughtful way to add links to words (incl., linking Root Word)
// [ ] @CHECK: Effects of hardcoding values like 'font-size'
// [!] @CHECK: Find a way to get "microphone" PERMISSIONS **for Chrome Extension (not Chrome Apps)**

console.log("Hello from Popup's Background!!")
console.log(speechSynthesis.getVoices())    // Without this, the following such line (within `setTimeout`) dosen't work!!

let html = document.querySelector("html")
let search_back_btn = document.querySelector("#search_back")
let mic_btn = document.querySelector("#mic_btn")
let p = document.querySelector("#defBox")
let heading = document.querySelector("#wordBar")
let main_bar = document.querySelector("#mainBar")
let searchBar = document.querySelector("#searchBar")
let search_box = document.querySelector("#search-box")
let about_btn = document.querySelector("#about_btn")
let def_utterance = new SpeechSynthesisUtterance("")
const rand_word_url = "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5"
const version = chrome.runtime.getManifest().version
let tab
let mic_interval_id
let search_btn
let word
let wordRequest
let did_you_mean_btn

console.time("Initializing dictionary...")
const dictionary = new Typo("en_US", false, false, { dictionaryPath: "typo/dictionaries" })
console.timeEnd("Initializing dictionary...")


const warning_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#FFC107" height="24" viewBox="0 0 24 24" width="24" style="&#10;">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                        </svg>`

const error_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#f11919" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>`

const info_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#2196F3" height="24" viewBox="0 0 24 24" width="24" style="&#10;">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>`

const speaker_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24" style="&#10;">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>`

const stop_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M6 6h12v12H6z"/>
                    </svg>`

const search_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>`

const no_cloud_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"/>
                        </svg>`

const random_icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                    </svg>`


chrome.tabs.getSelected(null, function (tab_object) {
    tab = tab_object
    console.log(tab)
})


setHeading(false, false, true)

p.innerHTML = `<br>
                <span style="vertical-align: middle;">
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

html.style.height = `245px`

search_back_btn.onclick = function () {
    searchBar.style.margin = "0 0 0 0"
}

mic_btn.onclick = function () {
    chrome.tabs.sendMessage(tab.id, {action: "get_user_voice_input"})
    mic_btn.children[0].setAttribute('fill', "#ff3535")

    mic_interval_id = setInterval(function () {
        mic_btn.children[0].setAttribute('fill', "#ff3535")
        
        setTimeout(function () {
            mic_btn.children[0].setAttribute('fill', "#777575")
        }, 1000)
    }, 1500)

    console.log("Sent Mic Request")
}

about_btn.onclick = function () {
    showAbout()
}

search_box.addEventListener("keypress", function (e) {
    let searchTerm = search_box.value.trim()

    if (e.keyCode == 13 && searchTerm) {
        gotWord({word: searchTerm})
        searchBar.style.margin = "0 0 0 0"
    }
})


setTimeout(function () {
    gotTab(tab)
}, 10)

chrome.runtime.onMessage.addListener(handle_content_request)

function handle_content_request (request, sender) {
    console.log(request)

    if ('word' in request) {
        gotWord(request, sender)
    }
    else if ('voice_text' in request) {
        clearInterval(mic_interval_id)
        mic_btn.children[0].setAttribute('fill', "#777575")

        if (request.voice_text) {
            search_box.value = request.voice_text
            search_box.focus()
        }
    }
}

function gotTab (tab) {
    chrome.tabs.sendMessage(tab.id, {action: "get_selected_word"})
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
        setHeading(false, false, true)

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
                word.toLowerCase().startsWith(tokens[tokens.length - 1].toLowerCase().replace('.', ''))) 
            {
                tokens[tokens.length - 1] = `<a id="wordLink">${tokens[tokens.length - 1].replace('.', '')}</a>`
                text = tokens.join(' ')
            }

            // Tag highlighting

            if (pureText.indexOf("   ") !== -1) {
                const tagIndex = tokens.indexOf("")
                const tag = tokens.slice(0, tagIndex + 1).join(' ')
                
                pureText = pureText.split('')
                pureText[tag.length] = "\n"
                pureText = pureText.join('')
                
                tokens[0] = `<span style="color: #e91e63"><b><i>${tokens[0]}`
                tokens[tagIndex + 1] = `</i></b></span>&nbsp;`
                text = tokens.join(' ')
            }

            // text = tokens.join(' ')
            
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
               
            let speak_msg = word + "\n" + pureText
            setHeading(true, true, true, speak_msg)
        }
        else {
            if ("word" in response) {
                didYouMean(response.word)
            }

            else {
                setHeading(false, true, true)

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
        setHeading(false, true, true)

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
            heading.style.padding = "6px 0px 2px 16px"
            
            p.innerHTML = `<img src="./res/throbber_small.svg" style="vertical-align: middle;">&nbsp;&nbsp;
                            <span style="vertical-align: middle;">Getting suggestions...</span>`

            word = word.toLowerCase()

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



function setHeading(speaker_part, word_part, side_icons, speak_msg="") {
    heading.innerHTML = ""
    heading.style.padding = "8px 0 8px 16px"

    if (speaker_part) {
        heading.style.padding = "6px 0px 2px 16px"

        heading.innerHTML += `<span id="speak_btn" class="ico_btn_dark" style="vertical-align: -3px;">
                                ${speaker_icon}
                            </span> &nbsp;`
    }

    if (word_part) {
        heading.innerHTML += `<span style="vertical-align: 4px; font-size: 15px">
                                ${word}
                            </span>`
    }

    if (side_icons) {
        heading.style.padding = "6px 0px 2px 16px"

        heading.innerHTML += `<span id="search_btn" class="ico_btn_dark" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                ${search_icon}
                            </span>
        
                            <span id="random_btn" class="ico_btn_dark" style="vertical-align: -3px; float: right; padding-right: 15px;">
                                ${random_icon}
                            </span>`
    

        search_btn = document.querySelector("#search_btn")

        search_btn.onclick = function () {
            searchBar.style.margin = "43px 0 0 0"
            search_box.focus()
        }

        random_btn = document.querySelector("#random_btn")

        random_btn.onclick = function () {
            p.innerHTML = `<img src="./res/throbber_small.svg" style="vertical-align: middle;">&nbsp;&nbsp;
                            <span style="vertical-align: middle;">Getting a random word...</span>`

            loadJSON(rand_word_url, gotWord, connectionError)
        }
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
            def_utterance = new SpeechSynthesisUtterance(speak_msg)
            def_utterance.voice = speechSynthesis.getVoices()[1]

            def_utterance.onstart = function () {
                heading.innerHTML = ""

                if (speaker_part) {
                    heading.innerHTML += `<span id="stop_btn" class="ico_btn_dark" style="vertical-align: -3px;">
                                            ${stop_icon}
                                        </span> &nbsp;`
                }

                if (word_part) {
                    heading.innerHTML += `<span style="vertical-align: 4px; font-size: 15px">
                                            ${word}
                                        </span>`
                }

                if (side_icons) {
                    heading.innerHTML += `<span id="search_btn" class="ico_btn_dark" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                            ${search_icon}
                                        </span>
                    
                                        <span id="random_btn" class="ico_btn_dark" style="vertical-align: -3px; float: right; padding-right: 15px;">
                                            ${random_icon}
                                        </span>`
                
                    search_btn = document.querySelector("#search_btn")

                    search_btn.onclick = function () {
                        searchBar.style.margin = "43px 0 0 0"
                        search_box.focus()
                    }
            
                    random_btn = document.querySelector("#random_btn")
            
                    random_btn.onclick = function () {
                        p.innerHTML = `<img src="./res/throbber_small.svg" style="vertical-align: middle;">&nbsp;&nbsp;
                                        <span style="vertical-align: middle;">Getting a random word...</span>`
            
                        loadJSON(rand_word_url, gotWord, connectionError)
                    }
                }

                stop_btn = document.querySelector("#stop_btn")

                if (stop_btn) {
                    stop_btn.onclick = function () {
                        speechSynthesis.cancel()
                    }
                }
            }

            def_utterance.onend = function () {
                if (speak_msg.startsWith(word)) {
                    // This statement checks whether the old word
                    // still exists or is replaced by a new one.

                    // If yes, the following statements are seized from reverting the
                    // new utterance with the old one
                    
                    heading.innerHTML = ""

                    if (speaker_part) {
                        heading.innerHTML += `<span id="speak_btn" class="ico_btn_dark" style="vertical-align: -3px;">
                                                ${speaker_icon}
                                            </span> &nbsp;`
                    }

                    if (word_part) {
                        heading.innerHTML += `<span style="vertical-align: 4px; font-size: 15px">
                                                ${word}
                                            </span>`
                    }

                    if (side_icons) {
                        heading.innerHTML += `<span id="search_btn" class="ico_btn_dark" style="vertical-align: -3px; float: right; padding-right: 31px;">
                                                ${search_icon}
                                            </span>
                        
                                            <span id="random_btn" class="ico_btn_dark" style="vertical-align: -3px; float: right; padding-right: 15px;">
                                                ${random_icon}
                                            </span>`
                    
                        search_btn = document.querySelector("#search_btn")

                        search_btn.onclick = function () {
                            searchBar.style.margin = "43px 0 0 0"
                            search_box.focus()
                        }
                
                        random_btn = document.querySelector("#random_btn")
                
                        random_btn.onclick = function () {
                            p.innerHTML = `<img src="./res/throbber_small.svg" style="vertical-align: middle;">&nbsp;&nbsp;
                                            <span style="vertical-align: middle;">Getting a random word...</span>`
                
                            loadJSON(rand_word_url, gotWord, connectionError)
                        }
                    }

                    speak_btn = document.querySelector("#speak_btn")

                    speak_btn.onclick = function () {
                        speakUp()
                    }
                }
            }
            
            window.speechSynthesis.speak(def_utterance)
        }
    }
}

function showAbout () {
    const para = p.innerHTML

    main_bar.innerHTML = `<span style="vertical-align: top;">
                                Wordnik Definition
                            </span>

                            <span style="vertical-align: top; float: right; padding-right: 18px;" id="about_close_btn" class="ico_btn_light">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="22" viewBox="0 0 24 24" width="22">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                                </svg>
                            </span>`

    let about_close = document.querySelector("#about_close_btn")

    about_close.onclick = function () {
        // @ISSUE: EventListeners in 'p' are not preserved (if any).
        //         [like: Did you mean "button", "links"]

        p.innerHTML = para
        html.style.height = "240px"

        main_bar.innerHTML = `<span style="vertical-align: top;">
                                Wordnik Definition
                            </span>

                            <span style="vertical-align: top; float: right; padding-right: 18px;" id="about_btn" class="ico_btn_light">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="22" viewBox="0 0 24 24" width="22">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                                </svg>
                            </span>`

        document.querySelector("#about_btn").onclick = showAbout
    }

    html.style.height = "260px"
    
    p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="#777575" height="24" viewBox="0 0 24 24" width="24" style="vertical-align: middle;">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                    </svg>

                    &nbsp;
                     
                    <strong style="vertical-align: middle; font-size: 18px;">Wordnik Definition</strong> &nbsp;
                    <b style="vertical-align: -3px; font-size: 12px; color: #777575">v${version}</b>
                    <hr>

                    <p>
                        Select a word on your browser webpage and pop this up to get its definition.
                    </p>

                    <p>
                        Souce Code available 

                        <a href="https://github.com/Melvin-Abraham/Wordnik-Definition"
                            title="https://github.com/Melvin-Abraham/Wordnik-Definition"
                            target="blank">
                            here
                        </a>

                        <br><br>

                        <i>
                            Powered by &nbsp;

                            <img src="./res/wordnik_logo.png" style="
                                height: 25px;
                                vertical-align: middle;">
                        </i>
                    </p>`
}

function didYouMean (did_you_mean_word) {
    setHeading(false, true, true)

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

    try {
        request.open('GET', url)
        request.responseType = 'json'
        request.send()
    }
    catch(e) {
        console.log("Error occured while sending request.")
    }

    request.onload = function () {
        let response = request.response
        success_callback(response)
    }

    request.onprogress = function () {
        // console.log(request.status, request.statusText)

        if (request.status == 0 && request.statusText == "") {
            err_connection_callback()
        }
    }
}

function connectionError () {
    p.innerHTML = `<br>
                    <span style="vertical-align: middle;">
                        ${no_cloud_icon}
                    </span>

                    &nbsp;

                    <span style="vertical-align: 5px; font-size: 15px">
                        <i>Can't reach at the moment!</i>
                    </span>`

    /* Automatic Retry */

    // `useRequest` is used to prevent the content from constantly 
    // updating once a successful request has been made

    let useRequest = true
    let auto_retry_id = setInterval(function () {

        loadJSON(`http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`, 
            retry_success, 
            function () {}
        )

    }, 1000)

    function stop_retry () {
        clearInterval(auto_retry_id)
        useRequest = false
    }

    function retry_success (request) {
        if (useRequest) {
            gotResponse(request)
            stop_retry()
        }
    }
}

// http://api.wordnik.com:80/v4/word.json/android/definitions?limit=1&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
// http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
