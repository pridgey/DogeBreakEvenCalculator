import {
  createEffect,
  createSignal,
  For,
  onMount,
  type Component,
} from "solid-js";

type DogeMetric = {
  newDoge: number;
  newUSD: number;
  totalDoge: number;
  totalInvest: number;
  breakEven: number;
};

const App: Component = () => {
  // Get user settings from storage
  const dogeOwned_Storage = window.localStorage.getItem("dogeOwned");
  const usdInvested_Storage = window.localStorage.getItem("usdInvested");

  const [dogePrice, setDogePrice] = createSignal(0);
  const [dogeOwned, setDogeOwned] = createSignal(
    dogeOwned_Storage ? Number(dogeOwned_Storage) : 0
  );
  const [usdInvested, setUsdInvested] = createSignal(
    usdInvested_Storage ? Number(usdInvested_Storage) : 0
  );
  const [metricSteps, setMetricSteps] = createSignal(15);
  const [metrics, setMetrics] = createSignal<DogeMetric[]>([]);

  // Get doge price from API
  onMount(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd",
      {
        headers: {
          accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDogePrice(data.dogecoin.usd);
      });
  });

  // Calculate strategies for breaking even
  createEffect(() => {
    const met = [];

    for (let i = 0; i < metricSteps(); i++) {
      const newDoge = i * dogeOwned();
      const newUSD = newDoge * dogePrice();

      const totalDoge = newDoge + dogeOwned();
      const totalInvest = newUSD + usdInvested();

      met.push({
        newDoge,
        newUSD,
        totalDoge,
        totalInvest,
        breakEven: totalInvest / totalDoge,
      });
    }

    setMetrics([...met]);
  });

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "10px",
        "font-family": "sans-serif",
        padding: "30px",
      }}
    >
      <label
        style={{ display: "flex", "flex-direction": "column", gap: "5px" }}
      >
        DOGE Price
        <input
          type="number"
          placeholder="Price of DOGE"
          value={dogePrice()}
          onChange={(e) => {
            setDogePrice(Number(e.currentTarget.value));
          }}
        />
      </label>
      <label
        style={{ display: "flex", "flex-direction": "column", gap: "5px" }}
      >
        DOGE Currently Owned
        <input
          type="number"
          placeholder="Amount of DOGE You own"
          value={dogeOwned()}
          onChange={(e) => {
            window.localStorage.setItem("dogeOwned", e.currentTarget.value);
            setDogeOwned(Number(e.currentTarget.value));
          }}
        />
      </label>
      <label
        style={{ display: "flex", "flex-direction": "column", gap: "5px" }}
      >
        Total USD Invested
        <input
          type="number"
          placeholder="Amount you've invested"
          value={usdInvested()}
          onChange={(e) => {
            window.localStorage.setItem("usdInvested", e.currentTarget.value);
            setUsdInvested(Number(e.currentTarget.value));
          }}
        />
      </label>
      <label
        style={{ display: "flex", "flex-direction": "column", gap: "5px" }}
      >
        Number of Strategies Below ({metricSteps()})
        <input
          type="range"
          step="1"
          min="1"
          max="50"
          value={metricSteps()}
          onInput={(e) => setMetricSteps(Number(e.currentTarget.value))}
        />
      </label>
      <For each={metrics()}>
        {(m) => (
          <>
            <h1 style={{ "font-size": "20px", margin: "5px" }}>
              You buy {m.newDoge.toLocaleString()} more DOGE
            </h1>
            <ul>
              <li>You spend ${m.newUSD.toLocaleString()} on this DOGE</li>
              <li>Total DOGE owned becomes: {m.totalDoge.toLocaleString()}</li>
              <li>Total Invested becomes: ${m.totalInvest.toLocaleString()}</li>
              <li>
                To break even, you will sell at {m.breakEven.toLocaleString()} /
                DOGE
              </li>
            </ul>
          </>
        )}
      </For>
    </div>
  );
};

export default App;
