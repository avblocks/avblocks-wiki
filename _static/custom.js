(function () {
  'use strict';

  var storageKey = 'avblocks-sidebar-scroll-top';

  function getSidebar() {
    return document.querySelector('.sidebar-scroll');
  }

  function restoreSidebarPosition() {
    var sidebar = getSidebar();
    if (!sidebar) {
      return;
    }

    var savedPosition = window.sessionStorage.getItem(storageKey);
    if (savedPosition !== null) {
      sidebar.scrollTop = parseInt(savedPosition, 10) || 0;
    }
  }

  function saveSidebarPosition() {
    var sidebar = getSidebar();
    if (sidebar) {
      window.sessionStorage.setItem(storageKey, sidebar.scrollTop);
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('.sidebar-scroll a');
    if (link && link.href) {
      saveSidebarPosition();
    }
  });

  window.addEventListener('pageshow', restoreSidebarPosition);
  document.addEventListener('DOMContentLoaded', restoreSidebarPosition);
}());
