import axios from 'axios'

class AlphaVantageService {

  constructor() {
    this.api = axios.create({
      baseURL: 'https://www.alphavantage.co',
      json: true,
    })
  }

  getRSI = (symbol) => this.api.get(`/query?function=RSI&symbol=${symbol}&interval=weekly&time_period=10&series_type=open&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`)
}

export default AlphaVantageService
