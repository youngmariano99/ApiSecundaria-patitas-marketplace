package com.patitas.alerta.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductoResponseDTO {
    private UUID id;
    private String nombreVendedor;
    private String nombreCategoria;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
}
