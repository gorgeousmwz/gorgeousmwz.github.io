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
