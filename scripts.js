//  OBTENDO ELEMENTOS DO FORMULÁRIO
const apiKeyInput = document.getElementById("apiKey") // Campo para a chave de API
const gameSelect = document.getElementById("gameSelect") // Seletor de jogos
const questionInput = document.getElementById("questionInput") // Campo de pergunta
const askButton = document.getElementById("askButton") // Botão de enviar
const aiResponse = document.getElementById("aiResponse") // Área de resposta da IA
const form = document.getElementById("form") // Formulário principal

// FUNÇÃO PARA ENVIAR O FORMULÁRIO
const enviarFormulario = (event) => {
  event.preventDefault() // Impede o recarregamento da página
  console.log(event)
}

form.addEventListener("submit", enviarFormulario)
