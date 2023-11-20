function clearSelection() {
  document.querySelectorAll(".circle, .choice").forEach((element) => {
    element.remove();
  });
}

export { clearSelection };
