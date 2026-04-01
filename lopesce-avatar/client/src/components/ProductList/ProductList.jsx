import React, { useEffect, useMemo, useState } from 'react';
import './ProductList.css';

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function firstImgSrcFromHtml(html = '') {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] || '';
}

function normalizeWpUrl(url = '') {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://lopesce.it${url}`;
  return url;
}

export default function ProductList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError('');
      try {
        const all = [];
        let page = 1;
        const perPage = 100;

        while (true) {
          const res = await fetch(
            `https://lopesce.it/wp-json/wp/v2/prodotti?per_page=${perPage}&page=${page}&_embed=1`,
            { headers: { Accept: 'application/json' } }
          );

          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
          }

          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) break;
          all.push(...data);
          if (data.length < perPage) break;
          page += 1;
        }

        if (!cancelled) setItems(all);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Errore di rete');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const products = useMemo(
    () =>
      items
        .map((x) => {
          const title = stripHtml(x?.title?.rendered || '');
          const featured =
            x?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            x?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
            '';
          const fromContent = firstImgSrcFromHtml(x?.content?.rendered || '');
          const imageUrl = normalizeWpUrl(featured || fromContent);
          return { id: x?.id || title, title, imageUrl };
        })
        .filter((p) => p.title),
    [items]
  );

  return (
    <div className="product-list-container">
      <div className="product-header">
        <h2>Il Nostro Catalogo Surgelati</h2>
        <p>Scopri la freschezza dei prodotti Lo Pesce.</p>
      </div>
      
      <div className="product-grid">
        {loading && (
          <div className="product-card">
            <div className="product-info">
              <h3>Caricamento prodotti…</h3>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="product-card">
            <div className="product-info">
              <h3>Errore caricamento</h3>
              <p className="product-desc">{error}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          products.map((p) => (
            <div key={p.id} className="product-card">
              {p.imageUrl && (
                <div className="product-img-wrapper">
                  <img src={p.imageUrl} alt={p.title} loading="lazy" />
                </div>
              )}
              <div className="product-info">
                <h3>{p.title}</h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
