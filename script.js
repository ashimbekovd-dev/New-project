/* ============================================================
   НАСТРОЙКИ — меняйте здесь, остальной код трогать не нужно
   ============================================================ */
const CONFIG = {
  // Номер для звонков (только цифры, с кодом страны)
  phone: "77058053269",
  // Номер WhatsApp (только цифры, с кодом страны)
  whatsapp: "77788522760",
};

// Реальные отзывы пациентов. Пока список пуст, блок «Отзывы» на сайте скрыт.
// Пример:
// { text: "Текст отзыва", name: "Айгуль", detail: "Расширенный чекап, март 2026" },
const REVIEWS = [];

/* ============================================================ */

const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : "");

// WhatsApp-ссылки
document.querySelectorAll(".js-wa").forEach((a) => {
  a.href = waLink(a.dataset.waText || "");
  a.target = "_blank";
  a.rel = "noopener";
});

// Телефон
document.querySelectorAll(".js-tel").forEach((a) => {
  a.href = `tel:+${CONFIG.phone}`;
});

// Мобильное меню
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Кнопки «Выбрать / Оформить» подставляют выбор в форму
const select = document.getElementById("requestSelect");
document.querySelectorAll(".js-pick").forEach((btn) =>
  btn.addEventListener("click", () => {
    const value = btn.dataset.pick;
    const option = [...select.options].find((o) => o.value === value || o.text === value);
    if (option) select.value = option.value;
  })
);

// Форма → сообщение в WhatsApp
const form = document.getElementById("leadForm");
const errorBox = document.getElementById("formError");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  let ok = true;
  ["name", "city", "request"].forEach((field) => {
    const el = form.elements[field];
    const empty = !String(data.get(field) || "").trim();
    el.setAttribute("aria-invalid", String(empty));
    if (empty) ok = false;
  });
  errorBox.hidden = ok;
  if (!ok) return;

  const lines = [
    "Здравствуйте! Заявка с сайта Arirang.",
    `Имя: ${data.get("name").trim()}`,
    `Город: ${data.get("city").trim()}`,
    `Интересует: ${data.get("request")}`,
  ];
  const comment = String(data.get("comment") || "").trim();
  if (comment) lines.push(`Комментарий: ${comment}`);

  window.open(waLink(lines.join("\n")), "_blank", "noopener");
});

// Отзывы
if (REVIEWS.length) {
  const list = document.getElementById("reviewsList");
  REVIEWS.forEach((r) => {
    const card = document.createElement("figure");
    card.className = "review";
    const quote = document.createElement("blockquote");
    quote.textContent = r.text;
    const cite = document.createElement("cite");
    cite.textContent = r.name;
    if (r.detail) {
      const span = document.createElement("span");
      span.textContent = r.detail;
      cite.appendChild(span);
    }
    card.append(quote, cite);
    list.appendChild(card);
  });
  document.getElementById("reviews").hidden = false;
}

document.getElementById("year").textContent = new Date().getFullYear();
