import React, { useState } from 'react'
import { Button, Container, TextField } from '@mui/material'
import { Configuration, OpenAIApi } from 'openai'
import openAIConfig from './env'

const App = (): JSX.Element => {
  const [caloriasDiarias, setCaloriasDiarias] = useState('1500')
  const [restricaoAlimentar, setRestricaoAlimentar] = useState('')
  const [duracaoDieta, setDuracaoDieta] = useState('1')
  const [respostaApi, setRespostaApi] = useState('')

  const configuration = new Configuration({
    apiKey: openAIConfig.apiKey
  })
  const openAi = new OpenAIApi(configuration)

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    const question = (restricaoAlimentar === '')
      ? `Quero uma lista de compras para ${duracaoDieta} dias, com o limite de ${caloriasDiarias} calorias diárias.`
      : `Quero uma lista de compras para ${duracaoDieta} dias, com o limite de ${caloriasDiarias} calorias diárias, com as seguintes restrições: ${restricaoAlimentar}.`

    try {
      const response = await openAi.createCompletion({
        model: 'text-davinci-003',
        prompt: question,
        max_tokens: 2048,
        n: 1
      })

      setRespostaApi(response.data.choices[0].text ?? '')
    } catch (error) {
      console.error('Erro ao enviar o formulário', error)
    }
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Calorias Diárias"
          value={caloriasDiarias}
          onChange={(event) => setCaloriasDiarias(event.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Duração da Dieta (em dias)"
          value={duracaoDieta}
          onChange={(event) => setDuracaoDieta(event.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Restrição Alimentar"
          value={restricaoAlimentar}
          onChange={(event) => setRestricaoAlimentar(event.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar
        </Button>
      </form>
      <div>
        <h3>Resposta da API:</h3>
        <pre>{respostaApi}</pre>
      </div>
    </Container>
  )
}

export default App
