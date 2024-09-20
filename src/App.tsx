import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const [dogePrice, setDogePrice] = useState(0.068);
  const [dogeOwned, setDogeOwned] = useState<number>(3353.35);
  const [usdInvested, setUSDInvested] = useState<number>(1159.47);
  const [metricSteps, setMetricSteps] = useState(5);

  useEffect(() => {
    fetch("https://sochain.com//api/v2/get_price/DOGE/USD")
      .then((r) => r.json())
      .then((p) => {
        if (p.status === "success") {
          setDogePrice(Number(p.data.prices[0].price));
        }
      })
      .catch(() => console.error("failed to fetch"));
  }, []);

  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const met = [];

    for (let i = 0; i < metricSteps; i++) {
      const newDoge = i * dogeOwned;
      const newUSD = newDoge * dogePrice;

      const totalDoge = newDoge + dogeOwned;
      const totalInvest = newUSD + usdInvested;

      met.push({
        newDoge,
        newUSD,
        totalDoge,
        totalInvest,
        breakEven: totalInvest / totalDoge
      });
    }

    setMetrics([...met]);
  }, [dogePrice, dogeOwned, usdInvested, metricSteps]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "sans-serif"
      }}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        DOGE Price
        <input
          type="number"
          placeholder="Price of DOGE"
          value={dogePrice}
          onChange={(e) => setDogePrice(Number(e.currentTarget.value))}
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        DOGE Currently Owned
        <input
          type="number"
          placeholder="Amount of DOGE You own"
          value={dogeOwned}
          onChange={(e) => setDogeOwned(Number(e.currentTarget.value))}
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        Total USD Invested
        <input
          type="number"
          placeholder="Amount you've invested"
          value={usdInvested}
          onChange={(e) => setUSDInvested(Number(e.currentTarget.value))}
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        Number of Strategies Below ({metricSteps})
        <input
          type="range"
          step="1"
          min="1"
          max="20"
          value={metricSteps}
          onChange={(e) => setMetricSteps(Number(e.currentTarget.value))}
        />
      </label>
      {metrics.map((m) => (
        <>
          <h1 style={{ fontSize: "20px", margin: "5px" }}>
            You buy {m.newDoge} more DOGE
          </h1>
          <ul>
            <li>You spend ${m.newUSD} on this DOGE</li>
            <li>Total DOGE owned becomes: {m.totalDoge}</li>
            <li>Total Invested becomes: ${m.totalInvest}</li>
            <li>To break even, you will sell at {m.breakEven} / DOGE</li>
          </ul>
        </>
      ))}
    </div>
  );
}
