
const API_KEY   = 'aab02dc8ee044e5da4b8adda877392b1';
const AGENDA_ID = '30166879';
const LOCAL_API = 'http://127.0.0.1:8000/api';


function getTitle(event) {
  if (event.title.fr) return event.title.fr;
  if (event.title.en) return event.title.en;
  return 'Sans titre';
}
function getImageUrl(event) {
  if (!event.image || !event.image.variants || event.image.variants.length === 0) {
    return null;
  }
  return event.image.base + event.image.variants[0].filename;
}
function formatFullDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatTime(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Подія, створена на сайті (наш API).
async function loadLocalEvent(localId) {
  const container = document.getElementById('event-detail');

  try {
    const response = await fetch(`${LOCAL_API}/events/${localId}`);
    if (!response.ok) throw new Error('not found');
    const ev = await response.json();

    document.title = (ev.title || 'Événement') + ' — VilleNova';

    const imageHTML = ev.image_url
      ? `<img src="${ev.image_url}" alt="${ev.title}" class="event-detail__img" loading="eager">`
      : '';

    const tags = Array.isArray(ev.tags) ? ev.tags : [];
    const tagsHTML = tags.length > 0
      ? `<div class="event-detail__tags">
           ${tags.map(function(tag) { return `<span class="card__tag">${tag}</span>`; }).join('')}
         </div>`
      : '';

    const hasLocation = ev.location_name || ev.location_address || ev.location_city;
    const locationHTML = hasLocation
      ? `<address class="event-detail__location">
           <strong>${ev.location_name || ''}</strong><br>
           ${ev.location_address || ''}<br>
           ${ev.location_postal_code || ''} ${ev.location_city || ''}
         </address>`
      : '';

    const registerHTML = ev.registration_url
      ? `<a href="${ev.registration_url}" class="btn-primary" target="_blank" rel="noopener noreferrer">S'inscrire</a>`
      : '';

    container.innerHTML = `
      ${imageHTML}

      <div class="event-detail__content">

        ${tagsHTML}

        <h2 class="event-detail__title">${ev.title || ''}</h2>

        ${ev.date_range ? `<p class="event-detail__daterange">${ev.date_range}</p>` : ''}

        ${ev.description ? `<p class="event-detail__desc">${ev.description}</p>` : ''}
        ${ev.long_description ? `<div class="event-detail__long">${ev.long_description}</div>` : ''}

        <div class="event-detail__meta">
          ${locationHTML}
          ${ev.conditions ? `<p class="event-detail__price">${ev.conditions}</p>` : ''}
        </div>

        ${registerHTML}

      </div>
    `;

  } catch (error) {
    console.error('Erreur lors du chargement de l\'événement VilleNova :', error);
    container.innerHTML = `
      <p>Impossible de charger cet événement.</p>
      <a href="../index.html">← Retour à l'accueil</a>
    `;
  }
}

async function loadEvent() {
  const container = document.getElementById('event-detail');

  const urlParams  = new URLSearchParams(window.location.search);
  const localId    = urlParams.get('local');
  const eventId    = urlParams.get('id');

  // Подія, створена на сайті
  if (localId) {
    return loadLocalEvent(localId);
  }

  if (!eventId) {
    container.innerHTML = '<p>Aucun événement sélectionné.</p>';
    return;
  }

  try {
    // l'API 
    const response = await fetch(
      `https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events/${eventId}?key=${API_KEY}`
    );
    const data  = await response.json();
    //DATA
    const event = data.event;
    document.title = getTitle(event) + ' — VilleNova';
    const imageUrl    = getImageUrl(event);
    const eventTitle  = getTitle(event);
    const tags        = event.keywords && event.keywords.fr ? event.keywords.fr : [];
    const dateRange   = event.dateRange && event.dateRange.fr ? event.dateRange.fr : '';
    const description = event.description && event.description.fr ? event.description.fr : '';
    const longDesc    = event.longDescription && event.longDescription.fr ? event.longDescription.fr : '';
    const conditions  = event.conditions && event.conditions.fr ? event.conditions.fr : '';
    const location    = event.location || null;
    const registration = event.registration && event.registration[0] ? event.registration[0] : null;
    const timings = event.timings ? event.timings.slice(0, 5) : [];

    // Image principale
    const imageHTML = imageUrl
      ? `<img src="${imageUrl}" alt="${eventTitle}" class="event-detail__img" loading="eager" width="860" height="352">`
      : '';
    const tagsHTML = tags.length > 0
      ? `<div class="event-detail__tags">
           ${tags.map(function(tag) { return `<span class="card__tag">${tag}</span>`; }).join('')}
         </div>`
      : '';
    const timingsHTML = timings.length > 0
      ? `<ul class="event-detail__timings">
           ${timings.map(function(slot) {
             return `<li>${formatFullDate(slot.begin)} → ${formatTime(slot.end)}</li>`;
           }).join('')}
         </ul>`
      : '';

    const locationHTML = location
      ? `<address class="event-detail__location">
           <strong>${location.name || ''}</strong><br>
           ${location.address || ''}<br>
           ${location.postalCode || ''} ${location.city || ''}
         </address>`
      : '';

    const registerHTML = registration
      ? `<a href="${registration.value}" class="btn-primary" target="_blank" rel="noopener noreferrer">S'inscrire</a>`
      : '';



    container.innerHTML = `
      ${imageHTML}

      <div class="event-detail__content">

        ${tagsHTML}

        <h2 class="event-detail__title">${eventTitle}</h2>

        ${dateRange   ? `<p class="event-detail__daterange">${dateRange}</p>`   : ''}

        ${timingsHTML}

        ${description ? `<p class="event-detail__desc">${description}</p>`      : ''}
        ${longDesc    ? `<div class="event-detail__long">${longDesc}</div>`      : ''}

        <div class="event-detail__meta">
          ${locationHTML}
          ${conditions  ? `<p class="event-detail__price">${conditions}</p>`    : ''}
        </div>

        ${registerHTML}

      </div>
    `;

  } catch (error) {
    console.error('Erreur lors du chargement de l\'événement :', error);
    container.innerHTML = `
      <p>Impossible de charger cet événement.</p>
      <a href="../index.html">← Retour à l'accueil</a>
    `;
  }
}


loadEvent();
