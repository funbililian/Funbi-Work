document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');
 
  faqItems.forEach(function (item) {
    const button = item.querySelector('.faq-question');
 
    button.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
 
      // Close all open items
      faqItems.forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
 
      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
});