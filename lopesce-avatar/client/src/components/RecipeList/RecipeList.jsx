import React, { useEffect, useMemo, useState } from 'react';
import './RecipeList.css';

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeWpUrl(url = '') {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https://lopesce.it${url}`;
  return url;
}

export default function RecipeList() {
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
            `https://lopesce.it/wp-json/wp/v2/ricette?per_page=${perPage}&page=${page}&_embed=1`,
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
    return () => { cancelled = true; };
  }, []);

  const recipes = useMemo(
    () =>
      items
        .map((x) => {
          const title = stripHtml(x?.title?.rendered || '');

          // Immagine featured
          const imageUrl = normalizeWpUrl(
            x?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
            x?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
            ''
          );

          // Categoria ricetta (categorie_ricette)
          const category = x?._embedded?.['wp:term']?.[0]?.[0]?.name || '';

          // Descrizione da Yoast o excerpt
          const description =
            x?.yoast_head_json?.description ||
            stripHtml(x?.excerpt?.rendered || '');

          const link = x?.link || '';

          return { id: x?.id || title, title, imageUrl, category, description, link };
        })
        // Solo versione italiana — esclude URL con /en/
        .filter((r) => r.title && !r.link.includes('/en/')),
    [items]
  );

  return (
    <div className="recipe-list-container">
      <div className="recipe-header">
        <h2>Le Nostre Ricette</h2>
      </div>

      <div className="recipe-grid">
        {loading && (
          <div className="recipe-card">
            <div className="recipe-info">
              <h3>Caricamento ricette…</h3>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="recipe-card">
            <div className="recipe-info">
              <h3>Errore caricamento</h3>
              <p className="recipe-desc">{error}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          recipes.map((r) => (
            <div key={r.id} className="recipe-card">
              {r.imageUrl && (
                <div className="recipe-img-wrapper">
                  <img src={r.imageUrl} alt={r.title} loading="lazy" />
                </div>
              )}
              <div className="recipe-info">
                {r.category && (
                  <span className="recipe-category">{r.category}</span>
                )}
                <h3>{r.title}</h3>
                {r.description && (
                  <p className="recipe-desc">{r.description}</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
