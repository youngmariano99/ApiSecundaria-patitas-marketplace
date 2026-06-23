import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProveedorDependencias } from './infrastructure/DependenciasContext';
import { MarketplaceCatalog } from './ui/pages/MarketplaceCatalog';

export const App: React.FC = () => {
  return (
    <ProveedorDependencias>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MarketplaceCatalog />} />
        </Routes>
      </BrowserRouter>
    </ProveedorDependencias>
  );
};

export default App;
