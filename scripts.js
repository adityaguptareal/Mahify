// Hover Effect on card Listening Event

let currentSong = new Audio()
let songs;
let currFolder;
async function getSongs(folder) {
    currFolder = folder
    let song_list = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await song_list.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let song_links = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < song_links.length; index++) {
        const element = song_links[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }


    }

     //Displaying song list
     let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0]
     songUl.innerHTML=""
     for (const song of songs) {
         songUl.innerHTML = songUl.innerHTML + `<li> 
         <div class="song-info">
             <div class="song-name">${decodeURI(song)}</div>
             <div class="song-name-play-text">${decodeURI(song).replaceAll("-", " ")}</div>
         </div>
         <div class="play-now">
         <span>Plan Now</span>
         <img class="" id="library-play-btn" src="play.svg" alt=""></div>
     </li>`
         // console.log(songUl);
 
     }
 
     // Attaching an Event Listner to each song
     Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
         e.addEventListener("click", element => {
             playMusic(e.querySelector(".song-info").firstElementChild.innerHTML.trim())
 
         })
     })
     
}


function seconds_to_minutes(seconds) {
    // Round down to get the whole number of seconds
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Pad with leading zeros if necessary
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Format as MM:SS
    return `${paddedMinutes}:${paddedSeconds}`;
}





const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    var logo = document.getElementById("mahiImage")

    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
        
        
    }

    var currentSongName = decodeURI(track).replaceAll("-", " ").replaceAll(".mp3", "").replaceAll("%20", " ").slice(0, 60)
    // Join the capitalized words back into a string
    document.querySelector(".song-time").innerHTML = "00:00"
    document.querySelector(".song-info-txt").innerHTML = currentSongName;

    
}

async function main() {

    // Checking the Function
    await getSongs("songs/mahi")
    playMusic(songs[0], true)

    // Display all the album



   
    // Attaching event listner to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
            logo.classList.remove("rotation")
            
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
            logo.classList.add("rotation")

        }
    })
    // Listen for time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${seconds_to_minutes(currentSong.currentTime)}/${seconds_to_minutes(currentSong.duration)}`
        document.querySelector(".seekbar-circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Adding Event Listner on seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let song_percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".seekbar-circle").style.left = song_percent * +"%"
        currentSong.currentTime = (currentSong.duration * song_percent) / 100

    })

    //  Load the Playlist whenever card is Clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })


    // Add Event Listner on HamBurger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left_container").style.left = "0"
    })
    // Add Event Listern on close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left_container").style.left = "-100%"

    })
    // Add Event listner or previous
    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }


    })
    // Add Event listner or Next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }


    })
    // Adding Event Listner to to volume slider
    document.getElementById("volume-bar").addEventListener("change", (e) => {
        currentSong.volume = (e.target.value) / 100
    })



    // Adding event listenr for muting
    document.querySelector(".sound").addEventListener("click", () => {
        if (currentSong.muted == false) {
            currentSong.muted = true;
            document.getElementById("sound-img").src = "mute.svg"
        }
        else {
            currentSong.muted = false
            document.getElementById("sound-img").src = "volume.svg"
        }
    })


}
main()
