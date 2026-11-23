const filtroQuadro = document.getElementById("filtro-quadro");
const btnAtualizar = document.getElementById("btn-atualizar");

const tabelaBicicletas = document.getElementById("tabela-bicicletas");
const tabelaInteressados = document.getElementById("tabela-interessados");
const tabelaEscolhas = document.getElementById("tabela-escolhas");

async function carregarBicicletas() {
    try{
        const quadroSelecionado = filtroQuadro.value;
        const url = quadroSelecionado 
        ? `/bicicletas?quadro=${quadroSelecionado}` 
        : "/bicicletas";

        const resposta = await fetch(url);
        const bicicletas = await resposta.json();

        if (bicicletas.length === 0) {
            tabelaBicicletas.innerHTML = "<tr><td colspan='4'>Nenhuma bicicleta encontrada.</td></tr>";
            return;
        }
    
        tabelaBicicletas.innerHTML = bicicletas
        .map(
            (bike) => `
                <tr>
                    <td>${bike.id_bicicleta}</td>
                    <td>Quadro ${bike.quadro_bicicleta}</td>
                    <td>${bike.cor_bicicleta}</td>
                    <td>${bike.disponivel ? "Disponível" : "Indisponível"}</td>
                </tr>
            `
        )
        .join("");  
     } catch (erro) {
        console.error("Erro ao carregar bicicletas:", erro);
        tabelaBicicletas.innerHTML = "<tr><td colspan='4'>Erro ao carregar bicicletas.</td></tr>";
    }
}

async function carregarInteressados() {
    try {
        const resposta = await fetch("/interessados");
        const interessados = await resposta.json();

        if (interessados.length === 0) {
            tabelaInteressados.innerHTML = "<tr><td colspan='3'>Nenhum interessado encontrado.</td></tr>";
            return;
        }

        tabelaInteressados.innerHTML = interessados
            .map(
                (pessoa) => `
                <tr>
                    <td>${pessoa.id_interessado}</td>
                    <td>${pessoa.nome_interessado}</td>
                    <td>${pessoa.altura_interessado} m</td>
                    <td>Quadro ${pessoa.quadro_recomendado}</td>
                    <td>${pessoa.fone_interessado}</td>
                </tr>
            `
            )
            .join("");
    } catch (erro) {
        console.error("Erro ao carregar interessados:", erro);
        tabelaInteressados.innerHTML = "<tr><td colspan='3'>Erro ao carregar interessados.</td></tr>";
    }
}

async function carregarEscolhas() {
    try {
        const resposta = await fetch("/escolhas");
        const escolhas = await resposta.json();

        if (escolhas.length === 0) {
            tabelaEscolhas.innerHTML = "<tr><td colspan='4'>Nenhuma escolha encontrada.</td></tr>";
            return;
        }

        tabelaEscolhas.innerHTML = escolhas
            .map((item) => {
                const dataFormatada = new Date(item.data_escolha).toLocaleDateString("pt-BR");
                const nomePessoa = item.interessado?.nome_interessado ?? "-";
                const alturaPessoa = item.interessado?.altura_interessado ?? "-";
                const infoBike = item.bicicleta
                    ? `${item.bicicleta.cor_bicicleta}, (Quadro ${item.bicicleta.quadro_bicicleta})`
                    : "-";

                return `
                    <tr>
                        <td>${item.id_escolha}</td>
                        <td>${nomePessoa}</td>
                        <td>${alturaPessoa} m</td>
                        <td>${infoBike}</td>
                        <td>${dataFormatada}</td>
                    </tr>
                `;
            })
            .join("");
    } catch (erro) {
        console.error("Erro ao carregar escolhas:", erro);
        tabelaEscolhas.innerHTML = "<tr><td colspan='4'>Erro ao carregar escolhas.</td></tr>";
    }
}

function carregarTudo() {
    carregarBicicletas();
    carregarInteressados();
    carregarEscolhas();
}

btnAtualizar.addEventListener("click", carregarTudo);
filtroQuadro.addEventListener("change", carregarBicicletas);

carregarTudo();