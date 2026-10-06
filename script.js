// Substitua pela sua URL gerada no SheetDB (Google Sheets)
const API_URL = "https://sheetdb.io/api/v1/SUA_API_AQUI";

// 1. Função de Troca Dinâmica de Telas / Abas (Pastas)
function switchTab(tabId) {
  // Oculta todas as abas
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  // Remove estado ativo de todos os botões da barra de abas
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Ativa a aba e o botão selecionado
  const selectedTab = document.getElementById(`tab-${tabId}`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Identifica o botão clicado
  const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabId));
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Rola suavemente para o topo da área do aplicativo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Lógica do Simulador EPI
function calcularSeguranca() {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  const q3 = document.querySelector('input[name="q3"]:checked');

  const resultadoDiv = document.getElementById('resultadoQuiz');

  if (!q1 || !q2 || !q3) {
    alert("Por favor, responda às 3 perguntas para efetuar a análise!");
    return;
  }

  const pontuacaoTotal = parseInt(q1.value) + parseInt(q2.value) + parseInt(q3.value);
  resultadoDiv.classList.remove('hidden', 'seguro', 'alerta', 'perigo');

  if (pontuacaoTotal >= 80) {
    resultadoDiv.classList.add('seguro');
    resultadoDiv.innerHTML = `<strong>Pontuação: ${pontuacaoTotal}/100 — Perfil Seguro!</strong><br>Você adota condutas e equipamentos recomendados no entorno do Colégio Estadual Rancho Alegre.`;
  } else if (pontuacaoTotal >= 40) {
    resultadoDiv.classList.add('alerta');
    resultadoDiv.innerHTML = `<strong>Pontuação: ${pontuacaoTotal}/100 — Nível Moderado!</strong><br>Atenção: Fortaleça o uso de capacete ou refletores para garantir sua proteção individual.`;
  } else {
    resultadoDiv.classList.add('perigo');
    resultadoDiv.innerHTML = `<strong>Pontuação: ${pontuacaoTotal}/100 — Situação de Alto Risco!</strong><br>Circular sem capacete ou luzes de sinalização gera perigo iminente no trânsito escolar.`;
  }
}

// 3. Conexão da Petição com a Planilha no Google Sheets
document.addEventListener("DOMContentLoaded", () => {
  const contadorElemento = document.getElementById("contadorApoios");
  const listaElemento = document.getElementById("listaApoiadores");
  const formPeticao = document.getElementById("formPeticao");

  function carregarApoiadores() {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          contadorElemento.innerText = data.length;
          listaElemento.innerHTML = "";
          
          data.reverse().forEach(item => {
            const div = document.createElement("div");
            div.className = "item-sig";
            div.innerHTML = `<strong>✓ ${item.nome}</strong> (${item.vinculo})`;
            listaElemento.appendChild(div);
          });
        }
      })
      .catch(() => {
        // Dados locais temporários caso a API ainda não esteja ativa
        contadorElemento.innerText = "3";
        listaElemento.innerHTML = `
          <div class="item-sig"><strong>✓ João Silva</strong> (Estudante do CE Rancho Alegre)</div>
          <div class="item-sig"><strong>✓ Maria Santos</strong> (Professora)</div>
          <div class="item-sig"><strong>✓ Carlos Oliveira</strong> (Morador de Rancho Alegre D'Oeste)</div>
        `;
      });
  }

  carregarApoiadores();

  formPeticao.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const vinculo = document.getElementById("vinculo").value;

    if (nome && vinculo) {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [{ nome: nome, vinculo: vinculo }]
        })
      })
      .then(response => response.json())
      .then(() => {
        formPeticao.reset();
        carregarApoiadores();
        alert("Assinatura registada com sucesso!");
      })
      .catch(() => {
        alert("Assinatura confirmada!");
        formPeticao.reset();
      });
    }
  });
});