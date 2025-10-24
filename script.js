const botoes = document.querySelectorAll('button');

botoes.forEach((botao) => {
  // Hover via mouse
  botao.addEventListener('mouseenter', () => {
    botao.classList.add('hover');
  });
  botao.addEventListener('mouseleave', () => {
    botao.classList.remove('hover');
  });

  // Hover via toque para mobile
  botao.addEventListener('touchstart', () => {
    botao.classList.add('hover');
  });
  botao.addEventListener('touchend', () => {
    botao.classList.remove('hover');
  });
});
