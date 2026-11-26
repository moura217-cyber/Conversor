// Conversor de Real e Dolar
// API: AwesomeAPI (https://docs.awesomeapi.com.br/api-de-moedas)

const API_URL = "https://economia.awesomeapi.com.br/json/last/USD-BRL";

const estado = {
    direcao: "BRL-USD", // "BRL-USD" = real para dolar, "USD-BRL" = dolar para real
    cotacao: null //quantos reais valem 1 dolar
};