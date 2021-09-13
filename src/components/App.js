import 'semantic-ui-css/semantic.min.css'

import { useState } from "react"

import { Container, Form, Input, Header, Label } from 'semantic-ui-react'

import AlphaVantageService from '../service/alpha-vantage.service'

function App() {

  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  const alphaVantageService = new AlphaVantageService()

  const handleInputChange = (e) => {
    error && setError(false)
    const { value } = e.target
    setName(value)
  }

  const submit = async () => {
    setIsLoading(true)
    setError(false)

    const response = await alphaVantageService.getRSI(name)
    if (response.data === {}) setError(true)
    else {
      setData(response.data)
      setName("")
      setIsLoading(false)
    }
  }

  return (
    <main style={{ paddingTop: 20 }}>
      <Container>
        <Header as="h1" textAlign="center">Hola Julia</Header>
        <Form onSubmit={submit}>
          <Form.Field>
            <Input
              placeholder="enter symbol..."
              action={{ content: "search", type: "submit" }}
              fluid
              loading={isLoading}
              iconPosition="left"
              error={error}
              value={name}
              onChange={handleInputChange}
            />
            {error &&
              <Label basic color='red' pointing>
                Symbol not found
              </Label>
            }
          </Form.Field>
        </Form>
        {data &&
          <pre>
            <code>
              {JSON.stringify(data, null, 4)}
            </code>
          </pre>
        }
      </Container>
    </main>
  )
}

export default App
