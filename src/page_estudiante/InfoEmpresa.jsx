import { useEffect, useState } from "react";
import axios from "axios";
import InfoUsuario from "../components/InfoUsuario";
import PlaceholderIMG from "../assets/img/no-image.jpg";
import "../components/background.css";

const InfoEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [cantEstudiantes, setCantEstudiantes] = useState(null);
  const base_api_url = "http://localhost:8000/api/v1";

  useEffect(() => {
    axios
      .get(`${base_api_url}/estudiante/info`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        // Asigna los valores correspondientes a cada estado
        setEmpresa(response.data.empresa);
        setCantEstudiantes(response.data.cantidad_estudiantes);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la empresa:", error);
      });
  }, []);

  if (!empresa) {
    return <p>Cargando datos de la empresa...</p>;
  }

  return (
    <section className="w-full pt-8 bg-white">
      <div className="mx-auto w-fit">
        <article className="px-6 py-5 mx-auto text-white rounded-md bg-primary-600">
          <h1 className="flex justify-center mb-4 text-xl font-semibold">
            Información de grupo-empresa
          </h1>
          <section className="flex gap-10">
            <div className="space-y-2 min-w-96 max-w-fit">
              <InfoUsuario
                icono={<i className="fa-solid fa-building"></i>}
                titulo={"Grupo-empresa: "}
                info={empresa.nombre_empresa}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-user"></i>}
                titulo={"Representante legal: "}
                info={empresa.nombre_representante}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-envelope"></i>}
                titulo={"Correo electrónico: "}
                info={empresa.correo_empresa}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-building"></i>}
                titulo={"Teléfono: "}
                info={empresa.telf_representante}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-users"></i>}
                titulo={"Cantidad de miembros: "}
                info={cantEstudiantes}
              />

              <InfoUsuario
                icono={<i className="fa-solid fa-building"></i>}
                titulo={"Código: "}
                info={empresa.codigo}
              />
            </div>

            <div className="relative flex items-center justify-center overflow-hidden rounded-3xl">
              <img
                src={PlaceholderIMG}
                className="absolute object-cover size-40 rounded-3xl"
              />
              <img
                src={empresa.logo_empresa}
                className="relative object-cover size-40 rounded-3xl"
                loading="lazy"
              />
            </div>
          </section>
        </article>
      </div>
    </section>
  );
};

export default InfoEmpresa;
