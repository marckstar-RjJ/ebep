import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ModalRetro = ({ showRetroModal, closeRetroModal, ID_fecha_entregable, retroalimentacionId }) => {
  const [formData, setFormData] = useState({
    queSeHizo: "",
    queQuedaPendiente: "",
  });
  const [idRetro, setIdRetro] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Fetch de retroalimentación
  useEffect(() => {
    if (showRetroModal) {
      fetchRetroalimentacion(ID_fecha_entregable);
    }
  }, [ID_fecha_entregable, showRetroModal]);

  const fetchRetroalimentacion = async (ID_fecha_entregable) => {
    setIsLoading(true); // Inicia la carga
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/grupo-empresa/${ID_fecha_entregable}/getRetroalimentacion`
      );

      if (response.data.retroalimentaciones && response.data.retroalimentaciones.length > 0) {
        const retroalimentacion = response.data.retroalimentaciones[0];

        setFormData({
          queSeHizo: retroalimentacion.se_hizo || "",
          queQuedaPendiente: retroalimentacion.pendiente || "",
        });

        setIdRetro(retroalimentacion.ID_retroalimentacion);
      } else {
        console.log("No se encontraron retroalimentaciones");
      }
    } catch (error) {
      console.error("Error al obtener las retroalimentaciones:", error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { queSeHizo, queQuedaPendiente } = formData;
      const payload = {
        ID_retroalimentacion: idRetro,
        se_hizo: queSeHizo,
        pendiente: queQuedaPendiente,
      };

      const response = await axios.put(
        `http://localhost:8000/api/v1/grupo-empresa/UpdateRetroalimentacion`,
        payload
      );

      if (response.data) {
        alert("Información actualizada exitosamente");
        resetForm();
        closeRetroModal();
        location.reload();
      } else {
        alert("Error al actualizar la información");
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      alert("Ocurrió un error al actualizar la información");
    }
  };

  const handleCancel = () => {
    closeRetroModal();
  };

  const resetForm = () => {
    setFormData({
      queSeHizo: "",
      queQuedaPendiente: "",
    });
  };

  if (!showRetroModal) return null;

  return ReactDOM.createPortal(
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="px-8 py-6 bg-white rounded-lg shadow-md w-[90%] max-w-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-center text-primary-800">
          Feedback Retrospectivo
        </h2>

        {isLoading ? (
          // Indicador de carga
          <div className="flex items-center justify-center h-32">
            <div className="w-10 h-10 border-4 rounded-full border-primary-500 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          // Formulario con los datos cargados
          <>
            <div className="mb-4">
              <label
                htmlFor="queSeHizo"
                className="block mb-2 text-lg font-medium text-gray-700"
              >
                ¿Qué se hizo?
              </label>
              <textarea
                id="queSeHizo"
                value={formData.queSeHizo}
                onChange={handleInputChange}
                className="w-full h-24 p-3 border rounded-md resize-none border-neutral-400 focus:outline-primary-500"
                placeholder="Describe lo que se logró..."
                maxLength={240}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="queQuedaPendiente"
                className="block mb-2 text-lg font-medium text-gray-700"
              >
                ¿Qué queda pendiente?
              </label>
              <textarea
                id="queQuedaPendiente"
                value={formData.queQuedaPendiente}
                onChange={handleInputChange}
                className="w-full h-24 p-3 border rounded-md resize-none border-neutral-400 focus:outline-primary-500"
                placeholder="Describe lo que falta por hacer..."
                maxLength={240}
                required
              ></textarea>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 border rounded-md border-neutral-400 bg-neutral-100 hover:bg-neutral-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md bg-primary-500 hover:bg-primary-600"
              >
                Guardar
              </button>
            </div>
          </>
        )}
      </form>
    </section>,
    document.getElementById("modal-root")
  );
};

export default ModalRetro;
