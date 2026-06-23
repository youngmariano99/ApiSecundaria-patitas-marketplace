package com.patitas.alerta.repositories;

import com.patitas.alerta.entities.ProductoMarketplace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductoMarketplaceRepository extends JpaRepository<ProductoMarketplace, UUID> {
    List<ProductoMarketplace> findByCategoriaId(UUID categoriaId);
}
