import { useEffect, useState } from "react";
import "./App.css";

type Item = {
  id: number;
  name: string;
  count: number;
  min: number;
};

type Location = {
  id: number;
  name: string;
  items: Item[];
};

type Area = {
  id: number;
  name: string;
  emoji: string;
  locations: Location[];
};

const initialAreas: Area[] = [
  {
    id: 1,
    name: "SH1–3",
    emoji: "🏟️",
    locations: [
      {
        id: 1,
        name: "Geräteraum",
        items: [
          { id: 1, name: "Badmintonbälle", count: 12, min: 10 },
          { id: 2, name: "Springseile", count: 8, min: 5 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "SSp",
    emoji: "🏀",
    locations: [
      {
        id: 1,
        name: "Ballwagen",
        items: [
          { id: 3, name: "Fußbälle", count: 10, min: 6 },
          { id: 4, name: "Basketbälle", count: 7, min: 5 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "SR",
    emoji: "🏃",
    locations: [
      {
        id: 1,
        name: "Lager",
        items: [
          { id: 5, name: "Hürden", count: 9, min: 6 },
          { id: 6, name: "Stoppuhren", count: 5, min: 3 },
        ],
      },
    ],
  },
];

function App() {
  const [areas, setAreas] = useState<Area[]>(() => {
    const saved = localStorage.getItem("turnhallen");
    return saved ? JSON.parse(saved) : initialAreas;
  });

  const [areaId, setAreaId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [min, setMin] = useState("");

  useEffect(() => {
    localStorage.setItem("turnhallen", JSON.stringify(areas));
  }, [areas]);

  const area = areas.find((a) => a.id === areaId);
  const location = area?.locations.find((l) => l.id === locationId);

  const addItem = () => {
    if (!areaId || !locationId || !name) return;

    const newItem: Item = {
      id: Date.now(),
      name,
      count: Number(count) || 0,
      min: Number(min) || 0,
    };

    setAreas((prev) =>
      prev.map((a) =>
        a.id !== areaId
          ? a
          : {
              ...a,
              locations: a.locations.map((l) =>
                l.id !== locationId
                  ? l
                  : { ...l, items: [...l.items, newItem] }
              ),
            }
      )
    );

    setName("");
    setCount("");
    setMin("");
  };

  const updateCount = (itemId: number, delta: number) => {
    if (!areaId || !locationId) return;

    setAreas((prev) =>
      prev.map((a) =>
        a.id !== areaId
          ? a
          : {
              ...a,
              locations: a.locations.map((l) =>
                l.id !== locationId
                  ? l
                  : {
                      ...l,
                      items: l.items.map((i) =>
                        i.id === itemId
                          ? { ...i, count: Math.max(0, i.count + delta) }
                          : i
                      ),
                    }
              ),
            }
      )
    );
  };

  return (
    <div className="app">
      <h1>🏋️ Turnhallen App</h1>

      {!area && (
        <div>
          {areas.map((a) => (
            <button key={a.id} onClick={() => setAreaId(a.id)}>
              {a.emoji} {a.name}
            </button>
          ))}
        </div>
      )}

      {area && !location && (
        <div>
          <button onClick={() => setAreaId(null)}>← zurück</button>

          <h2>{area.name}</h2>

          {area.locations.map((l) => (
            <button key={l.id} onClick={() => setLocationId(l.id)}>
              📦 {l.name}
            </button>
          ))}
        </div>
      )}

      {area && location && (
        <div>
          <button onClick={() => setLocationId(null)}>← zurück</button>

          <h2>{location.name}</h2>

          <div className="list">
            {location.items.map((item) => (
              <div key={item.id} className="card">
                <div>
                  <strong>{item.name}</strong>
                  <div>
                    {item.count < item.min ? "⚠️ niedrig" : "✅ ok"}
                  </div>
                </div>

                <div className="counter">
                  <button onClick={() => updateCount(item.id, -1)}>
                    -
                  </button>
                  <span>{item.count}</span>
                  <button onClick={() => updateCount(item.id, +1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="form">
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Anzahl"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
            <input
              placeholder="Min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />
            <button onClick={addItem}>Hinzufügen</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;