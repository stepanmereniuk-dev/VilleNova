


async function loadLocalEvents() {
  const container = document.getElementById('local-events-list');
  if (!container) return;
  
  try {
    const res = await fetch(`${API_BASE}/events/`);
    const events = await res.json();
    
    if (!events.length) {
      container.innerHTML = '<li class="loading">Aucun événement pour le moment.</li>';
      return;
    }
    events.reverse();
    




    container.innerHTML = events.map((ev, index) => {
      const number = String(index + 1).padStart(2, '0');
      const date = escapeHtml(ev.date_range || '');
      const title = escapeHtml(ev.title);
      const city = escapeHtml(ev.location_city || '');
      return `
      <li class="event-item">
        <span class="event-item__num">${number}</span>
        <span class="event-item__date">${date}</span>
        <span class="event-item__title">${title}</span>
      <span class="event-item__location">${city}</span>
      </li>`;
    })
    .join('');
  } catch (err) {
    console.error('Erreur lors du chargement des événements VilleNova :', err);
    container.innerHTML = '<li class="loading">Impossible de charger les événements VilleNova.</li>';
  }
}

document.addEventListener('DOMContentLoaded', loadLocalEvents);

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}