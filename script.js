/* ================================================
   AUXÍLIOS SOCIAIS NO BRASIL
   script.js — Interatividade e animações
   Projeto Integrador de Humanas
   ================================================ */

// ---- 1. NAVBAR: efeito ao rolar e controle do hamburger ----

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

/**
 * Adiciona/remove a classe .scrolled na navbar conforme o scroll
 * e controla a visibilidade do botão "Voltar ao topo".
 */
window.addEventListener('scroll', () => {
  // Navbar muda de estilo após 60px de scroll
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
});

/**
 * Alterna o menu mobile ao clicar no botão hambúrguer.
 */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  // Bloqueia o scroll do body quando o menu está aberto
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

/**
 * Fecha o menu mobile quando um link é clicado.
 */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


// ---- 2. SCROLL SUAVE E BOTÃO "VOLTAR AO TOPO" ----

const scrollTopBtn = document.getElementById('scrollTop');

/** Leva o usuário de volta ao topo da página com scroll suave. */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ---- 3. ANIMAÇÕES AO APARECER NA TELA (Intersection Observer) ----

/**
 * Intersection Observer que adiciona a classe .visible
 * a todos os elementos com classe .reveal quando eles
 * entram na viewport. Cria um efeito de "surgimento" suave.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Atraso escalonado para grupos de cards (máx. 400ms)
        const delay = Math.min(i * 80, 400);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        // Para de observar o elemento após animá-lo
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,       // Ativa quando 12% do elemento está visível
    rootMargin: '0px 0px -40px 0px' // Gatilho um pouco antes do limite inferior
  }
);

// Observa todos os elementos marcados com .reveal
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


// ---- 4. GRÁFICO COM CHART.JS ---- 

/**
 * Dados aproximados por região do Brasil.
 * Fonte: MDS/SAGI (2023) — valores estimados para fins educativos.
 */
const chartData = {
  familias: {
    label: 'Famílias beneficiadas (milhões)',
    data: [9.2, 4.1, 3.6, 2.8, 1.4],
    colors: [
      'rgba(22,163,74,.85)',
      'rgba(14,165,233,.85)',
      'rgba(168,85,247,.85)',
      'rgba(245,158,11,.85)',
      'rgba(20,184,166,.85)'
    ],
  },
  percentual: {
    label: '% da população beneficiada',
    data: [41, 25, 22, 15, 12],
    colors: [
      'rgba(22,163,74,.85)',
      'rgba(14,165,233,.85)',
      'rgba(168,85,247,.85)',
      'rgba(245,158,11,.85)',
      'rgba(20,184,166,.85)'
    ],
  }
};

const regioes = ['Nordeste', 'Norte', 'Centro-Oeste', 'Sudeste', 'Sul'];

// Configuração do gráfico de barras
const ctx = document.getElementById('myChart').getContext('2d');

let currentDataset = 'familias';

const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: regioes,
    datasets: [{
      label: chartData.familias.label,
      data: chartData.familias.data,
      backgroundColor: chartData.familias.colors,
      borderColor: chartData.familias.colors.map(c => c.replace('.85)', '1)')),
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 700,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17,24,39,.92)',
        titleFont: { family: "'DM Sans', sans-serif", weight: 700, size: 13 },
        bodyFont:  { family: "'DM Sans', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const suffix = currentDataset === 'percentual' ? '%' : ' milhões de famílias';
            return ` ${context.parsed.y}${suffix}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,.06)' },
        ticks: {
          font: { family: "'DM Sans', sans-serif", size: 11 },
          color: '#6b7280',
          callback: (val) => currentDataset === 'percentual' ? val + '%' : val + 'M'
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'DM Sans', sans-serif", size: 11, weight: 600 },
          color: '#374151'
        }
      }
    }
  }
});

/**
 * Alterna entre os dois conjuntos de dados do gráfico
 * ao clicar nas abas "Famílias beneficiadas" / "% da população".
 */
document.querySelectorAll('.chart-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Atualiza estado ativo dos botões
    document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Pega o conjunto de dados selecionado
    currentDataset = tab.dataset.chart;
    const dataset = chartData[currentDataset];

    // Atualiza o gráfico com animação
    myChart.data.datasets[0].data  = dataset.data;
    myChart.data.datasets[0].label = dataset.label;
    myChart.data.datasets[0].backgroundColor = dataset.colors;
    myChart.update();
  });
});


// ---- 5. HIGHLIGHT DO LINK ATIVO NA NAVBAR (scroll spy) ----

/**
 * Observa qual seção está visível e marca o link
 * correspondente na navbar como "ativo".
 */
const sections     = document.querySelectorAll('section[id]');
const allNavLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          link.style.fontWeight = link.getAttribute('href') === `#${id}` ? '700' : '';
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));


// ---- 6. EFEITO DE DIGITAÇÃO NO HERO (opcional / sutil) ----

/**
 * Pequeno efeito de entrada escalonada nos elementos do hero
 * assim que a página carrega.
 */
document.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll(
    '.hero-tag, .hero-title, .hero-subtitle, .hero-buttons, .hero-stats'
  );

  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150 + i * 130);
  });
});


// ---- 7. FEEDBACK VISUAL AO CLICAR NOS BOTÕES ---- 

/**
 * Adiciona um pequeno efeito de "ripple" (ondulação)
 * aos botões principais ao serem clicados.
 */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,.35);
      width: 10px; height: 10px;
      top: ${e.clientY - rect.top - 5}px;
      left: ${e.clientX - rect.left - 5}px;
      animation: rippleAnim .5s ease-out forwards;
      pointer-events: none;
    `;

    // Injeta o keyframe se ainda não existir
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes rippleAnim {
          to { transform: scale(22); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.style.position = 'relative';
    this.style.overflow  = 'hidden';
    this.appendChild(ripple);

    // Remove o elemento após a animação
    setTimeout(() => ripple.remove(), 500);
  });
});
