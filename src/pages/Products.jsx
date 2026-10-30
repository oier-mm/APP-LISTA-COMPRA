import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { toggleProduct, deleteProduct } from "../services/productService";
import Navbar from "../components/Navbar";

import "../styles/products.css";

export default function Products() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Estados para el modal de confirmación de borrado moderno
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const idLista = localStorage.getItem("listaActual");

  useEffect(() => {
    if (!idLista) {
      navigate("/listas");
      return;
    }

    const q = query(
      collection(db, "productos"),
      where("idLista", "==", idLista)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [idLista, navigate]);

  const handleToggle = async (id, estadoActual) => {
    try {
      await toggleProduct(id, !estadoActual);
    } catch (err) {
      console.error("Error al actualizar producto:", err);
    }
  };

  const handleOpenDeleteModal = (prod, e) => {
    e.stopPropagation();
    setProductToDelete(prod);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    } finally {
      setDeleting(false);
    }
  };

  const totalProds = productos.length;
  const cogidosProds = productos.filter((p) => p.cogido).length;
  const porcentaje = totalProds > 0 ? Math.round((cogidosProds / totalProds) * 100) : 0;

  const pendientes = productos.filter((p) => !p.cogido);
  const cogidos = productos.filter((p) => p.cogido);

  const renderProductCard = (prod, isCogido) => (
    <div
      key={prod.id}
      className={isCogido ? "product-card-green-v2" : "product-card-red-v2"}
    >
      <div className="product-row-content">
        <span className="product-card-icon">🛒</span>
        
        <div className="product-text-info">
          {/* TÍTULO PRINCIPAL: Muestra el tipo directamente arriba */}
          <h2 className="product-title-v2">
            {prod.tipo || prod.nombre}
          </h2>
          
          {/* PASTILLA BLANCA INDEPENDIENTE: Solo cantidad */}
          <div className="product-details-row">
            <span className="product-badge-cantidad">Cantidad: {prod.cantidad || 1}</span>
          </div>

          {prod.descripcion && (
            <div className="product-desc-v2">
              💬 {prod.descripcion}
            </div>
          )}

          {prod.imagenUrl && (
            <button
              type="button"
              className="view-image-btn-v2"
              onClick={() => setSelectedImage(prod.imagenUrl)}
            >
              📷 Ver foto adjunta
            </button>
          )}
        </div>

        <div className="product-right-controls">
          <button
            type="button"
            className="delete-product-x-v2"
            onClick={(e) => handleOpenDeleteModal(prod, e)}
          >
            ✕
          </button>

          {/* Contenedor vertical para el switch */}
          <div className="toggle-vertical-wrapper">
            <label className="switch">
              <input
                type="checkbox"
                checked={!!prod.cogido}
                onChange={() => handleToggle(prod.id, prod.cogido)}
              />
              <span className={`slider round ${prod.cogido ? "checked-green" : ""}`}></span>
            </label>
            <span className="toggle-label-text">
              {prod.cogido ? "¡Cogido!" : "Pendiente"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Productos</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate("/perfil")}
            >
              👤
            </button>
          </div>
        </div>

        <div className="scrollable-products-area">

          {/* Tarjeta de progreso superior */}
          <div className="card progress-card" style={{ marginBottom: "16px" }}>
            <div className="progress-card-header">
              <span className="progress-title">🛒 Productos cogidos</span>
              <span className="progress-count">
                <strong>{cogidosProds}</strong> de <strong>{totalProds}</strong> ({porcentaje}%)
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: porcentaje + "%" }}
              />
            </div>
          </div>

          {/* Botón nuevo producto */}
          <button
            type="button"
            className="primary-button"
            style={{ marginBottom: "16px", textTransform: "uppercase" }}
            onClick={() => navigate("/nuevo-producto")}
          >
            AÑADIR PRODUCTO
          </button>

          {/* Listado de productos */}
          {loading ? (
            <p style={{ textAlign: "center", color: "#666" }}>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No hay productos en esta lista. ¡Añade alguno!
            </p>
          ) : (
            <div className="products-list-container">
              {pendientes.map((prod) => renderProductCard(prod, false))}

              {cogidos.length > 0 && (
                <div className="products-divider-row">
                  <span className="products-divider-line"></span>
                  <span className="products-divider-text">COGIDOS</span>
                  <span className="products-divider-line"></span>
                </div>
              )}

              {cogidos.map((prod) => renderProductCard(prod, true))}
            </div>
          )}

        </div>

        <Navbar />

        {/* MODAL DE CONFIRMACIÓN DE BORRADO MODERNIZADO */}
        {productToDelete && (
          <div className="modal-overlay" onClick={() => setProductToDelete(null)}>
            <div className="modal-container leave-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-leave-title">Eliminar producto</h2>
              <p className="modal-leave-text">
                ¿Seguro que quieres eliminar <strong>"{productToDelete.tipo || productToDelete.nombre}"</strong>?
              </p>

              <div className="modal-leave-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setProductToDelete(null)}
                  disabled={deleting}
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  className="primary-button leave-confirm-btn"
                  style={{ backgroundColor: "#e53e3e !important" }}
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "BORRANDO..." : "ELIMINAR"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Imagen */}
        {selectedImage && (
          <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
            <div className="modal-container image-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Imagen adjunta</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body" style={{ textAlign: "center" }}>
                <img
                  src={selectedImage}
                  alt="Imagen del producto"
                  style={{ maxWidth: "100%", borderRadius: "12px", maxHeight: "60vh", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}