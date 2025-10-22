document.addEventListener('DOMContentLoaded', function() {

  /**
   * Calcula e exibe o tempo decorrido desde uma data e hora específicas.
   * O tempo é atualizado a cada segundo.
   */
  function calcularTempoDecorrido() {
    // IMPORTANTE: Altere esta data para a data de início da sua leitura.
    // Formato: 'YYYY-MM-DDTHH:MM:SS' (Ano-Mês-DiaTHora:Minuto:Segundo)
    const dataInicioLeitura = new Date('2025-10-22T15:30:00');

    const elementoTempo = document.getElementById('tempo-decorrido');

    if (!elementoTempo) {
      console.error('Elemento com id "tempo-decorrido" não foi encontrado.');
      return;
    }

    setInterval(() => {
      const agora = new Date();
      const diferenca = agora - dataInicioLeitura;

      // Se a data de início for no futuro, a diferença será negativa.
      if (diferenca < 0) {
        elementoTempo.textContent = "A leitura ainda não começou!";
        return;
      }

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

      elementoTempo.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }, 1000); // Atualiza a cada segundo
  }

  // Inicia a função
  calcularTempoDecorrido();

});
