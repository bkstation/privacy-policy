(() => {
  const root = document.documentElement;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const allowedModes = new Set(['light', 'auto', 'dark']);
  const modeOrder = ['auto', 'light', 'dark'];
  const labels = {
    auto: 'Theme: automatic. Activate for light theme',
    light: 'Theme: light. Activate for dark theme',
    dark: 'Theme: dark. Activate for automatic theme'
  };

  function currentMode() {
    const mode = root.dataset.themeMode || 'auto';
    return allowedModes.has(mode) ? mode : 'auto';
  }

  function render(mode, save) {
    const resolved = mode === 'auto' ? (media.matches ? 'dark' : 'light') : mode;
    root.dataset.themeMode = mode;
    root.dataset.theme = resolved;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#0e141d' : '#ffffff');
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.setAttribute('aria-label', labels[mode]);
      toggle.title = `Theme: ${mode}`;
    }
    if (save) {
      try { localStorage.setItem('bk-theme', mode); } catch (_) {}
    }
  }

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const mode = currentMode();
    render(modeOrder[(modeOrder.indexOf(mode) + 1) % modeOrder.length], true);
  });

  media.addEventListener?.('change', () => {
    if (currentMode() === 'auto') render('auto', false);
  });

  render(currentMode(), false);
})();
