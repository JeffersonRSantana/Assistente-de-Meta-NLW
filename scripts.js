//  OBTENDO ELEMENTOS DO FORMULÁRIO
const apiKeyInput = document.getElementById("apiKey") // Campo para a chave de API
const gameSelect = document.getElementById("gameSelect") // Seletor de jogos
const questionInput = document.getElementById("questionInput") // Campo de pergunta
const askButton = document.getElementById("askButton") // Botão de enviar
const aiResponse = document.getElementById("aiResponse") // Área de resposta da IA
const form = document.getElementById("form") // Formulário principal

// Função que converte texto em formato Markdown para HTML
const markdownToHTML = (text) => {
  // Cria uma nova instância do conversor Showdown
  // Showdown é uma biblioteca JavaScript para conversão Markdown-HTML
  const converter = new showdown.Converter()

  // Converte o texto Markdown recebido para HTML e retorna o resultado
  return converter.makeHtml(text)
}
const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.0-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  const pergunta = `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo ${game}

  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

  ## Regras
  - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
  - Considere a data atual ${new Date().toLocaleDateString()}
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
  - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.

  ## Resposta
  - Economize na resposta, seja direto e responda no máximo 500 caracteres
  - Responda em markdown
  - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

  ## Exemplo de resposta
  pergunta do usuário: Melhor build rengar jungle
  resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

  ---
  Aqui está a pergunta do usuário: ${question}
`

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: pergunta,
        },
      ],
    },
  ]

  const tools = [
    {
      google_search: {},
    },
  ]

  // CHAMADA API
  const response = await fetch(geminiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      tools,
    }),
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// FUNÇÃO PARA ENVIAR O FORMULÁRIO
const enviarFormulario = async (event) => {
  event.preventDefault() // Impede o recarregamento da página
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey == "" || game == "" || question == "") {
    alert("Por favor, preencha todos os campos")
    return
  }

  askButton.disabled = true
  askButton.textContent = "Perguntando..."
  askButton.classList.add("loading")

  try {
    // Perguntar para IA
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector(".response-content").innerHTML =
      markdownToHTML(text)
    aiResponse.classList.remove("hidden")
  } catch (error) {
    console.log("Erro: ", error)
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove("loading")
  }
}
form.addEventListener("submit", enviarFormulario)
