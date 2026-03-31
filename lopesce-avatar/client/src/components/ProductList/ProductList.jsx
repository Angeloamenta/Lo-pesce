import React from 'react';
import productsData from '../../data/products.json';
import './ProductList.css';

export default function ProductList() {
  return (
    <div className="product-list-container">
      <div className="product-header">
        <h2>Il Nostro Catalogo Surgelati</h2>
        <p>Scopri la freschezza dei prodotti Lo Pesce.</p>
      </div>
      
      <div className="product-grid">
        {productsData.map((prod) => (
          <div key={prod.id} className="product-card">
            <div className="product-img-wrapper">
              <img src={prod.immagine} alt={prod.nome} loading="lazy" />
              <span className="product-category">{prod.categoria}</span>
            </div>
            <div className="product-info">
              <h3>{prod.nome}</h3>
              <p className="product-desc">{prod.descrizione}</p>
              <div className="product-footer">
                <span className="product-price">€{prod.prezzo.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
