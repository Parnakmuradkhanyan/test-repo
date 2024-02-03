// Список треков
let track_list = [
    {
      name: "Трек 1",
      artist: "Исполнитель 1",
      image: "track1.jpg",
      path: "audio/track1.mp3"
    },
    {
      name: "Трек 2",
      artist: "Исполнитель 2",
      image: "track2.jpg",
      path: "audio/track2.mp3"
    },
    {
      name: "Трек 3",
      artist: "Исполнитель 3",
      image: "track3.jpg",
      path: "track3.mp3"
    }
];

// Индекс текущего трека
let current_track_index = 0;
  
// Элементы DOM
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
let prev_btn = document.getElementById("prev");
let play_btn = document.getElementById("play");
let next_btn = document.getElementById("next");
let seek_slider = document.getElementById("seek");
let volume_slider = document.getElementById("volume");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
  
// Создание элемента аудио
let curr_track = document.createElement("audio");

// Загрузка первого трека
loadTrack(current_track_index);
  
// Функция для загрузки трека
function loadTrack(index) {
    // Обновление деталей трека
    curr_track.src = track_list[index].path;
    track_art.style.backgroundImage = "url(" + track_list[index].image + ")";
    track_name.textContent = track_list[index].name;
    track_artist.textContent = track_list[index].artist;
  
    // Обновление индекса текущего трека
    current_track_index = index;
  
    // Ожидание загрузки трека
    curr_track.addEventListener("loadeddata", function() {
      // Обновление общей продолжительности
      let duration = formatTime(curr_track.duration);
      total_duration.textContent = duration;
    });
}
  
// Функция для форматирования времени в mm:ss
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds - min * 60);
    if (sec < 10) {
      sec = "0" + sec;
    }
    return min + ":" + sec;
}

// Функция для воспроизведения или паузы трека
function playPauseTrack() {
    // Если трек на паузе, то воспроизвести его
    if (curr_track.paused) {
      curr_track.play();
      // Изменить иконку на паузу
      play_btn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      // Если трек играет, то поставить на паузу
      curr_track.pause();
      // Изменить иконку на воспроизведение
      play_btn.innerHTML = '<i class="fas fa-play"></i>';
    }
}
  
// Функция для переключения на предыдущий трек
function prevTrack() {
    // Если текущий трек первый, то перейти к последнему
    if (current_track_index == 0) {
      loadTrack(track_list.length - 1);
    } else {
      // Иначе перейти к предыдущему
      loadTrack(current_track_index - 1);
    }
    // Воспроизвести трек
    playPauseTrack();
}
  
// Функция для переключения на следующий трек
function nextTrack() {
    // Если текущий трек последний, то перейти к первому
    if (current_track_index == track_list.length - 1) {
      loadTrack(0);
    } else {
      // Иначе перейти к следующему
      loadTrack(current_track_index + 1);
    }
    // Воспроизвести трек
    playPauseTrack();
}
  
// Функция для перемотки трека
function seekTo() {
    // Получить процент перемотки
    let seekto = curr_track.duration * (seek_slider.value / 100);
    // Перемотать трек
    curr_track.currentTime = seekto;
}
  
// Функция для обновления ползунка перемотки
function updateSeek() {
    // Получить процент проигранного времени
    let seek = (curr_track.currentTime / curr_track.duration) * 100;
    // Обновить ползунок
    seek_slider.value = seek;
    // Обновить текущее время
    let current = formatTime(curr_track.currentTime);
    curr_time.textContent = current;
}
  
// Функция для установки громкости
function setVolume() {
    curr_track.volume = volume_slider.value / 100;

    // Получить элементы DOM
    let audio = document.getElementById("audio"); // элемент аудио
    let volume = document.getElementById("volume"); // ползунок громкости
    let volumeValue = document.getElementById("volume-value"); // элемент для отображения значения громкости

    // Добавить обработчик события для изменения ползунка
    volume.addEventListener("input", function() {
    // Установить громкость аудио в соответствии с ползунком
    audio.volume = volume.value / 100;
    // Обновить элемент с значением громкости
    volumeValue.textContent = volume.value + "%";
    });

    // Добавить свойство --percent к ползунку
    volume_slider.style.setProperty("--percent", volume.value / 100);

}
// Добавить обработчик события для обновления ползунка перемотки
curr_track.addEventListener("timeupdate", updateSeek);


// Функция для обновления ползунка перемотки
function updateSeek() {
    // Получить процент проигранного времени
    let seek = (curr_track.currentTime / curr_track.duration) * 100;
    // Обновить ползунок
    seek_slider.value = seek;
    // Обновить текущее время
    let current = formatTime(curr_track.currentTime);
    curr_time.textContent = current;
    // Добавить свойство --percent к ползунку
    seek_slider.style.setProperty("--percent", seek / 100);
}



// Получить элемент плейлиста
let playlist = document.getElementById("playlist");
// Добавить обработчик события для нажатия на трек в плейлисте
playlist.addEventListener("click", function(e) {
  // Если нажатый элемент - это пункт плейлиста
  if (e.target.tagName === "LI") {
    // Получить данные трека из атрибутов элемента
    let songName = e.target.getAttribute("data-name");
    let songImage = e.target.getAttribute("data-image");
    let songPath = e.target.getAttribute("data-path");
    // Найти индекс трека в списке по его пути
    let trackIndex = track_list.indexOf(track_list.find(track => track.path === songPath));
    // Загрузить трек по индексу
    loadTrack(trackIndex);
    // Воспроизвести трек
    playPauseTrack();
    // Удалить класс active со всех пунктов плейлиста
    let items = playlist.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("active");
    }
    // Добавить класс active к нажатому пункту плейлиста
    e.target.classList.add("active");
  }
});