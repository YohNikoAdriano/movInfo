// Latihan Asynchronous Callback dengan API dan Bootstrap
// api: OMDb API
// api key: http://www.omdbapi.com/?apikey=e7773d79
// test request API: Postman

// Menggunakan Promise
// Object yang merepresentasikan keberhasilan atau kegagaaln dari sebuah event yang asynchronous di masa yang akan datang

// promise/janji (terpenuhi / diingkari / waktu tunggu)
// states (fullfilled / rejected / pending)

// callback (resolve / reject / finally)
// resolve ketika janji terpenuhi, reject ketika janji tidak terpenuhi, finally ketika waktu tunggu selesai

// aksi (then / catch)
// then akan menjalankan resolve, catch akan menjalankan reject

const searchInput = document.querySelector('.search-key');
const submitBtn = document.querySelector('.submit');
// fetch dilakukan di dalam function terpisah yaitu getMovies agar lebih modular, 
// function getMovies adalah function async dimana harus diberikan keyword await pada pemanggilan function
// function parent pada event listener harus diberikan keyword async yang menandakan adanya function async di dalam function tersebut
submitBtn.addEventListener('click', async function(){
    try{
        const movies = await getMovies(searchInput.value);
        updateUI(movies);
    } catch(error){
        showError(error);
    }
    
});

function getMovies(keyword){
    return fetch('https://www.omdbapi.com/?apikey=e7773d79&s=' + keyword)
        // jika berhasil, maka
        .then(response => {
            if(!response.ok){
                throw new Error(response.statusText);
            }
            return response.json(); // mengubah promise menjadi json
        }) 
        .then(response => {
            if(response.Response === 'False'){
                throw new Error(response.Error);
            }
            return response.Search;
        });
}

function updateUI(movies){
    let cards = '';
    movies.forEach(element => {
        cards += showCardMovies(element);
    });
    const movContainer = document.querySelector('.mov-container');
    movContainer.innerHTML = cards;
}

function showError(error){
    const movContainer = document.querySelector('.mov-container');
    movContainer.innerHTML = error;
}

// event binding
// digunakan pada btnDetail dimana btn tersebut belum muncul pada saat pertama kali website dijalankan
// event binding digunakan untuk memberikan event ke element yang awalnya belum ada, ketika element sudah ada event tetap berjalan
document.addEventListener('click', async function(e){
    if(e.target.classList.contains('btn-detail')){
        const imdbid = e.target.dataset.imdbid;
        const movieDetail = await getMovieDetail(imdbid);
        updateUIDetail(movieDetail);
    }
});

function getMovieDetail(imdbid){
    return fetch('https://www.omdbapi.com/?apikey=e7773d79&i=' + imdbid)
    .then(response => response.json())
    .then(response => response);
}

function updateUIDetail(movieDetail){
    const movDetail = showMovieDetail(movieDetail);
    const modBody = document.querySelector('.modal-body');
    modBody.innerHTML = movDetail;
}

function showCardMovies(element){
    return `
        <div class="col-lg-3 col-md-4 p-3">
            <div class="card">
                <img src="${element.Poster}" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${element.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${element.Year}</h6>
                    <a href="#" class="btn btn-primary btn-detail" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdbid="${element.imdbID}">Show Detail</a>
                </div>
            </div>
        </div>
    `;
};

function showMovieDetail(result){
    return `
        <div class="container-fluid">
            <div class="row">
                <div class="col-3">
                    <img src="${result.Poster}" alt="" class="img-fluid">
                </div>
                <div class="col-9">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><h4>${result.Title} (${result.Year})</h4></li>
                        <li class="list-group-item"><strong>Genre: </strong>${result.Genre}</li>
                        <li class="list-group-item"><strong>Rated: </strong>${result.Rated}</li>
                        <li class="list-group-item"><strong>Runtime: </strong>${result.Runtime}</li>
                        <li class="list-group-item"><strong>Director: </strong>${result.Director}</li>
                        <li class="list-group-item"><strong>Actors: </strong>${result.Actors}</li>
                        <li class="list-group-item"><strong>Plot: </strong>${result.Plot}</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}


