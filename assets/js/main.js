/* Interactions du carnet : le pipeline à encrer, le choix des projets et la copie de l'adresse.
   Sans JavaScript, tout reste lisible : les étapes sont déjà encrées et tous les projets sont affichés. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les commandes qui n'ont de sens qu'avec JavaScript
  Array.prototype.forEach.call(document.querySelectorAll('[data-js-only]'), function (el) {
    el.hidden = false;
  });

  /* ---------- Le pipeline ---------- */
  var stages = Array.prototype.slice.call(document.querySelectorAll('.stage'));
  var statusEl = document.getElementById('pipeline-status');
  var runBtn = document.getElementById('pipeline-run');
  var resetBtn = document.getElementById('pipeline-reset');
  var total = stages.length;
  var current = 0;
  var timer = null;
  var touched = false;

  function renderStages() {
    stages.forEach(function (btn, i) {
      var inked = i < current;
      btn.classList.toggle('is-inked', inked);
      btn.setAttribute('aria-pressed', inked ? 'true' : 'false');
    });
    if (statusEl) {
      statusEl.textContent = current + '/' + total + (current > 1 ? ' étapes encrées' : ' étape encrée');
    }
  }

  function stopRun() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function setStage(n) {
    current = Math.max(0, Math.min(total, n));
    renderStages();
  }

  function runPipeline(fromStart) {
    stopRun();
    if (reduceMotion) {
      setStage(total);
      return;
    }
    if (fromStart || current >= total) {
      setStage(0);
    }
    timer = setInterval(function () {
      if (current >= total) {
        stopRun();
        return;
      }
      setStage(current + 1);
    }, 650);
  }

  if (total) {
    stages.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        touched = true;
        stopRun();
        setStage(i + 1);
      });
    });
    if (runBtn) {
      runBtn.addEventListener('click', function () {
        touched = true;
        runPipeline(true);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        touched = true;
        stopRun();
        setStage(0);
      });
    }

    // Au chargement, seule la première étape est à l'encre ; le pipeline se lance seul
    // la première fois qu'il apparaît à l'écran, sauf si le visiteur a déjà cliqué.
    var section = document.getElementById('stages') || document.getElementById('pipeline');
    if (reduceMotion || !('IntersectionObserver' in window) || !section) {
      setStage(total);
    } else {
      setStage(1);
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            observer.disconnect();
            if (!touched) {
              runPipeline(false);
            }
          }
        });
      }, { threshold: 0.5 });
      observer.observe(section);
    }
  }

  /* ---------- Les projets ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
  var details = Array.prototype.slice.call(document.querySelectorAll('[data-project-detail]'));

  function selectProject(index, opts) {
    opts = opts || {};
    cards.forEach(function (card, i) {
      var selected = i === index;
      card.setAttribute('aria-pressed', selected ? 'true' : 'false');
      card.tabIndex = selected ? 0 : -1;
      if (selected && opts.focus) {
        card.focus();
      }
    });
    var shown = null;
    details.forEach(function (detail) {
      var match = Number(detail.getAttribute('data-project-detail')) === index;
      detail.hidden = !match;
      if (match) {
        shown = detail;
      }
    });
    if (opts.reveal && shown && window.innerWidth < 760) {
      shown.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  if (cards.length && details.length) {
    cards.forEach(function (card, i) {
      card.addEventListener('click', function () {
        selectProject(i, { reveal: true });
      });
      card.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          next = (i + 1) % cards.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          next = (i - 1 + cards.length) % cards.length;
        } else if (event.key === 'Home') {
          next = 0;
        } else if (event.key === 'End') {
          next = cards.length - 1;
        }
        if (next !== null) {
          event.preventDefault();
          selectProject(next, { focus: true });
        }
      });
    });
    selectProject(0);
  }

  /* ---------- Copier l'adresse ---------- */
  var copyBtn = document.getElementById('copy-email');
  var copyStatus = document.getElementById('copy-status');
  var emailLink = document.getElementById('email-link');

  function announce(message) {
    if (!copyStatus) {
      return;
    }
    copyStatus.textContent = message;
    setTimeout(function () {
      copyStatus.textContent = '';
    }, 2600);
  }

  function selectEmail() {
    if (!emailLink || !window.getSelection) {
      return false;
    }
    var range = document.createRange();
    range.selectNodeContents(emailLink);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      return document.execCommand('copy');
    } catch (e) {
      return false;
    }
  }

  if (copyBtn && emailLink) {
    copyBtn.addEventListener('click', function () {
      var address = emailLink.textContent.trim();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(function () {
          announce('adresse copiée');
        }, function () {
          announce(selectEmail() ? 'adresse copiée' : 'adresse sélectionnée, copie-la avec Ctrl+C');
        });
      } else {
        announce(selectEmail() ? 'adresse copiée' : 'adresse sélectionnée, copie-la avec Ctrl+C');
      }
    });
  }
})();
