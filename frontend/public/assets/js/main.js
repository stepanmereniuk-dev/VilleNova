// API OpenAgenda

const API_KEY   = 'aab02dc8ee044e5da4b8adda877392b1';
const AGENDA_ID = '30166879';
const API_URL   = `https://api.openagenda.com/v2/agendas/${AGENDA_ID}/events`;
const EVENTS_API = (typeof API_BASE !== 'undefined') ? API_BASE : 'http://127.0.0.1:8000/api';


function getTitle(event) {
  if (event.title.fr) return event.title.fr;
  if (event.title.en) return event.title.en;
  return 'Sans titre';
}

function getPrice(event) {
  if (event.conditions && event.conditions.fr) return event.conditions.fr;
  return '';
}

// function getImageUrl(event) {
//   if (!event.image || !event.image.variants || event.image.variants.length === 0) {
//     return null;
//   }
//lieu et la ville


function getVenue(event) {
  const name = event.location ? event.location.name : '';
  const city = event.location ? event.location.city : '';
  // On filtre les valeurs vides et on les joint avec une virgule
  return [name, city].filter(Boolean).join(', ');
}


function getImageUrl(event) {
  if (!event.image || !event.image.variants || event.image.variants.length === 0) {
    return null;
  }
  const thumbnail = event.image.variants.find(function(variant) {
    return variant.type === 'thumbnail';
  });
  const chosenVariant = thumbnail || event.image.variants[0];
  return event.image.base + chosenVariant.filename;
}


function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short'
  }).format(date);
}



//  HTML 
function createCardHTML(event) {
  const imageUrl  = getImageUrl(event);
  const eventTitle = getTitle(event);
  const price     = getPrice(event);
  const venue     = getVenue(event);

  let date = '';
  if (event.timings && event.timings[0]) {
    date = formatDate(event.timings[0].begin);
  }

  let tag = '';
  if (event.keywords && event.keywords.fr && event.keywords.fr[0]) {
    tag = event.keywords.fr[0];
  }

  let imageHTML = '';
  if (imageUrl) {
    imageHTML = `<img src="${imageUrl}" alt="${eventTitle}" class="card__img" loading="lazy" width="400" height="160">`;
  } else {
    imageHTML = `<div class="card__img card__img--placeholder"></div>`;
  }

  // On construit le HTML complet de la carte
  // data-id stocke l'identifiant de l'événement pour savoir sur lequel on a cliqué
  
  return `
    <article class="card" data-id="${event.uid}" tabindex="0" role="button" aria-label="Voir ${eventTitle}">
      ${imageHTML}
      <div class="card__body">
        ${tag   ? `<span class="card__tag">${tag}</span>`         : ''}
        <h2 class="card__title">${eventTitle}</h2>
        ${date  ? `<p class="card__date">${date}</p>`             : ''}
        <p class="card__location">${venue}</p>
        ${price ? `<p class="card__price">${price}</p>`           : ''}
      </div>
    </article>
  `;
}

function createEventRowHTML(event, index) {
  const eventTitle = getTitle(event);
  const city       = event.location ? event.location.city : '';
  const number = String(index + 1).padStart(2, '0');

  let date = '';
  if (event.timings && event.timings[0]) {
    date = formatDate(event.timings[0].begin);
  }

  return `
    <li class="event-item">
      <a href="pages/event.html?id=${event.uid}">
        <span class="event-item__num">${number}</span>
        <span class="event-item__date">${date}</span>
        <span class="event-item__title">${eventTitle}</span>
        <span class="event-item__location">${city}</span>
      </a>
    </li>
  `;
}

function createLocalEventRowHTML(event, index) {
  const number = String(index + 1).padStart(2, '0');
  const date   = event.date_range || '';
  const title  = event.title || 'Sans titre';
  const city   = event.location_city || '';

  return `
    <li class="event-item">
      <a href="pages/event.html?local=${event.id}">
        <span class="event-item__num">${number}</span>
        <span class="event-item__date">${date}</span>
        <span class="event-item__title">${title}</span>
        <span class="event-item__location">${city}</span>
      </a>
    </li>
  `;
}

function goToEvent(eventId) {
  window.location.href = `pages/event.html?id=${eventId}`;
}


async function loadEvents() {
  try {
    //20 en cours 
    const response = await fetch(
      `${API_URL}?size=20&relative[0]=current&relative[1]=upcoming&detailed=1&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Le serveur a répondu avec une erreur : ' + response.status);
    }

    const data   = await response.json();
    const events = data.events || [];

    //3 cartes
    const cardsContainer = document.getElementById('featured-cards');

    if (cardsContainer) {
      const first3Events = events.slice(0, 3);
      cardsContainer.innerHTML = first3Events.map(createCardHTML).join('');

      cardsContainer.addEventListener('click', function(event) {
        const clickedCard = event.target.closest('.card[data-id]');
        if (clickedCard) {
          goToEvent(clickedCard.dataset.id);
        }
      });
      cardsContainer.addEventListener('keydown', function(event) {
        const isEnterOrSpace = event.key === 'Enter' || event.key === ' ';
        const clickedCard    = event.target.closest('.card[data-id]');
        if (isEnterOrSpace && clickedCard) {
          goToEvent(clickedCard.dataset.id);
        }
      });
    }

    const listContainer = document.getElementById('events-list');
    if (listContainer) {
      let localEvents = [];
      try {
        const localRes = await fetch(`${EVENTS_API}/events/`);
        localEvents = await localRes.json();
        localEvents.reverse(); //newest
      } catch (e) {
        console.error('Erreur chargement événements VilleNova :', e);
      }

      const localHTML = localEvents
        .map((ev, i) => createLocalEventRowHTML(ev, i))
        .join('');
      const openAgendaHTML = events
        .map((ev, i) => createEventRowHTML(ev, localEvents.length + i))
        .join('');

      listContainer.innerHTML = localHTML + openAgendaHTML;
    }

  } catch (error) {
    console.error('Erreur lors du chargement des événements :', error);

    const cardsContainer = document.getElementById('featured-cards');
    if (cardsContainer) {
      cardsContainer.innerHTML = '<p class="loading">Impossible de charger les événements. Vérifiez votre connexion.</p>';
    }
  }
}


loadEvents();
