import React, { useState } from 'react'
import { Button, Container, TextField } from '@mui/material'
import { Configuration, OpenAIApi } from 'openai'
import openAIConfig from './env'

const App = (): JSX.Element => {
  const [dailyCalories, setdailyCalories] = useState('1500')
  const [foodRestriction, setFoodRestriction] = useState('')
  const [dietDuration, setDietDuration] = useState('1')
  const [response, setResponse] = useState('')
  const [loader, setLoader] = useState(false)

  const configuration = new Configuration({
    apiKey: openAIConfig.apiKey
  })
  const openAi = new OpenAIApi(configuration)

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    setLoader(true)
    event.preventDefault()
    const question = (foodRestriction === '')
      ? `Quero uma lista de compras para ${dietDuration} dias, com o limite de ${dailyCalories} calorias diárias.`
      : `Quero uma lista de compras para ${dietDuration} dias, com o limite de ${dailyCalories} calorias diárias, com as seguintes restrições: ${foodRestriction}.`

    try {
      const response = await openAi.createCompletion({
        model: 'text-davinci-003',
        prompt: question,
        max_tokens: 2048,
        n: 1
      })

      setResponse(response.data.choices[0].text ?? '')
    } catch (error) {
      console.error('Error to send question', error)
    }

    setLoader(false)
  }

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Calorias Diárias"
          value={dailyCalories}
          onChange={(event) => setdailyCalories(event.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Duração da Dieta (em dias)"
          value={dietDuration}
          onChange={(event) => setDietDuration(event.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Restrição Alimentar"
          value={foodRestriction}
          onChange={(event) => setFoodRestriction(event.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loader}>
          Enviar
        </Button>
      </form>
      <div>
        <pre>{response}</pre>
      </div>
    </Container>
  )
}

export default App
