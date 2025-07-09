//  OBTENDO ELEMENTOS DO FORMULÁRIO
const apiKeyInput = document.getElementById("apiKey") // Campo para a chave de API
const gameSelect = document.getElementById("gameSelect") // Seletor de jogos
const questionInput = document.getElementById("questionInput") // Campo de pergunta
const askButton = document.getElementById("askButton") // Botão de enviar
const aiResponse = document.getElementById("aiResponse") // Área de resposta da IA
const form = document.getElementById("form") // Formulário principal

// Função que converte texto em formato Markdown para HTML
const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.0-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  // Prompts específicos para cada jogo
  const prompts = {
    "League of Legends": `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo League of Legends.
  
  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas.
  
  ## Regras
  - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
  - Considere a data atual ${new Date().toLocaleDateString()}.
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
  - Nunca responda itens que você não tenha certeza que existem no patch atual.
  
  ## Resposta
  - Seja direto e responda no máximo 500 caracteres.
  - Responda em markdown.
  - Não faça saudações nem despedidas.
  
  ---
  Aqui está a pergunta do usuário: ${question}`,

    "Dota 2": `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo Dota 2.
  
  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas.
  
  ## Regras
  - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
  - Considere a data atual ${new Date().toLocaleDateString()}.
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
  - Nunca responda itens que você não tenha certeza que existem no patch atual.
  
  ## Resposta
  - Seja direto e responda no máximo 500 caracteres.
  - Responda em markdown.
  - Não faça saudações nem despedidas.
  
  ---
  Aqui está a pergunta do usuário: ${question}`,

    "CS:GO": `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo CS:GO.
  
  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, armas, posicionamento e dicas.
  
  ## Regras
  - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
  - Considere a data atual ${new Date().toLocaleDateString()}.
  - Faça pesquisas atualizadas sobre o meta atual, baseado na data atual, para dar uma resposta coerente.
  
  ## Resposta
  - Seja direto e responda no máximo 500 caracteres.
  - Responda em markdown.
  - Não faça saudações nem despedidas.
  
  ---
  Aqui está a pergunta do usuário: ${question}`,

    Valorant: `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo Valorant.
  
  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, agentes, armas e dicas.
  
  ## Regras
  - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
  - Considere a data atual ${new Date().toLocaleDateString()}.
  - Faça pesquisas atualizadas sobre o meta atual, baseado na data atual, para dar uma resposta coerente.
  
  ## Resposta
  - Seja direto e responda no máximo 500 caracteres.
  - Responda em markdown.
  - Não faça saudações nem despedidas.
  
  ---
  Aqui está a pergunta do usuário: ${question}`,
  }

  // Seleciona o prompt correto conforme o jogo; se não existir, usa um genérico
  const pergunta =
    prompts[game] ||
    `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo ${game}.
  
  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas.
  
  ## Regras
  - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
  - Considere a data atual ${new Date().toLocaleDateString()}.
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
  
  ## Resposta
  - Seja direto e responda no máximo 500 caracteres.
  - Responda em markdown.
  - Não faça saudações nem despedidas.
  
  ---
  Aqui está a pergunta do usuário: ${question}`

  const contents = [
    {
      role: "user",
      parts: [{ text: pergunta }],
    },
  ]

  const tools = [{ google_search: {} }]

  const response = await fetch(geminiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents, tools }),
  })

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const resposta = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Resposta não encontrada."

  if (!resposta) {
    throw new Error("A API não retornou uma resposta válida.")
  }

  return resposta
}


// FUNÇÃO PARA ENVIAR O FORMULÁRIO
const enviarFormulario = async (event) => {
  event.preventDefault() // Impede o recarregamento da página
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey.trim() === "" || game.trim() === "" || question.trim() === "") {
    alert("Por favor, preencha todos os campos ")
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
