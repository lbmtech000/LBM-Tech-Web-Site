// ===== THEME SYSTEM =====
let currentTheme = localStorage.getItem('lbm-theme') || 'dark';

function applyTheme(theme) {
  const btn = document.getElementById('themeToggle');
  if (theme === 'light') {
    document.body.classList.add('light');
    if (btn) btn.textContent = '☀️';
  } else {
    document.body.classList.remove('light');
    if (btn) btn.textContent = '🌙';
  }
  localStorage.setItem('lbm-theme', theme);
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
}

// ===== LANGUAGE SYSTEM =====
let currentLang = 'en';

function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLang(currentLang);
}

function applyLang(lang) {
  document.body.classList.toggle('ar', lang === 'ar');
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  const toggle = document.getElementById('langToggle');
  toggle.textContent = lang === 'en' ? 'عربي' : 'English';

  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = el.getAttribute('data-ph-' + lang) || el.placeholder;
    } else if (el.tagName === 'OPTION') {
      el.textContent = el.getAttribute('data-' + lang);
    } else {
      el.textContent = el.getAttribute('data-' + lang);
    }
  });

  document.querySelectorAll('[data-ph-' + lang + ']').forEach(el => {
    el.placeholder = el.getAttribute('data-ph-' + lang);
  });

  // Update chat placeholder
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.placeholder = lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...';
  }

  // Update chatbot welcome message direction
  const chatWindow = document.getElementById('chatwindow');
  if (chatWindow) {
    chatWindow.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
  }
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU =====
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('open');
}

// Close menu when link clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ===== FAQ =====
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    openItem.querySelector('.faq-answer').style.maxHeight = '0';
  });

  // Open clicked if was closed
  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// ===== CONTACT FORM =====
// الطريقة 1 (جاهزة الآن): إذا تركت FORMSPREE_ID فارغاً أو 'YOUR_FORM_ID'،
//   سيفتح تطبيق البريد تلقائياً مع كل بيانات الرسالة → يرسل مباشرة لـ lbmtech000@gmail.com
//
// الطريقة 2 (موصى بها - Formspree):
//   1. اذهب إلى formspree.io ← أنشئ حساباً مجاناً
//   2. أنشئ نموذجاً جديداً وضع فيه: lbmtech000@gmail.com
//   3. انسخ الـ Form ID فقط (مثل: xkoakpda) والصقه أدناه
const FORMSPREE_ID = 'xkoakpda'; // ← ضع هنا الـ ID فقط، بدون رابط

async function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');

  // Collect data
  const name    = document.getElementById('fieldName')?.value.trim()  || '';
  const org     = document.getElementById('fieldOrg')?.value.trim()   || '';
  const email   = document.getElementById('fieldEmail')?.value.trim() || '';
  const type    = document.getElementById('fieldType')?.value         || '';
  const message = document.getElementById('fieldMsg')?.value.trim()   || '';

  btn.textContent = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';
  btn.disabled = true;
  success.style.display = 'none';
  errorEl.style.display = 'none';

  // الطريقة المباشرة: إذا لم يُضبط Formspree بعد
  if (!FORMSPREE_ID || FORMSPREE_ID === 'YOUR_FORM_ID') {
    const subject = encodeURIComponent('New LBM Website Message from ' + name);
    const body = encodeURIComponent(
      'Name: ' + name + '\nOrganization: ' + org +
      '\nEmail: ' + email + '\nType: ' + type +
      '\n\nMessage:\n' + message
    );
    window.location.href = 'mailto:lbmtech000@gmail.com?subject=' + subject + '&body=' + body;
    btn.textContent = currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message';
    btn.disabled = false;
    return;
  }

  // الطريقة الاحترافية: Formspree
  try {
    const res = await fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, organization: org, email, type, message })
    });

    if (res.ok) {
      success.style.display = 'block';
      const span = success.querySelector('span');
      if (span) {
        span.textContent = currentLang === 'ar'
          ? '✓ تم الإرسال! سنتواصل معك خلال 48 ساعة.'
          : '✓ Message sent! We\'ll be in touch within 48 hours.';
      }
      form.reset();
      setTimeout(() => { success.style.display = 'none'; }, 6000);
    } else {
      throw new Error('Server error');
    }
  } catch (err) {
    errorEl.style.display = 'block';
  } finally {
    btn.textContent = currentLang === 'ar' ? 'إرسال الرسالة' : 'Send Message';
    btn.disabled = false;
  }
}

// ===== CHATBOT =====
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatwindow');
  const notif = document.querySelector('.chat-notification');
  
  if (chatOpen) {
    win.style.display = 'flex';
    setTimeout(() => win.classList.add('open'), 10);
    if (notif) notif.style.display = 'none';
  } else {
    win.classList.remove('open');
    setTimeout(() => { win.style.display = 'none'; }, 300);
  }
}

const botResponses = {
  en: {
    greeting: ["👋 Hello! Welcome to LBM — an Algerian deep-tech startup modernizing desalination plants. How can I help?", "Hi there! I'm the LBM assistant. We're in Year 1, building IoT & AI solutions for water desalination across North Africa. What would you like to know?"],
    stage: "LBM is in its first year — founded in 2025 in Sétif, Algeria 🇩🇿.\n\nRight now we are:\n✦ Deploying our core IoT monitoring platform\n✦ Running our first pilot with an Algerian desalination plant\n✦ Actively developing Predictive Maintenance AI for 2026\n\nWe're early stage, transparent about it, and moving fast. The web app is already live!",
    services: "LBM currently offers:\n\n🔌 Plant Digitization & IoT Integration — our core product\n📊 Real-Time Remote Monitoring Dashboard\n⚡ Energy Optimization Analytics\n🤝 Technical Consulting for plant operators\n\nIn development:\n🤖 Predictive Maintenance AI (2026)\n🔄 Automated Process Control (2027+)\n\nWe start where you are — no need to replace your existing equipment.",
    partner: "We're actively looking for:\n\n🏭 Desalination plant operators for pilot programs\n🏛️ Water authorities & government partners\n💼 Strategic investors who believe in African water tech\n🤝 Technology partners\n\nIf you're in any of these categories, please use our contact form or email us at contact@lbm-tech.dz — we respond within 48 hours.",
    vision: "LBM's vision is clear:\n\n🇩🇿 Phase 1 (Now): Algeria — pilot deployments\n🌍 Phase 2 (2026): North Africa — scale up\n🌏 Phase 3 (2027+): All of Africa\n🌐 Global: Beyond borders\n\nWe believe African engineers can solve African problems. The water challenge in Africa is massive — and we intend to be at the center of solving it.",
    predictive: "Predictive maintenance is one of our most exciting upcoming features.\n\nInstead of waiting for equipment to break (reactive) or servicing on a fixed schedule (preventive), our AI will analyze sensor data continuously to detect subtle anomalies that signal an upcoming failure — days or weeks before it happens.\n\nFor a desalination plant, unplanned downtime can leave thousands without water. Our AI prevents that.\n\nThis feature is in development and targeted for 2026.",
    contact: "You can reach us at:\n📧 lbmtech000@gmail.com\n📞 +213 658 660 553\n📍 Sétif, Algeria 🇩🇿\n\nWe respond within 48 hours.",
    default: "Thanks for your message! For a personalized answer, please use our contact form or email us at contact@lbm-tech.dz.\n\nIn the meantime, can I tell you more about:\n• Our current stage and what we're building\n• Our IoT and AI solutions\n• Our vision for Africa\n• Partnership and investment opportunities?"
  },
  ar: {
    greeting: ["👋 مرحباً! أهلاً بك في LBM — ستارت آب جزائري عميق التقنية يحدِّث محطات التحلية. كيف يمكنني مساعدتك؟", "أهلاً! أنا مساعد LBM. نحن في السنة الأولى، نبني حلول IoT والذكاء الاصطناعي لتحلية المياه في شمال أفريقيا. بماذا تريد أن تعرف؟"],
    stage: "LBM في سنتها الأولى — تأسست عام 2025 في سطيف، الجزائر 🇩🇿.\n\nالآن نحن:\n✦ ننشر منصة مراقبة IoT الأساسية\n✦ نشغّل أول مشروع تجريبي مع محطة تحلية جزائرية\n✦ نطوّر بنشاط الصيانة التنبؤية بالذكاء الاصطناعي لعام 2026\n\nمرحلة مبكرة، شفافون بشأنها، ونتقدم بسرعة. تطبيق الويب متاح الآن!",
    services: "LBM تقدم حالياً:\n\n🔌 رقمنة المحطات وتكامل IoT — منتجنا الأساسي\n📊 لوحة مراقبة عن بُعد فورية\n⚡ تحليلات تحسين الطاقة\n🤝 استشارات تقنية لمشغلي المحطات\n\nقيد التطوير:\n🤖 صيانة تنبؤية بالذكاء الاصطناعي (2026)\n🔄 تحكم آلي في العمليات (2027+)",
    partner: "نبحث بنشاط عن:\n\n🏭 مشغّلي محطات التحلية للبرامج التجريبية\n🏛️ سلطات المياه والشركاء الحكوميين\n💼 مستثمرين استراتيجيين يؤمنون بتقنية المياه الأفريقية\n🤝 شركاء تقنيين\n\nإذا كنت في أي من هذه الفئات، استخدم نموذج التواصل أو راسلنا على contact@lbm-tech.dz",
    vision: "رؤية LBM واضحة:\n\n🇩🇿 المرحلة 1 (الآن): الجزائر\n🌍 المرحلة 2 (2026): شمال أفريقيا\n🌏 المرحلة 3 (2027+): كل أفريقيا\n🌐 عالمياً: ما وراء الحدود\n\nنؤمن بأن المهندسين الأفارقة قادرون على حل المشاكل الأفريقية.",
    predictive: "الصيانة التنبؤية من أكثر ميزاتنا القادمة إثارة.\n\nبدلاً من انتظار تعطل المعدات، يحلل ذكاؤنا الاصطناعي بيانات الاستشعار باستمرار للكشف عن الشذوذات التي تشير إلى عطل قادم — قبل أيام أو أسابيع.\n\nهذه الميزة قيد التطوير ومستهدفة لعام 2026.",
    contact: "يمكنك التواصل معنا:\n📧 lbmtech000@gmail.com\n📞 658 660 553 213+\n📍 سطيف، الجزائر 🇩🇿\n\nنرد خلال 48 ساعة.",
    default: "شكراً على رسالتك! للحصول على إجابة مخصصة، استخدم نموذج التواصل أو راسلنا على contact@lbm-tech.dz.\n\nهل تريد معرفة المزيد عن مرحلتنا الحالية أو حلولنا أو رؤيتنا لأفريقيا؟"
  }
};

function getBotResponse(msg) {
  const lower = msg.toLowerCase();
  const lang = currentLang;
  const r = botResponses[lang];

  if (lower.includes('stage') || lower.includes('year') || lower.includes('founded') || lower.includes('early') || lower.includes('مرحلة') || lower.includes('سنة') || lower.includes('تأسيس')) return r.stage;
  if (lower.includes('vision') || lower.includes('africa') || lower.includes('expand') || lower.includes('رؤية') || lower.includes('أفريقيا') || lower.includes('توسع')) return r.vision;
  if (lower.includes('partner') || lower.includes('invest') || lower.includes('pilot') || lower.includes('شراكة') || lower.includes('استثمار') || lower.includes('تجريبي')) return r.partner;
  if (lower.includes('predict') || lower.includes('maintenance') || lower.includes('تنبؤ') || lower.includes('صيانة')) return r.predictive;
  if (lower.includes('service') || lower.includes('offer') || lower.includes('solution') || lower.includes('iot') || lower.includes('خدم') || lower.includes('حلول')) return r.services;
  if (lower.includes('contact') || lower.includes('email') || lower.includes('reach') || lower.includes('تواصل') || lower.includes('بريد')) return r.contact;
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('مرحب') || lower.includes('أهل') || lower.includes('السلام')) return r.greeting[Math.floor(Math.random()*2)];
  return r.default;
}

function addMessage(text, isUser = false) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (isUser ? 'user' : 'bot');
  const p = document.createElement('p');
  p.style.whiteSpace = 'pre-line';
  p.textContent = text;
  div.appendChild(p);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot typing-indicator';
  div.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  
  // Remove quick buttons
  const quickBtns = document.getElementById('quickBtns');
  if (quickBtns) quickBtns.remove();
  
  addMessage(msg, true);
  input.value = '';
  
  const typingEl = showTyping();
  
  setTimeout(() => {
    typingEl.remove();
    const response = getBotResponse(msg);
    addMessage(response, false);
  }, 800 + Math.random() * 700);
}

function quickMsg(msg) {
  const input = document.getElementById('chatInput');
  input.value = msg;
  sendChat();
}

// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(0, 212, 255, ${Math.random() * 0.4 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(p);
  }
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

function initAnimations() {
  const animElements = document.querySelectorAll('.service-card, .project-card, .about-stat, .faq-item, .contact-item');
  animElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    observer.observe(el);
  });
}

// ===== PITCH ACCESS (password: lbm2025) =====
// To change the password, edit the string 'lbm2025' below
const PITCH_CODE = 'lbm2025';

function checkPitchAccess(e) {
  e.preventDefault();
  const modal = document.getElementById('pitchModal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('pitchPassword')?.focus(), 100);
  }
  return false;
}

function submitPitch() {
  const input = document.getElementById('pitchPassword');
  const error = document.getElementById('pitchError');
  if (!input) return;
  if (input.value.trim() === PITCH_CODE) {
    closePitchModal();
    window.location.href = 'pitch.html';
  } else {
    input.value = '';
    input.style.borderColor = '#ef4444';
    if (error) error.style.display = 'block';
    setTimeout(() => {
      input.style.borderColor = '';
    }, 2000);
  }
}

function closePitchModal() {
  const modal = document.getElementById('pitchModal');
  if (modal) modal.style.display = 'none';
  const input = document.getElementById('pitchPassword');
  if (input) input.value = '';
  const error = document.getElementById('pitchError');
  if (error) error.style.display = 'none';
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('pitchModal');
  if (e.target === modal) closePitchModal();
});

// ===== NEWSLETTER =====
function subscribeNewsletter() {
  const el = document.getElementById('nlEmail');
  if (!el) return;
  const email = el.value.trim();
  if (!email || !email.includes('@')) {
    el.style.borderColor = '#ef4444';
    setTimeout(() => el.style.borderColor = '', 2000);
    return;
  }
  const msg = document.getElementById('nlSuccess');
  if (msg) {
    msg.style.display = 'block';
    msg.textContent = currentLang === 'ar'
      ? '✓ تم الاشتراك! أهلاً بك في مجتمع LBM.'
      : '✓ Subscribed! Welcome to the LBM community.';
  }
  el.value = '';
  setTimeout(() => { if (msg) msg.style.display = 'none'; }, 5000);
}

// ===== LIVE DASHBOARD =====
function updateDashboard() {
  const t = document.getElementById('demoTime');
  if (t) t.textContent = new Date().toLocaleTimeString('en-GB');

  // Gently animate KPI values
  const fluctuate = (base, range) => (base + (Math.random() - 0.5) * range).toFixed(1);
  const s = document.getElementById('kpiSalinity');
  const f = document.getElementById('kpiFlow');
  const p = document.getElementById('kpiPH');
  const e = document.getElementById('kpiEnergy');
  if (s) s.textContent = fluctuate(1.2, 0.3);
  if (f) f.textContent = fluctuate(78.4, 4);
  if (p) p.textContent = fluctuate(7.2, 0.2);
  if (e) e.textContent = Math.round(142 + (Math.random()-0.5)*10);
}
setInterval(updateDashboard, 2000);

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  createParticles();
  initAnimations();

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.pageYOffset >= s.offsetTop - 100) current = s.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
    });
  });
});