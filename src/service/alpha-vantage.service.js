import axios from "axios";

class AlphaVantageService {
  constructor() {
    this.api = axios.create({
      baseURL: "https://www.alphavantage.co",
      json: true,
    });
  }

  getRSI = (symbol) =>
    this.api.get(
      `/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
}

export default AlphaVantageService;
