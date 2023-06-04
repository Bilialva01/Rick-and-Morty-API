// Axios
const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
});

//-----------------------------------------------//

let paginaAtual = 1
let totalPaginas = 0
let personagens = []

const qtdPersonagens = document.getElementById('qtd-personagens');
const qtdLocalizacoes = document.getElementById('qtd-localizacoes');
const qtdEpisodios = document.getElementById('qtd-episodios');

const buttonPrev = document.getElementById('btn-prev');
const buttonActual = document.getElementById('btn-actual');
const buttonNext = document.getElementById('btn-next');


const url = "https://rickandmortyapi.com/api/character";

const montarCards = async()=>{
    const api = await fetch(url)
    const data= await api.json()

    divRes = document.querySelector("#dados")
    divRes.innerHTML = ""
    personagens.map(item=>{
        divItem = document.createElement('div')
        divItem.innerHTML = `
        <div class="card mb-3" style="max-width: 500px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${item.image}" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${cardStatus(item.status)}</p>
                        <p class="card-text"><b>Espécie: </b>${item.species}</p>
                        <p class="card-text"><b>Gênero: </b>${item.gender}</p>
                    </div>
                </div>
            </div>
        </div>
        `
        divRes.appendChild(divItem);
    })
}

const cardStatus = (status) =>{

    switch (status) {
        case "Alive":
            return  `<span class="dot circle__green"></span> <b> Status: </b> Alive`
        case "Dead":
            return `<span class="dot circle__red"></span><b> Status: </b> Dead`
        default:
            return `<span class="dot circle__gray"></span> <b> Status: </b>Unknown`
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    const respostaPersonagens = await api.get('/character');
    qtdPersonagens.innerHTML = `Personagens: ${respostaPersonagens.data.info.count}`

    totalPaginas = respostaPersonagens.data.info.pages
    personagens = respostaPersonagens.data.results
    montarCards()

    const respostaLocalizacoes = await api.get('/location');
    qtdLocalizacoes.innerHTML = `Localizações: ${respostaLocalizacoes.data.info.count}`

    const respostaEspisodios = await api.get('/episode');
    qtdEpisodios.innerHTML = `Episódios: ${respostaEspisodios.data.info.count}`

    mudaBotoesPaginacao(respostaPersonagens.data.info.prev, respostaPersonagens.data.info.next)
});

async function buscaDadosPersonagens() {

    const respostaPersonagens = await api.get('/character', {
        params: {
            page: paginaAtual
        }
    });

    personagens = respostaPersonagens.data.results
    montarCards()

    mudaBotoesPaginacao(respostaPersonagens.data.info.prev, respostaPersonagens.data.info.next)
}

buttonPrev.addEventListener('click', async () => {
    if ((paginaAtual - 1) >= 1) {
        paginaAtual--
        await buscaDadosPersonagens()
    } else {
        buttonPrev.setAttribute('style', 'display: none;')
    }
})

buttonNext.addEventListener('click', async () => {
    if ((paginaAtual + 1) <= totalPaginas) {
        paginaAtual++
        await buscaDadosPersonagens()
    } else {
        buttonNext.setAttribute('style', 'display: none')
    }
})

function mudaBotoesPaginacao(prev, next) {
    buttonActual.innerText = `Página ${paginaAtual}`

    if (prev) {
        buttonPrev.setAttribute('style', 'display: 1')
    } else {
        buttonPrev.setAttribute('style', 'display: none')
    }

    if (next) {
        buttonNext.setAttribute('style', 'opacity: 1')
    } else {
        buttonNext.setAttribute('style', 'display: none')
    }
}

