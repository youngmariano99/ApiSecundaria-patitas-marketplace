import React, { useEffect, useState, useCallback } from 'react';
import { useDependencias } from '../../infrastructure/DependenciasContext';
import { CONFIGURACION_API } from '../../infrastructure/config/configuracionApi';
import type { Producto, ProductoRequest } from '../../domain/interfaces/Modelos';
import { ShieldAlert, Trash2, Edit, Plus, RefreshCw, X, ShoppingCart } from 'lucide-react';

export const MarketplaceCatalog: React.FC = () => {
  const { clienteApi, logger } = useDependencias();

  // Estados
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorUsuario, setErrorUsuario] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Estados para formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoriaId, setCategoriaId] = useState('ffffffff-1111-2222-3333-444444444444'); // Alimentos por defecto

  // ID del Vendedor Mock y Categorías
  const VENDEDOR_ID = '11111111-2222-3333-4444-555555555555';
  
  const CATEGORIAS = [
    { id: 'ffffffff-1111-2222-3333-444444444444', nombre: 'Alimentos' },
    { id: '11111111-2222-3333-4444-000000000000', nombre: 'Accesorios' },
  ];

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setErrorUsuario(null);
    try {
      logger.loguearInformacion('Cargando catálogo de productos');
      const datos = await clienteApi.realizarPeticion<Producto[]>(
        CONFIGURACION_API.ENDPOINTS.PRODUCTOS,
        {
          metodo: 'GET',
          requiereToken: false, // La API de Marketplace es pública
        }
      );
      setProductos(datos);
    } catch (error) {
      const mensaje = logger.loguearError(error, 'Error al cargar productos');
      setErrorUsuario(mensaje);
    } finally {
      setCargando(false);
    }
  }, [clienteApi, logger]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio(0);
    setStock(0);
    setCategoriaId('ffffffff-1111-2222-3333-444444444444');
    setEditandoId(null);
  };

  const abrirModalCrear = () => {
    limpiarFormulario();
    setMostrarModal(true);
  };

  const abrirModalEditar = (producto: Producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setStock(producto.stock);

    // Mapear categoría si coincide con el catálogo mock
    const encontrada = CATEGORIAS.find(c => c.nombre === producto.nombreCategoria);
    if (encontrada) {
      setCategoriaId(encontrada.id);
    }
    setMostrarModal(true);
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorUsuario(null);
    setMensajeExito(null);

    const payload: ProductoRequest = {
      vendedorId: VENDEDOR_ID,
      categoriaId,
      nombre,
      descripcion,
      precio,
      stock,
    };

    try {
      if (editandoId) {
        logger.loguearInformacion('Modificando producto', { editandoId, payload });
        await clienteApi.realizarPeticion<Producto>(
          `${CONFIGURACION_API.ENDPOINTS.PRODUCTOS}/${editandoId}`,
          {
            metodo: 'PUT',
            datos: payload,
            requiereToken: false,
          }
        );
        setMensajeExito(`¡Los datos de "${nombre}" fueron actualizados!`);
      } else {
        logger.loguearInformacion('Publicando nuevo producto', payload);
        await clienteApi.realizarPeticion<Producto>(
          CONFIGURACION_API.ENDPOINTS.PRODUCTOS,
          {
            metodo: 'POST',
            datos: payload,
            requiereToken: false,
          }
        );
        setMensajeExito(`¡Publicaste "${nombre}" con éxito en el Marketplace!`);
      }
      setMostrarModal(false);
      limpiarFormulario();
      cargarProductos();
    } catch (error) {
      const mensaje = logger.loguearError(error, 'Error al guardar producto');
      setErrorUsuario(mensaje);
    }
  };

  const eliminarProducto = async (id: string, nombreProducto: string) => {
    if (!window.confirm(`¿Estás seguro de que querés retirar "${nombreProducto}" de la venta?`)) {
      return;
    }

    setErrorUsuario(null);
    setMensajeExito(null);

    try {
      logger.loguearInformacion('Quitando producto (Soft Delete)', { id });
      await clienteApi.realizarPeticion<void>(
        `${CONFIGURACION_API.ENDPOINTS.PRODUCTOS}/${id}`,
        {
          metodo: 'DELETE',
          requiereToken: false,
        }
      );
      setMensajeExito(`Se retiró "${nombreProducto}" de la venta.`);
      cargarProductos();
    } catch (error) {
      const mensaje = logger.loguearError(error, 'Error al retirar producto');
      setErrorUsuario(mensaje);
    }
  };

  return (
    <div className="contenedor">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px' }}>Marketplace</h1>
        <button className="boton-principal" onClick={abrirModalCrear} style={{ width: 'auto', height: '48px', padding: '0 16px' }}>
          <Plus size={20} />
          <span>Vender</span>
        </button>
      </div>

      {errorUsuario && (
        <div className="alerta-mensaje error">
          <ShieldAlert />
          <span>{errorUsuario}</span>
        </div>
      )}

      {mensajeExito && (
        <div className="alerta-mensaje exito">
          <span>{mensajeExito}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          onClick={cargarProductos} 
          className="boton-secundario" 
          style={{ width: '44px', height: '44px', padding: 0 }}
          title="Recargar catálogo"
        >
          <RefreshCw size={18} className={cargando ? 'anim-spin' : ''} />
        </button>
      </div>

      {cargando && productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-texto-secundario)' }}>
          Cargando catálogo...
        </div>
      ) : productos.length === 0 ? (
        <div className="tarjeta" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-texto-secundario)' }}>
          <ShoppingCart size={40} style={{ margin: '0 auto 16px', color: 'var(--color-secundario)' }} />
          <p style={{ fontWeight: 600 }}>El catálogo está vacío.</p>
          <p style={{ fontSize: '15px', marginTop: '4px' }}>Sé el primero en publicar un producto haciendo clic en Vender.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {productos.map((producto) => (
            <div className="tarjeta" key={producto.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    color: 'var(--color-primario)',
                    backgroundColor: 'rgba(0,128,128,0.08)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontFamily: 'var(--fuente-titulos)'
                  }}>
                    {producto.nombreCategoria}
                  </span>
                  <h3 style={{ fontSize: '19px', marginTop: '6px' }}>{producto.nombre}</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => abrirModalEditar(producto)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-secundario)' }}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => eliminarProducto(producto.id, producto.nombre)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-alerta)' }}
                    title="Retirar de la venta"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '16px', color: 'var(--color-texto-secundario)' }}>
                {producto.descripcion}
              </p>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '12px',
                borderTop: '1px solid var(--color-borde)',
                paddingTop: '10px'
              }}>
                <div style={{ fontFamily: 'var(--fuente-datos)', fontSize: '20px', fontWeight: 700, color: 'var(--color-texto-principal)' }}>
                  ${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '14px', color: producto.stock > 0 ? 'var(--color-exito)' : 'var(--color-alerta)', fontWeight: 600 }}>
                  {producto.stock > 0 ? `Stock: ${producto.stock} u.` : 'Sin Stock'}
                </div>
              </div>
              
              {producto.nombreVendedor && (
                <p style={{ fontSize: '12px', color: 'var(--color-texto-secundario)', textAlign: 'right' }}>
                  Vendedor: {producto.nombreVendedor}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Publicación / Edición */}
      {mostrarModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1100, padding: '16px'
        }}>
          <div className="tarjeta" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>{editandoId ? 'Editar Publicación' : 'Publicar Producto'}</h2>
              <button onClick={() => setMostrarModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={guardarProducto}>
              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Nombre del Producto</label>
                <input type="text" className="campo-entrada" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej: Bolsa de Alimento 3kg" />
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Descripción</label>
                <textarea className="campo-texto" value={descripcion} onChange={e => setDescripcion(e.target.value)} required placeholder="Describe las características del producto..." />
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Categoría</label>
                <select className="campo-entrada" value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
                  {CATEGORIAS.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grupo-formulario">
                <label className="etiqueta-formulario">Precio ($)</label>
                <input type="number" step="0.01" className="campo-entrada" value={precio} onChange={e => setPrecio(parseFloat(e.target.value) || 0)} required min="0" />
              </div>

              <div className="grupo-formulario" style={{ marginBottom: '24px' }}>
                <label className="etiqueta-formulario">Stock Disponible</label>
                <input type="number" className="campo-entrada" value={stock} onChange={e => setStock(parseInt(e.target.value) || 0)} required min="0" />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="boton-secundario" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="boton-principal">
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
