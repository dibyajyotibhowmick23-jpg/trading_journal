import { useEffect, useState } from "react";

function App() {
  const [trades, setTrades] = useState([]);
  const [stock, setStock] = useState("");
  const [pnl, setPnl] = useState("");
  const [filter, setFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // FETCH TRADES
  const fetchTrades = () => {
    fetch("http://localhost:5000/api/trades")
      .then((res) => res.json())
      .then((data) => setTrades(data));
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // ADD TRADE
  const addTrade = () => {
    fetch("http://localhost:5000/api/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock, pnl }),
    }).then(() => {
      setStock("");
      setPnl("");
      fetchTrades();
    });
  };

  // 📊 STEP 1: GROUP BY DAY
  const dayData = {};

  trades.forEach((t) => {
    if (!t.date) return;

    const day = new Date(t.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!dayData[day]) {
      dayData[day] = { total: 0, wins: 0 };
    }

    dayData[day].total += 1;

    if (Number(t.pnl) > 0) {
      dayData[day].wins += 1;
    }
  });

  // 📊 STEP 2: CONVERT TO ARRAY
  const dayStats = Object.keys(dayData).map((day) => ({
    day,
    percentage:
      (dayData[day].wins / dayData[day].total) * 100,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Trading Dashboard</h1>

      {/* ADD TRADE */}
      <input
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <input
        placeholder="PnL"
        type="number"
        value={pnl}
        onChange={(e) => setPnl(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <button onClick={addTrade}>Add Trade</button>

      <br /><br />

      {/* FILTERS */}
      <input
        placeholder="Filter by stock"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <input
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <button onClick={() => {
        setFilter("");
        setDateFilter("");
      }}>
        Clear Filters
      </button>

      <br /><br />

      {/* MAIN TABLE */}
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Stock</th>
            <th>PnL</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {trades
            .filter((t) => {
              const matchStock = t.stock
                ?.toLowerCase()
                .includes(filter.toLowerCase());

              const matchDate = dateFilter
                ? t.date &&
                  new Date(t.date).toISOString().slice(0, 10) === dateFilter
                : true;

              return matchStock && matchDate;
            })
            .map((t) => (
              <tr key={t._id || t.id}>
                <td>{t._id || t.id}</td>
                <td>{t.stock}</td>
                <td style={{ color: t.pnl >= 0 ? "green" : "red" }}>
                  {t.pnl}
                </td>
                <td>
                  <button
                    onClick={() => {
                      fetch(`http://localhost:5000/api/trades/${t._id}`, {
                        method: "DELETE",
                      }).then(() => fetchTrades());
                    }}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "5px"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* 📅 DAY-WISE PERFORMANCE */}
      <h2 style={{ marginTop: "30px" }}>📅 Day-wise Performance</h2>

      <table border="1" cellPadding="10" style={{ marginTop: "10px", width: "50%" }}>
        <thead>
          <tr>
            <th>Day</th>
            <th>Win %</th>
          </tr>
        </thead>

        <tbody>
          {dayStats.map((d, index) => (
            <tr key={index}>
              <td>{d.day}</td>
              <td style={{ color: d.percentage >= 50 ? "green" : "red" }}>
                {d.percentage.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;