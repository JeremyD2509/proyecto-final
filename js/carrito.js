// SELECTORES
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const buscadorInput = document.querySelector("#buscador");
const cubos = document.querySelectorAll("#lista-cursos .card");

let articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

cargarEventosListeners();
carritoHTML(); // mostrar carrito al cargar la página

function cargarEventosListeners() {
  if (listaCursos) listaCursos.addEventListener("click", agregarCurso);
  if (carrito) carrito.addEventListener("click", eliminarCurso);
  if (vaciarCarrito) {
    vaciarCarrito.addEventListener("click", () => {
      articulosCarrito = [];
      guardarCarrito();
      carritoHTML();
      mostrarMensaje("Se vació el carrito");
    });
  }

  if (buscadorInput) {
      buscadorInput.addEventListener("input", function() {
          const texto = this.value.toLowerCase();
          cubos.forEach(cubo => {
              const nombre = cubo.querySelector("h4").textContent.toLowerCase();
              cubo.style.display = nombre.includes(texto) ? "block" : "none";
          });
      });
  }

  const btnCarrito = document.querySelector("#img-carrito");
  if (btnCarrito && carrito) {
      btnCarrito.addEventListener("click", () => {
          carrito.classList.toggle("mostrar");
      });
  }
}

// AGREGAR CURSO
function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.closest(".card");
    leerDatosCurso(cursoSeleccionado);
  }
}

// LEER DATOS DEL CURSO
function leerDatosCurso(cursoSeleccionado) {
  const infoCurso = {
    imagen: cursoSeleccionado.querySelector("img").src,
    titulo: cursoSeleccionado.querySelector("h4").textContent,
    precio: cursoSeleccionado.querySelector(".precio span").textContent,
    id: cursoSeleccionado.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  const index = articulosCarrito.findIndex(curso => curso.id === infoCurso.id);
  if (index !== -1) {
    articulosCarrito[index].cantidad++;
    mostrarMensaje(`Se agregó otra unidad de "${infoCurso.titulo}"`);
  } else {
    articulosCarrito.push(infoCurso);
    mostrarMensaje(`Se agregó "${infoCurso.titulo}" al carrito`);
  }

  guardarCarrito();
  carritoHTML();
}

// ELIMINAR CURSO
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
    guardarCarrito();
    carritoHTML();
    mostrarMensaje("Se eliminó un curso del carrito");
  }
}

// GUARDAR EN LOCALSTORAGE
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// MOSTRAR CARRITO EN HTML
function carritoHTML() {
  limpiarHTML();
  articulosCarrito.forEach(curso => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${imagen}" width="100"></td>
      <td>${titulo}</td>
      <td>${precio}</td>
      <td>${cantidad}</td>
      <td><a href="#" class="borrar-curso" data-id="${id}">Borrar</a></td>
    `;
    contenedorCarrito.appendChild(row);
  });
}

// LIMPIAR CARRITO EN HTML
function limpiarHTML() {
  if (contenedorCarrito) contenedorCarrito.innerHTML = "";
}

// MOSTRAR MENSAJE FLOTANTE
function mostrarMensaje(mensaje) {
  let contMensaje = document.querySelector("#mensaje-carrito");
  if (!contMensaje) {
    contMensaje = document.createElement("div");
    contMensaje.id = "mensaje-carrito";
    contMensaje.className = "mensaje-carrito";
    document.body.appendChild(contMensaje);
  }
  contMensaje.textContent = mensaje;
  contMensaje.classList.add("mostrar");

  setTimeout(() => {
    contMensaje.classList.remove("mostrar");
  }, 2000);
}
