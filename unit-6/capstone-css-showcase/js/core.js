document.querySelectorAll('.b-effect-wavy').forEach(p => {
    let charIndex = 0;
    const words = p.textContent.trim().split(/\s+/);

    p.innerHTML = words.map(word => {
        const chars = [...word].map(char => {
            const delay = charIndex * -0.05;
            charIndex += 1;
            return `<span class="b-effect-wavy__char" style="animation-delay: ${delay}s">${char}</span>`;
        }).join('');

        return `<span class="b-effect-wavy__word">${chars}</span>`;
    }).join(' ');
});

const home_imgs = [
    "ahit-clocktowers.png",
    "brick-avenue.jpg",
    "ctx-promo.jpg",
    "epcot-floor.jpg",
    "epi-tpc.png",
    "fv-entry.png",
    "fv-fireworks.png",
    "fv-jungle.png",
    "fv-pandora.png",
    "fwa-dino.png",
    "fwa-lake.png",
    "fwa-pond.png",
    "mk-tomorrow.jpg",
    "mmrr-promoblur.png",
    "monorail-meme.png",
    "monorail.webp",
    "mwcon-fuse.png",
    "searchlights-pressure.png",
    "snw-bowser.jpg",
    "sp3-alterna.jpeg",
    "space-board.jpg",
    "space-tunnel.jpg",
    "tdrz-cover.png",
    "tot-board.png",
    "tot-boiler.jpg",
    "tvrs-space.png",
    "wdw-down.jpg"
];

const image_container = document.querySelector('.b-bg-fade');
if (image_container) {
    const scriptEl = document.querySelector('script[src*="core.js"]');
    const scriptSrc = scriptEl?.getAttribute('src') || 'js/core.js';
    const resolvedScript = new URL(scriptSrc, window.location.href);
    const siteRootHref = resolvedScript.href.replace(/\/js\/core\.js$/i, '');
    let rand = Math.floor(Math.random() * home_imgs.length);
    image_container.onload = () => image_container.classList.add('is-loaded');
    image_container.src = `${siteRootHref}/images/bg/${home_imgs[rand]}`;
}

const MARQUEE_SPEED = 30;

const track = document.querySelector('.b-footer__track');
if (track) {
    const content = track.querySelector('.b-footer__ribbon');

    const fillMarquee = () => {
        while (track.children.length > 1) {
            track.removeChild(track.lastChild);
        }

        if (window.matchMedia('(max-width: 768px)').matches) return;

        const singleWidth = content.offsetWidth;
        const minWidth = track.parentElement.offsetWidth * 2;
        while (track.scrollWidth < minWidth) {
            const clone = content.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button, input, [tabindex]').forEach(el => {
                el.setAttribute('tabindex', '-1');
            });
            track.appendChild(clone);
        }
        const duration = singleWidth / MARQUEE_SPEED;
        track.style.animationDuration = `${duration}s`;
        track.style.setProperty('--marquee-width', `${singleWidth}px`);
    };

    fillMarquee();

    let resizeTimer;
    new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(fillMarquee, 100);
    }).observe(track.parentElement);

    let mouseDown = false;
    document.addEventListener('mousedown', () => mouseDown = true);
    document.addEventListener('mouseup', () => mouseDown = false);

    content.querySelectorAll('a, button, input').forEach(el => {
        el.addEventListener('focus', () => {
            if (mouseDown) return;
            const duration = track.style.animationDuration;
            const width = track.style.getPropertyValue('--marquee-width');
            track.style.animation = 'none';
            track.offsetWidth;
            track.style.animation = '';
            track.style.animationDuration = duration;
            track.style.setProperty('--marquee-width', width);
            track.style.setProperty('--marquee-play-state', 'paused');
        });
        el.addEventListener('blur', () => {
            track.style.setProperty('--marquee-play-state', 'running');
        });
    });
}

document.querySelector('.b-header__menu')?.addEventListener('mouseup', () => {
    const sidebar = document.querySelector('.b-nav');
    const core = document.querySelector('.b-main');
    if (sidebar && core) {
        const isOpening = !sidebar.classList.contains('is-open');
        if (isOpening) {
            const lockedWidth = core.offsetWidth;
            core.style.width = lockedWidth + 'px';
            core.style.minWidth = lockedWidth + 'px';
            core.style.maxWidth = lockedWidth + 'px';
            core.style.flexShrink = '0';
        } else {
            core.style.width = '';
            core.style.minWidth = '';
            core.style.maxWidth = '';
            core.style.flexShrink = '';
        }
        sidebar.classList.toggle('is-open');
    }
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

if (lightbox && lightboxImg && lightboxCaption) {
    document.querySelectorAll('.b-graphic-item__holder img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            const caption = img.dataset.caption ?? '';
            lightboxCaption.innerHTML = caption;
            lightbox.classList.toggle('has-caption', caption !== '');
            lightbox.classList.add('is-active');
        });
    });

    document.querySelectorAll('.b-card img.u-lightbox').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            const caption = img.dataset.caption ?? '';
            lightboxCaption.innerHTML = caption;
            lightbox.classList.toggle('has-caption', caption !== '');
            lightbox.classList.add('is-active');
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('is-active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') lightbox.classList.remove('is-active');
    });
}

document.querySelectorAll('details').forEach(details => {
  const summary = details.querySelector('summary');

  const wrapper = document.createElement('div');
  wrapper.classList.add('u-details-body');
  [...details.children].forEach(el => {
    if (el.tagName !== 'SUMMARY') wrapper.appendChild(el);
  });
  details.appendChild(wrapper);

  if (details.open) {
    wrapper.style.height = 'auto';
  } else {
    wrapper.style.height = '0';
  }

  summary.addEventListener('click', e => {
    e.preventDefault();

    if (details.open) {
      wrapper.style.height = wrapper.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        wrapper.style.height = '0';
      }));
      wrapper.addEventListener('transitionend', () => {
        details.removeAttribute('open');
      }, { once: true });
    } else {
      details.setAttribute('open', '');
      wrapper.style.height = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        wrapper.style.height = wrapper.scrollHeight + 'px';
      }));
      wrapper.addEventListener('transitionend', () => {
        wrapper.style.height = 'auto';
      }, { once: true });
    }
  });
});
