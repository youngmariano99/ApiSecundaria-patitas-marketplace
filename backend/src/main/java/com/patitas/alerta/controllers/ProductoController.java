package com.patitas.alerta.controllers;

import com.patitas.alerta.dtos.ProductoRequestDTO;
import com.patitas.alerta.dtos.ProductoResponseDTO;
import com.patitas.alerta.services.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/productos")
@Tag(name = "API Secundaria - Marketplace", description = "Operaciones CRUD para productos. Es completamente PÚBLICA.")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    @Operation(summary = "Listar Productos", description = "Retorna todo el catálogo de productos a la venta.")
    public ResponseEntity<List<ProductoResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(productoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ver detalle de Producto", description = "Busca un producto por su UUID.")
    public ResponseEntity<ProductoResponseDTO> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Publicar Producto", description = "Crea un producto nuevo en el Marketplace.")
    public ResponseEntity<ProductoResponseDTO> crearProducto(@Valid @RequestBody ProductoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crearProducto(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar Producto", description = "Edita los detalles, precio y stock de un producto publicado.")
    public ResponseEntity<ProductoResponseDTO> actualizarProducto(@PathVariable UUID id, @Valid @RequestBody ProductoRequestDTO dto) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Quitar Producto", description = "Realiza un Soft Delete (borrado lógico) del producto. El producto permanecerá en el registro histórico de la base de datos pero no aparecerá en el catálogo.")
    public ResponseEntity<Void> eliminarProducto(@PathVariable UUID id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}
