// SELECTORES: capturan elementos del HTML
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const buscadorInput = document.querySelector("#buscador");
const cubos = document.querySelectorAll("#lista-cursos .card");

// Recuperar carrito guardado en localStorage (si no existe, usar arreglo vacío)
let articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Cargar eventos al iniciar
cargarEventosListeners();
// Mostrar carrito guardado al cargar la página
carritoHTML();

function cargarEventosListeners() {
  // Cuando se hace click en "Agregar al carrito"
  if (listaCursos) listaCursos.addEventListener("click", agregarCurso);

  // Cuando se hace click en "Borrar" dentro del carrito
  if (carrito) carrito.addEventListener("click", eliminarCurso);

  // Botón para vaciar todo el carrito
  if (vaciarCarrito) {
    vaciarCarrito.addEventListener("click", () => {
      articulosCarrito = [];           // Vacía el arreglo
      guardarCarrito();                // Guarda el carrito vacío
      carritoHTML();                   // Actualiza el HTML
      mostrarMensaje("Se vació el carrito"); // Notificación visual
    });
  }

  // Buscador para filtrar productos por nombre
  if (buscadorInput) {
      buscadorInput.addEventListener("input", function() {
          const texto = this.value.toLowerCase();  // Convertir texto a minúsculas
          cubos.forEach(cubo => {
              const nombre = cubo.querySelector("h4").textContent.toLowerCase();
              // Mostrar u ocultar tarjeta según coincida el texto
              cubo.style.display = nombre.includes(texto) ? "block" : "none";
          });
      });
  }

  // Abrir/cerrar el carrito desde el ícono
  const btnCarrito = document.querySelector("#img-carrito");
  if (btnCarrito && carrito) {
      btnCarrito.addEventListener("click", () => {
          carrito.classList.toggle("mostrar"); // Alternar clase para mostrar/ocultar
      });
  }
}

// AGREGAR CURSO AL CARRITO
function agregarCurso(e) {
  e.preventDefault(); // Evita que el enlace recargue la página
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.closest(".card"); // Obtener tarjeta completa
    leerDatosCurso(cursoSeleccionado); // Extraer y procesar la información
  }
}

// LEER DATOS DEL CURSO SELECCIONADO
function leerDatosCurso(cursoSeleccionado) {
  const infoCurso = {
    imagen: cursoSeleccionado.querySelector("img").src,             // Imagen del curso
    titulo: cursoSeleccionado.querySelector("h4").textContent,      // Nombre
    precio: cursoSeleccionado.querySelector(".precio span").textContent, // Precio final
    id: cursoSeleccionado.querySelector("a").getAttribute("data-id"), // ID único
    cantidad: 1,                                                     // Empieza en 1 unidad
  };

  // Buscar si el producto ya existe en el carrito
  const index = articulosCarrito.findIndex(curso => curso.id === infoCurso.id);
  if (index !== -1) {
    // Si ya existe, aumentar cantidad
    articulosCarrito[index].cantidad++;
    mostrarMensaje(`Se agregó otra unidad de "${infoCurso.titulo}"`);
  } else {
    // Si es nuevo, agregarlo al arreglo
    articulosCarrito.push(infoCurso);
    mostrarMensaje(`Se agregó "${infoCurso.titulo}" al carrito`);
  }

  guardarCarrito(); // Guardar cambios en localStorage
  carritoHTML();    // Actualizar carrito en pantalla
}

// ELIMINAR CURSO DEL CARRITO
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id"); // Obtener ID del curso
    // Crear un nuevo arreglo sin el curso eliminado
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
    guardarCarrito(); // Guardar cambios
    carritoHTML();    // Actualizar HTML
    mostrarMensaje("Se eliminó un curso del carrito");
  }
}

// GUARDAR CARRITO EN LOCALSTORAGE
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// MOSTRAR CARRITO EN HTML
function carritoHTML() {
  limpiarHTML(); // Evitar duplicados
  articulosCarrito.forEach(curso => {
    const { imagen, titulo, precio, cantidad, id } = curso;

    const row = document.createElement("tr"); // Crear fila de tabla
    row.innerHTML = `
      <td><img src="${imagen}" width="100"></td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td><a href="#" class="borrar-curso" data-id="${id}">Borrar</a></td>
    `;
    contenedorCarrito.appendChild(row); // Agregar fila al carrito
  });
}

// LIMPIAR TABLA DEL CARRITO
function limpiarHTML() {
  if (contenedorCarrito) contenedorCarrito.innerHTML = "";
}

// MENSAJE FLOTANTE EN ESQUINA
function mostrarMensaje(mensaje) {
  let contMensaje = document.querySelector("#mensaje-carrito");

  // Si no existe el contenedor, crearlo
  if (!contMensaje) {
    contMensaje = document.createElement("div");
    contMensaje.id = "mensaje-carrito";
    contMensaje.className = "mensaje-carrito";
    document.body.appendChild(contMensaje);
  }

  contMensaje.textContent = mensaje;       // Texto del mensaje
  contMensaje.classList.add("mostrar");    // Mostrar animación

  // Ocultar luego de 2 segundos
  setTimeout(() => {
    contMensaje.classList.remove("mostrar");
  }, 2000);
}
