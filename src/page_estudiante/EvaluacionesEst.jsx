import { useState, useEffect } from "react";
import axios from "axios";
import ModalRespAutoEvaluacion from "./ModalRespAutoEvaluacion";
import ModalRespPares from "./ModalRespPares";
import ModalRespCruzada from "./ModalRespCruzada";

const EvaluacionesEst = () => {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const userID = userData ? userData.ID_usuario : null;

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga global
  const [botonesCargando, setBotonesCargando] = useState({}); // Estado de carga por botón
  const [showModalAuto, setShowModalAuto] = useState(false);
  const [showModalPares, setShowModalPares] = useState(false);
  const [showModalCruzada, setShowModalCruzada] = useState(false);

  const [nombreEvaluacion, setNombreEvaluacion] = useState("");
  const [descripcionEvaluacion, setDescripcionEvaluacion] = useState("");
  const [notaEvaluacion, setNotaEvaluacion] = useState("");
  const [botonesBloqueados, setBotonesBloqueados] = useState({});

  const openModalAuto = (evaluacion) => {
    setNombreEvaluacion(evaluacion.nombre_entregable);
    setDescripcionEvaluacion(
      evaluacion.rubrica?.[0]?.desc_rubrica || "Sin descripción",
    );
    setNotaEvaluacion(evaluacion.nota_entregable);
    setShowModalAuto(true);
  };

  const openModalPares = (evaluacion) => {
    setNombreEvaluacion(evaluacion.nombre_entregable);
    setDescripcionEvaluacion(
      evaluacion.rubrica?.[0]?.desc_rubrica || "Sin descripción",
    );
    setNotaEvaluacion(evaluacion.nota_entregable);
    setShowModalPares(true);
  };

  const openModalCruzada = (evaluacion) => {
    setNombreEvaluacion(evaluacion.nombre_entregable);
    setDescripcionEvaluacion(
      evaluacion.rubrica?.[0]?.desc_rubrica || "Sin descripción",
    );
    setNotaEvaluacion(evaluacion.nota_entregable);
    setShowModalCruzada(true);
  };

  const closeModalAuto = () => setShowModalAuto(false);
  const closeModalPares = () => setShowModalPares(false);
  const closeModalCruzada = () => setShowModalCruzada(false);

  useEffect(() => {
    fetchEvaluaciones();
  }, []);

  useEffect(() => {
    if (evaluaciones.length > 0) {
      evaluaciones.forEach((evaluacion) => {
        fetchControl(evaluacion.nombre_entregable);
      });
    }
  }, [evaluaciones]);

  const fetchEvaluaciones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/docente/evaluaciones",
      );

      const ordenado = [
        "Auto Evaluacion",
        "Evaluacion Pares",
        "Evaluacion Cruzada",
      ];
      const evaluacionesOrdenadas = response.data.sort(
        (a, b) =>
          ordenado.indexOf(a.nombre_entregable) -
          ordenado.indexOf(b.nombre_entregable),
      );

      setEvaluaciones(evaluacionesOrdenadas);
    } catch (error) {
      console.error("Error al obtener las evaluaciones:", error);
    } finally {
      setLoading(false); // Desactiva el estado de loading al finalizar
    }
  };

  const fetchControl = async (nombreEntregable) => {
    const payload = {
      nombre_entregable: nombreEntregable,
      ID_usuario: userID,
    };
    try {
      setBotonesCargando((prevState) => ({
        ...prevState,
        [nombreEntregable]: true, // Activa la carga para este botón
      }));

      const response = await axios.post(
        "http://localhost:8000/api/v1/autoEvaluacion/controlAutoEvaluacion",
        payload,
      );

      setBotonesBloqueados((prevState) => ({
        ...prevState,
        [nombreEntregable]: response.data.success,
      }));
    } catch (error) {
      console.error("Error al verificar el control de evaluación:", error);
    } finally {
      setBotonesCargando((prevState) => ({
        ...prevState,
        [nombreEntregable]: false, // Desactiva la carga para este botón
      }));
    }
  };

  return (
    <section className="w-full px-10 py-6 mx-auto xl:max-w-7xl">
      <ModalRespAutoEvaluacion
        showModal={showModalAuto}
        closeModal={closeModalAuto}
        nombreEvaluacion={nombreEvaluacion}
        descripcionEvaluacion={descripcionEvaluacion}
        notaEvaluacion={notaEvaluacion}
      />
      <ModalRespPares
        showModal={showModalPares}
        closeModal={closeModalPares}
        nombreEvaluacion={nombreEvaluacion}
        descripcionEvaluacion={descripcionEvaluacion}
        notaEvaluacion={notaEvaluacion}
      />
      <ModalRespCruzada
        showModal={showModalCruzada}
        closeModal={closeModalCruzada}
        nombreEvaluacion={nombreEvaluacion}
        descripcionEvaluacion={descripcionEvaluacion}
        notaEvaluacion={notaEvaluacion}
      />

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-gray-500">
            Cargando evaluaciones, por favor espera...
          </p>
        </div>
      ) : evaluaciones.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No tienes evaluaciones disponibles.</p>
        </div>
      ) : (
        evaluaciones.map((evaluacion, index) => (
          <div key={evaluacion.ID_entregable}>
            <h2 className="mb-8 text-2xl font-semibold text-primary-800">
              {index === 0
                ? "Autoevaluación individual"
                : index === 1
                  ? "Autoevaluación a pares"
                  : "Autoevaluación cruzada"}
            </h2>

            <article className="my-5 border rounded-md border-neutral-400">
              <header className="flex items-center p-3 border-b border-neutral-400">
                <div className="flex items-center gap-3">
                  <i className="flex items-center justify-center text-lg text-white rounded-full fa-solid fa-pencil size-9 bg-primary-500"></i>
                  <span className="text-lg font-semibold text-primary-500">
                    {evaluacion.nombre_entregable}
                  </span>
                </div>
              </header>
              <p className="p-3 text-pretty">
                Descripción:{" "}
                {evaluacion.rubrica?.[0]?.desc_rubrica || "Sin rúbrica"}
              </p>

              <footer className="flex items-center justify-between px-3 py-2 border-t border-neutral-400">
                <button
                  className={`rounded-md px-4 py-2 text-white transition-colors ${
                    botonesCargando[evaluacion.nombre_entregable]
                      ? "cursor-wait bg-gray-400"
                      : botonesBloqueados[evaluacion.nombre_entregable]
                        ? "cursor-not-allowed bg-gray-400"
                        : evaluacion.nombre_entregable === "Auto Evaluacion"
                          ? "bg-blue-500 hover:bg-blue-400"
                          : evaluacion.nombre_entregable === "Evaluacion Pares"
                            ? "bg-green-500 hover:bg-green-400"
                            : "bg-red-500 hover:bg-red-400"
                  }`}
                  onClick={() =>
                    evaluacion.nombre_entregable === "Auto Evaluacion"
                      ? openModalAuto(evaluacion)
                      : evaluacion.nombre_entregable === "Evaluacion Pares"
                        ? openModalPares(evaluacion)
                        : openModalCruzada(evaluacion)
                  }
                  disabled={
                    botonesBloqueados[evaluacion.nombre_entregable] ||
                    botonesCargando[evaluacion.nombre_entregable]
                  }
                >
                  {botonesCargando[evaluacion.nombre_entregable] ? (
                    <>
                      <span className="mr-2 spinner-border spinner-border-sm"></span>
                      Cargando...
                    </>
                  ) : botonesBloqueados[evaluacion.nombre_entregable] ? (
                    "Calificado"
                  ) : (
                    `Responder ${evaluacion.nombre_entregable}`
                  )}
                </button>
                <span className="text-lg font-semibold text-neutral-600">
                  Puntos: {evaluacion.nota_entregable}
                </span>
              </footer>
            </article>
          </div>
        ))
      )}
    </section>
  );
};

export default EvaluacionesEst;
