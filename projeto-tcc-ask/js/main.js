const perguntas = [
    {
        texto: "Qual o estágio atual do seu negócio?",
        opcoes: [
            { texto: "Estou começando agora, vendendo para amigos.", valor: 1 },
            { texto: "Já vendo, mas quero organizar e crescer.", valor: 2 },
            { texto: "Quero escalar e dominar meu nicho.", valor: 3 }
        ]
    },
    {
        texto: "Como é sua presença digital hoje?",
        opcoes: [
            { texto: "Tenho apenas um perfil pessoal ou parado.", valor: 1 },
            { texto: "Posto às vezes, mas sem estratégia.", valor: 2 },
            { texto: "Já faço anúncios, mas o ROI é baixo.", valor: 3 }
        ]
    },
    {
        texto: "Qual seu orçamento aproximado para investir?",
        opcoes: [
            { texto: "Entre R$ 300 e R$ 500.", valor: 1 },
            { texto: "Entre R$ 600 e R$ 800.", valor: 2 },
            { texto: "Acima de R$ 900.", valor: 3 }
        ]
    }
];

let indiceAtual = 0;
let pontuacao = 0;

window.onload = () => {
    iniciarAnimacoesScroll();

    if(document.getElementById('quiz-container')) {
        mostrarPergunta();
        
        const inputInvest = document.getElementById('investimentoInput');
        if(inputInvest) {
            inputInvest.addEventListener('input', function() {
                calcularROI(this.value);
            });
        }
    }
};

function iniciarAnimacoesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-up').forEach((el) => observer.observe(el));
}

function mostrarPergunta() {
    let progresso = ((indiceAtual) / perguntas.length) * 100;
    const bar = document.getElementById('progress');
    if(bar) bar.style.width = progresso + "%";

    if (indiceAtual < perguntas.length) {
        const titulo = document.getElementById('pergunta-titulo');
        if(titulo) titulo.innerText = perguntas[indiceAtual].texto;
        
        let container = document.getElementById('opcoes-container');
        if(container) {
            container.innerHTML = ""; 
            perguntas[indiceAtual].opcoes.forEach(opcao => {
                let btn = document.createElement('button');
                btn.innerText = opcao.texto;
                btn.onclick = () => responder(opcao.valor);
                container.appendChild(btn);
            });
        }
    } else {
        finalizarQuiz();
    }
}

function responder(valor) {
    pontuacao += valor;
    indiceAtual++;
    mostrarPergunta();
}

function finalizarQuiz() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';

    let planoIdeal = "";
    if (pontuacao <= 4) planoIdeal = "basico";
    else if (pontuacao <= 7) planoIdeal = "intermed";
    else planoIdeal = "premium";

    destacarPlano(planoIdeal);
}

function destacarPlano(plano) {
    document.getElementById('badge-basico').className = "plan-badge";
    document.getElementById('badge-intermed').className = "plan-badge";
    document.getElementById('badge-premium').className = "plan-badge";

    if (plano === 'basico') {
        document.getElementById('badge-basico').classList.add('highlight-green');
        selecionarPlanoFinal('basico');
    } else if (plano === 'intermed') {
        document.getElementById('badge-intermed').classList.add('highlight-orange');
        selecionarPlanoFinal('intermed');
    } else {
        document.getElementById('badge-premium').classList.add('highlight-blue');
        selecionarPlanoFinal('premium');
    }
}

function selecionarPlanoFinal(plano) {
    document.getElementById('roi-container').style.display = 'block';
    
    let valor = 0;
    if(plano === 'basico') valor = 350;
    if(plano === 'intermed') valor = 650;
    if(plano === 'premium') valor = 900;

    let inputEl = document.getElementById('investimentoInput');
    inputEl.value = valor;
    
    calcularROI(valor);
    
    setTimeout(() => {
        document.getElementById('roi-container').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function calcularROI(valorInput) {
    let investimentoMensal = parseFloat(valorInput);

    if (isNaN(investimentoMensal) || investimentoMensal < 0) {
        document.getElementById('roi-valor').innerText = "R$ 0,00";
        return;
    }

    let totalInvestido6Meses = investimentoMensal * 6;
    let lucroLiquidoEstimado = totalInvestido6Meses * 0.4166; 
    
    document.getElementById('roi-valor').innerText = lucroLiquidoEstimado.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});
    document.getElementById('roi-percent').innerText = "+41,66%";
}

/* WHATSAPP */
function enviarWhatsapp() {
    const numero = window.ASK_CONFIG ? window.ASK_CONFIG.WHATSAPP : ""; 

    let valor = document.getElementById('investimentoInput').value;
    let msg = `Olá! Fiz a simulação no site da ASK com um investimento de R$ ${valor} e gostaria de saber mais sobre a consultoria.`;

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, '_blank');
}