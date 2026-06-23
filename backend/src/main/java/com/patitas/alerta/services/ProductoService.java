package com.patitas.alerta.services;

import com.patitas.alerta.dtos.ProductoRequestDTO;
import com.patitas.alerta.dtos.ProductoResponseDTO;
import com.patitas.alerta.entities.Categoria;
import com.patitas.alerta.entities.ProductoMarketplace;
import com.patitas.alerta.entities.Usuario;
import com.patitas.alerta.repositories.CategoriaRepository;
import com.patitas.alerta.repositories.ProductoMarketplaceRepository;
import com.patitas.alerta.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoMarketplaceRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<ProductoResponseDTO> obtenerTodos() {
        return productoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductoResponseDTO obtenerPorId(UUID id) {
        ProductoMarketplace producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return mapToDTO(producto);
    }

    @Transactional
    public ProductoResponseDTO crearProducto(ProductoRequestDTO dto) {
        Usuario vendedor = usuarioRepository.findById(dto.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        ProductoMarketplace producto = new ProductoMarketplace();
        producto.setVendedor(vendedor);
        producto.setCategoria(categoria);
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());

        producto = productoRepository.save(producto);
        return mapToDTO(producto);
    }

    @Transactional
    public ProductoResponseDTO actualizarProducto(UUID id, ProductoRequestDTO dto) {
        ProductoMarketplace producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Usuario vendedor = usuarioRepository.findById(dto.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        producto.setVendedor(vendedor);
        producto.setCategoria(categoria);
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());

        producto = productoRepository.save(producto);
        return mapToDTO(producto);
    }

    @Transactional
    public void eliminarProducto(UUID id) {
        ProductoMarketplace producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        productoRepository.delete(producto);
    }

    private ProductoResponseDTO mapToDTO(ProductoMarketplace producto) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(producto.getId());
        dto.setNombreVendedor(producto.getVendedor().getNombreCompleto());
        dto.setNombreCategoria(producto.getCategoria().getNombre());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        return dto;
    }
}
