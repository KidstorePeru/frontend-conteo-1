import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://backend-conteo-production.up.railway.app/";

export default function CuentasPanel() {
  const [cuentas, setCuentas] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPavos, setNuevoPavos] = useState(0);

  useEffect(() => {
    fetchCuentas();
    const interval = setInterval(fetchCuentas, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchCuentas = async () => {
    try {
      const res = await axios.get(API);
      setCuentas(res.data);
    } catch (err) {
      console.error("Error al cargar cuentas:", err);
    }
  };

  const modificarCampo = async (id, campo, valor) => {
    const cuenta = cuentas.find((c) => c.id === id);
    if (!cuenta) return;
    const actualizada = { ...cuenta, [campo]: valor };
    await axios.put(`${API}/${id}`, actualizada);
    fetchCuentas();
  };

  const agregarCuenta = async () => {
    if (!nuevoNombre) return alert("Ingresa un nombre válido.");
    await axios.post(API, {
      nombre: nuevoNombre,
      pavos: nuevoPavos,
    });
    setNuevoNombre("");
    setNuevoPavos(0);
    fetchCuentas();
  };

  const eliminarCuenta = async (id) => {
    if (!confirm("¿Eliminar esta cuenta?")) return;
    await axios.delete(`${API}/${id}`);
    fetchCuentas();
  };

  const getTiempoRestante = (timestamp) => {
    const ahora = Date.now() / 1000;
    const objetivo = timestamp + 86400;
    const restante = objetivo - ahora;
    if (restante <= 0) return "✅ ¡Disponible!";
    const horas = Math.floor(restante / 3600);
    const minutos = Math.floor((restante % 3600) / 60);
    const segundos = Math.floor(restante % 60);
    return `⏳ ${horas}h ${minutos}m ${segundos}s`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <h1 className="text-3xl font-extrabold text-center text-cyan-400 mb-6">
        🎮 PANEL DE CUENTAS FORTNITE
      </h1>

      {/* Formulario nueva cuenta */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 max-w-3xl mx-auto bg-zinc-800 p-4 rounded">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          className="p-2 rounded text-black flex-1"
        />
        <input
          type="number"
          placeholder="Pavos"
          value={nuevoPavos}
          onChange={(e) => setNuevoPavos(Number(e.target.value))}
          className="p-2 rounded text-black w-32"
        />
        <button
          onClick={agregarCuenta}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Agregar
        </button>
      </div>

      {/* Tabla de cuentas */}
      <div className="overflow-x-auto max-w-5xl mx-auto">
        <table className="w-full border-collapse">
          <thead className="bg-zinc-900 text-cyan-300 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Pavos</th>
              <th className="p-3">Regalos disponibles</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((cuenta) => (
              <tr
                key={cuenta.id}
                className="border-b border-zinc-700 hover:bg-zinc-800"
              >
                <td className="p-3">
                  <input
                    className="text-black px-2 py-1 rounded w-full"
                    value={cuenta.nombre}
                    onChange={(e) =>
                      modificarCampo(cuenta.id, "nombre", e.target.value)
                    }
                  />
                </td>

                <td className="p-3">
                  <input
                    type="number"
                    value={cuenta.pavos}
                    onChange={(e) =>
                      modificarCampo(cuenta.id, "pavos", Number(e.target.value))
                    }
                    className="w-24 text-black rounded px-2 py-1"
                  />
                </td>

                <td className="p-3 font-semibold text-yellow-400">
                  {cuenta.regalos_disponibles}/5
                  <button
                    className="ml-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                    onClick={() =>
                      modificarCampo(
                        cuenta.id,
                        "regalos_disponibles",
                        Math.max(0, cuenta.regalos_disponibles - 1)
                      )
                    }
                  >
                    -
                  </button>
                  <button
                    className="ml-1 bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                    onClick={() =>
                      modificarCampo(
                        cuenta.id,
                        "regalos_disponibles",
                        Math.min(5, cuenta.regalos_disponibles + 1)
                      )
                    }
                  >
                    +
                  </button>
                  {cuenta.regalos_disponibles < 5 && (
                    <div className="text-sm text-gray-300 mt-1">
                      {getTiempoRestante(cuenta.ultimo_regalo)}
                    </div>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      modificarCampo(cuenta.id, "regalos_disponibles", 5)
                    }
                    className="bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded mr-2"
                  >
                    🔁 Reiniciar
                  </button>
                  <button
                    onClick={() => eliminarCuenta(cuenta.id)}
                    className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
