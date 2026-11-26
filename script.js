// Conversor de Real e Dolar
// API: AwesomeAPI (https://docs.awesomeapi.com.br/api-de-moedas)

const API_URL = "https://economia.awesomeapi.com.br/json/last/USD-BRL";

const estado = {
    direcao: "BRL-USD", // "BRL-USD" = real para dolar, "USD-BRL" = dolar para real
    cotacao: null //quantos reais valem 1 dolar
};

const form = document.getElementById("form-conversao");
const campoValor = document.getElementById("valor");
const saida = document.getElementById("resultado");
const rotuloOrigem = document.getElementById("rotulo-origem");
const rotuloDestino = document.getElementById("rotulo-destino");
const msgErro = document.getElementById("erro-valor");
const infoCotacao = document.getElementById("cotacao-info");
const btnInverter = document.getElementById("btn-inverter");

const mascara = (typeof IMask !== "undefined")
  ? IMask(campoValor, {
      mask: Number,          // máscara numérica
      scale: 2,              // 2 casas decimais
      radix: ",",            // vírgula separa os centavos
      thousandsSeparator: ".",
      mapToRadix: ["."],     // se a pessoa digitar ponto, vira vírgula
      min: 0
    })
  : null;

  // Formatadores de moeda ("R$ 1.234,56" e "US$ 1.234,56")
const formatoReal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const formatoDolar = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" });


// Busca a cotação na API com fetch
async function buscarCotacao() {
  const resposta = await fetch(API_URL);


  if (!resposta.ok) {
    throw new Error("A API respondeu com status " + resposta.status);
  }


  const dados = await resposta.json();
  return {
    valor: parseFloat(dados.USDBRL.bid),
    data: dados.USDBRL.create_date
  };
}


function lerValorDigitado() {
  const texto = campoValor.value.trim();
  if (texto === "") {
    return null;
  }


  const numero = mascara ? mascara.typedValue : Number(texto.replace(",", "."));
  if (!Number.isFinite(numero) || numero < 0) {
    return null;
  }
  return numero;
}


function converter() {
  const valor = lerValorDigitado();

  if (valor === null) {
    mostrarErro("Digite um número válido, por exemplo 150 ou 49,90.");
    return;
  }
  if (estado.cotacao === null) {
    mostrarErro("A cotação ainda não chegou. Tente de novo em instantes.");
    return;
  }
  limparErro();

  if (estado.direcao === "BRL-USD") {
    saida.textContent = formatoDolar.format(valor / estado.cotacao);
  } else {
    saida.textContent = formatoReal.format(valor * estado.cotacao);
  }
}

function mostrarErro(mensagem) {
  msgErro.textContent = mensagem;
  msgErro.hidden = false;
  campoValor.setAttribute("aria-invalid", "true");
}

function limparErro() {
  msgErro.hidden = true;
  campoValor.removeAttribute("aria-invalid");
}

function inverterDirecao() {
  const eraBRL = estado.direcao === "BRL-USD";
  estado.direcao = eraBRL ? "USD-BRL" : "BRL-USD";
  rotuloOrigem.textContent = eraBRL ? "Valor em dólares (USD)" : "Valor em reais (BRL)";
  rotuloDestino.textContent = eraBRL ? "Valor em reais (BRL)" : "Valor em dólares (USD)";
  converter();
}

async function iniciar() {
  try {
    const atual = await buscarCotacao();
    estado.cotacao = atual.valor;
    infoCotacao.textContent =
      "Cotação usada: 1 dólar = " + formatoReal.format(atual.valor) +
      " (atualizada em " + atual.data + ").";
    converter();
  } catch (erro) {
    console.error(erro);
    infoCotacao.textContent =
      "Não foi possível buscar a cotação agora. Verifique sua conexão e recarregue a página.";
  }
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault(); // impede o formulário de recarregar a página
  converter();
});
btnInverter.addEventListener("click", inverterDirecao);

iniciar();