//eventlistener
//for everyitem we will need dropdown/accordian
//  if open
//    add to height
//  else-closed
//    subtract height
document.addEventListener('DOMContentLoaded', function () {
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const content = item.querySelector('.accordion-content');

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0";
      }
    });
  });
});
