(function () {
  function createMenu(menu, menuTitle) {
    var menuEl = document.getElementById('layout-menu');
    menuEl.innerHTML = '';

    var category = document.createElement('div');
    category.className = 'menu-category';
    category.textContent = menuTitle || 'Profile';
    menuEl.appendChild(category);

    menu.forEach(function (item, index) {
      var wrapper = document.createElement('div');
      wrapper.className = 'menu-item';

      var link = document.createElement('a');
      link.href = '#' + item.id;
      link.textContent = item.title;
      if (index === 0) {
        link.className = 'current';
      }

      wrapper.appendChild(link);
      menuEl.appendChild(wrapper);
    });
  }

  function createTopTitle(text) {
    var top = document.createElement('div');
    top.id = 'toptitle';
    var h1 = document.createElement('h1');
    h1.textContent = text;
    top.appendChild(h1);
    return top;
  }

  function createProfileTable(profile) {
    var table = document.createElement('table');
    table.className = 'imgtable';

    var tr = document.createElement('tr');

    var tdImg = document.createElement('td');
    var a = document.createElement('a');
    a.href = profile.avatarLink;
    var img = document.createElement('img');
    img.src = profile.avatarSrc;
    img.alt = profile.avatarAlt;
    img.width = parseInt(profile.avatarWidth, 10);
    img.height = parseInt(profile.avatarHeight, 10);
    a.appendChild(img);
    tdImg.appendChild(a);
    tdImg.appendChild(document.createTextNode('\u00a0'));

    var tdText = document.createElement('td');
    tdText.setAttribute('align', 'left');
    var p = document.createElement('p');
    p.innerHTML = (profile.introLines || []).join('');
    tdText.appendChild(p);

    tr.appendChild(tdImg);
    tr.appendChild(tdText);
    table.appendChild(tr);
    return table;
  }

  function appendParagraphSection(container, section) {
    var h2 = document.createElement('h2');
    h2.id = section.id;
    h2.textContent = section.title;
    container.appendChild(h2);

    (section.paragraphs || []).forEach(function (text) {
      var p = document.createElement('p');
      p.innerHTML = text;
      container.appendChild(p);
    });
  }

  function appendNewsSection(container, section) {
    var h2 = document.createElement('h2');
    h2.id = section.id;
    h2.textContent = section.title;
    container.appendChild(h2);

    var ul = document.createElement('ul');
    ul.id = 'news-container';

    (section.items || []).forEach(function (item) {
      var li = document.createElement('li');
      li.innerHTML = "<span class='red-text'><b>[" + item.date + "]</b></span>&nbsp;&nbsp;&nbsp;" + item.content + "!&nbsp;&nbsp;&nbsp;<b>[" + item.tag + "]</b>";
      ul.appendChild(li);
    });

    container.appendChild(ul);
  }

  function appendPublicationSection(container, section) {
    var h2 = document.createElement('h2');
    h2.id = section.id;
    h2.textContent = section.title;
    container.appendChild(h2);

    (section.groups || []).forEach(function (group) {
      var h3 = document.createElement('h3');
      h3.textContent = group.subtitle;
      container.appendChild(h3);

      var ol = document.createElement('ol');
      var items = group.itemsHtml || (group.items || []).map(function (item) {
        return item;
      });

      items.forEach(function (itemHtml) {
        var li = document.createElement('li');
        var p = document.createElement('p');
        p.innerHTML = itemHtml;
        li.appendChild(p);
        ol.appendChild(li);
      });

      container.appendChild(ol);
    });
  }

  function appendOrderedListSection(container, section) {
    var h2 = document.createElement('h2');
    h2.id = section.id;
    h2.textContent = section.title;
    container.appendChild(h2);

    var ol = document.createElement('ol');
    var items = section.itemsHtml || (section.items || []).map(function (item) {
      return item;
    });

    items.forEach(function (itemHtml) {
      var li = document.createElement('li');
      var p = document.createElement('p');
      p.innerHTML = itemHtml;
      li.appendChild(p);
      ol.appendChild(li);
    });

    container.appendChild(ol);
  }

  function appendConferenceMapSection(container, section) {
    if (!section || !section.events || !section.events.length || !window.L) {
      return;
    }

    var h2 = document.createElement('h2');
    h2.id = section.id;
    h2.textContent = section.title;
    container.appendChild(h2);

    var mapCard = document.createElement('section');
    mapCard.className = 'conference-map-card';

    var subtitle = document.createElement('p');
    subtitle.className = 'conference-map-subtitle';
    subtitle.textContent = section.subtitle || '';
    mapCard.appendChild(subtitle);

    var mapElement = document.createElement('div');
    mapElement.className = 'conference-map';
    mapElement.setAttribute('aria-label', section.title);
    mapCard.appendChild(mapElement);
    container.appendChild(mapCard);

    var map = L.map(mapElement, {
      attributionControl: true,
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    var bounds = [];
    section.events.forEach(function (event) {
      var coordinates = event.coordinates;
      if (!coordinates || coordinates.length !== 2 ||
          typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number' ||
          !isFinite(coordinates[0]) || !isFinite(coordinates[1])) {
        return;
      }

      var details = '<strong>' + escapeHtml(event.name) + '</strong><br />' +
        escapeHtml(event.city) + (event.date ? '<br /><span class="conference-map-date">' +
        escapeHtml(event.date) + '</span>' : '');

      var marker = L.marker(coordinates, {
        icon: L.divIcon({
          className: 'conference-map-marker',
          html: '<span></span>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          popupAnchor: [0, -10]
        })
      }).addTo(map);

      marker.bindPopup(details, {
        closeButton: false,
        offset: [0, -2]
      });
      marker.bindTooltip(details, {
        direction: 'top',
        offset: [0, -11],
        opacity: 0.95,
        className: 'conference-map-tooltip'
      });
      bounds.push(coordinates);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 4);
    } else {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 4 });
    }
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[character];
    });
  }

  function render(data) {
    document.title = data.meta.title;

    createMenu(data.menu || [], data.meta.menuTitle);

    var content = document.getElementById('layout-content');
    content.innerHTML = '';
    content.appendChild(createTopTitle(data.meta.topTitle));
    content.appendChild(createProfileTable(data.profile));

    appendParagraphSection(content, data.sections.about);
    appendParagraphSection(content, data.sections.education);
    appendNewsSection(content, data.sections.news);
    appendPublicationSection(content, data.sections.publications);
    appendOrderedListSection(content, data.sections.projects);
    appendOrderedListSection(content, data.sections.proposals);
    appendOrderedListSection(content, data.sections.competitions);
    appendOrderedListSection(content, data.sections.honors);
    appendConferenceMapSection(content, data.sections['conference-footprints']);
  }

  function setCurrentMenuByHash() {
    var hash = window.location.hash || '#about-me';
    var links = document.querySelectorAll('#layout-menu a');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove('current');
      if (links[i].getAttribute('href') === hash) {
        links[i].classList.add('current');
      }
    }
  }

  fetch('json/profile.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load profile.json');
      }
      return response.json();
    })
    .then(function (data) {
      render(data);
      setCurrentMenuByHash();
      window.addEventListener('hashchange', setCurrentMenuByHash);
    })
    .catch(function (error) {
      console.error(error);
    });
})();
