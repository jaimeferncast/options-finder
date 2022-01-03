import "semantic-ui-css/semantic.min.css";

import { useState, useEffect, useRef } from "react";

import emailjs from "@emailjs/browser";

import "./App.css";
import {
  Container,
  Form,
  Input,
  Header,
  Label,
  Button,
  Icon,
  Divider,
  Message,
} from "semantic-ui-react";

import stocksList from "../data.js";
import AlphaVantageService from "../service/alpha-vantage.service";

function App() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const alphaVantageService = new AlphaVantageService();
  // const delay = 180000;
  const delay = 10000;

  const handleInputChange = (e) => {
    error && setError("");
    const { value } = e.target;
    setName(value);
  };

  const submit = async () => {
    setIsLoading(true);
    setError("");
    setData(null);

    const response = await alphaVantageService.getRSI(name);
    if (!response.data["Technical Analysis: RSI"]) setError("Symbol not found");
    else {
      setData(
        response.data["Technical Analysis: RSI"][
          Object.keys(response.data["Technical Analysis: RSI"])[0]
        ]
      );
      setName("");
      setIsLoading(false);
    }
  };

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      const tick = () => {
        savedCallback.current();
      };

      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useInterval(
    () => {
      console.log("analizing...", index);
      if (index === stocksList.length) setIndex(0);
      else {
        const code = stocksList[index];

        alphaVantageService.getRSI(code).then((response) => {
          const value =
            response.data["Technical Analysis: RSI"][
              Object.keys(response.data["Technical Analysis: RSI"])[0]
            ].RSI;

          if (!response.data["Technical Analysis: RSI"]) {
            emailjs.send(
              "optionsFinder",
              "template_zul55th",
              { stock: code.toUpperCase(), value },
              "user_oXSQFf0rfZ6DBbDUFwVxB",
              "19aaf1817399c2b0bf6a2be48ed26012"
            );
            setInfo(`last updated at ${new Date().toString()}`);
          } else if (+value < 35) {
            emailjs.send(
              "optionsFinder",
              "template_zul55th",
              { stock: code.toUpperCase(), value },
              "user_oXSQFf0rfZ6DBbDUFwVxB",
              "19aaf1817399c2b0bf6a2be48ed26012"
            );
            setInfo(`last updated at ${new Date().toString()}`);
          } else {
            emailjs.send(
              "optionsFinder",
              "template_zul55th",
              { stock: code.toUpperCase(), value },
              "user_oXSQFf0rfZ6DBbDUFwVxB",
              "19aaf1817399c2b0bf6a2be48ed26012"
            );
            setInfo(`last updated at ${new Date().toString()}`);
          }
        });

        setIndex(index + 1);
      }
    },
    isTimerRunning ? delay : null
  );

  const runSearch = () => {
    setIsTimerRunning(true);
  };

  const pauseSearch = () => {
    setIsTimerRunning(false);
    setIndex(0);
  };

  return (
    <main style={{ paddingTop: 20 }}>
      <Container>
        <Header as="h1" textAlign="center">
          Oversold stocks finder
        </Header>
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
            {!!error && (
              <Label basic color="red" pointing>
                {error}
              </Label>
            )}
          </Form.Field>
        </Form>
        {data && (
          <pre>
            <code>{JSON.stringify(data, null, 4)}</code>
          </pre>
        )}
        <Divider />
        <Button icon labelPosition="right" color="green" onClick={runSearch}>
          <Icon name="play" />
          Run Search
        </Button>
        <Button icon labelPosition="left" color="red" onClick={pauseSearch}>
          <Icon name="pause" />
          Pause
        </Button>
        {!!info && (
          <Message color="yellow">
            <Message.Header>{info}</Message.Header>
          </Message>
        )}
        <Message info>
          <Message.Header>List of Companies:</Message.Header>
          {stocksList.map((s) => (
            <Label>{s.toUpperCase()}</Label>
          ))}
        </Message>
      </Container>
    </main>
  );
}

export default App;
