// ============================================
// DADOS E CONFIGURAÇÃO INICIAL
// ============================================

// Treinos pré-definidos
const TREINOS = {
    A: {
        nome: 'Treino A - Peito e Tríceps',
        exercicios: [
            { nome: 'Supino Reto', series: '4x8-10' },
            { nome: 'Supino Inclinado', series: '3x10-12' },
            { nome: 'Crucifixo', series: '3x12-15' },
            { nome: 'Tríceps Pulley', series: '4x10-12' },
            { nome: 'Tríceps Testa', series: '3x10-12' },
            { nome: 'Tríceps Francês', series: '3x12-15' }
        ]
    },
    B: {
        nome: 'Treino B - Costas e Bíceps',
        exercicios: [
            { nome: 'Barra Fixa', series: '4x8-10' },
            { nome: 'Remada Curvada', series: '4x8-10' },
            { nome: 'Puxada Frontal', series: '3x10-12' },
            { nome: 'Rosca Direta', series: '4x10-12' },
            { nome: 'Rosca Martelo', series: '3x10-12' },
            { nome: 'Rosca Concentrada', series: '3x12-15' }
        ]
    },
    C: {
        nome: 'Treino C - Pernas e Glúteos',
        exercicios: [
            { nome: 'Agachamento Livre', series: '4x8-10' },
            { nome: 'Leg Press', series: '4x10-12' },
            { nome: 'Extensora', series: '3x12-15' },
            { nome: 'Flexora', series: '3x10-12' },
            { nome: 'Panturrilha em Pé', series: '4x15-20' },
            { nome: 'Panturrilha Sentado', series: '3x15-20' }
        ]
    },
    D: {
        nome: 'Treino D - Ombros e Trapézio',
        exercicios: [
            { nome: 'Desenvolvimento', series: '4x8-10' },
            { nome: 'Elevação Lateral', series: '3x12-15' },
            { nome: 'Elevação Frontal', series: '3x12-15' },
            { nome: 'Crucifixo Invertido', series: '3x12-15' },
            { nome: 'Encolhimento', series: '4x10-12' },
            { nome: 'Remada Alta', series: '3x10-12' }
        ]
    }
};

// ============================================
// GERENCIAMENTO DE DADOS (LocalStorage)
// ============================================

class TreinoManager {
    constructor() {
        this.loadData();
    }

    loadData() {
        // Data inicial
        const dataInicial = localStorage.getItem('dataInicial');
        if (dataInicial) {
            this.dataInicial = new Date(dataInicial);
        }

        // Treino atual
        this.treinoAtual = localStorage.getItem('treinoAtual') || 'A';

        // Histórico de treinos
        const historicoStr = localStorage.getItem('historicoTreinos');
        this.historicoTreinos = historicoStr ? JSON.parse(historicoStr) : [];

        // Exercícios concluídos do dia
        const exerciciosHojeStr = localStorage.getItem('exerciciosHoje');
        this.exerciciosHoje = exerciciosHojeStr ? JSON.parse(exerciciosHojeStr) : {};

        // Verificar se é um novo dia
        this.verificarNovoDia();
    }

    verificarNovoDia() {
        const hoje = this.getDataHoje();
        const ultimaDataStr = localStorage.getItem('ultimaData');
        
        if (ultimaDataStr !== hoje) {
            // Novo dia - limpar exercícios do dia anterior
            this.exerciciosHoje = {};
            localStorage.setItem('exerciciosHoje', JSON.stringify(this.exerciciosHoje));
            localStorage.setItem('ultimaData', hoje);
        }
    }

    salvarDataInicial(data) {
        this.dataInicial = new Date(data);
        localStorage.setItem('dataInicial', data);
    }

    salvarTreinoAtual(treino) {
        this.treinoAtual = treino;
        localStorage.setItem('treinoAtual', treino);
    }

    marcarExercicioConcluido(treino, exercicioIndex, concluido) {
        const key = `${treino}-${exercicioIndex}`;
        if (concluido) {
            this.exerciciosHoje[key] = true;
        } else {
            delete this.exerciciosHoje[key];
        }
        localStorage.setItem('exerciciosHoje', JSON.stringify(this.exerciciosHoje));
    }

    exercicioEstaConcluido(treino, exercicioIndex) {
        const key = `${treino}-${exercicioIndex}`;
        return this.exerciciosHoje[key] === true;
    }

    todosExerciciosConcluidos(treino) {
        const exercicios = TREINOS[treino].exercicios;
        return exercicios.every((_, index) => this.exercicioEstaConcluido(treino, index));
    }

    concluirTreino(treino) {
        const hoje = this.getDataHoje();
        
        // Verificar se já concluiu treino hoje
        const treinoHoje = this.historicoTreinos.find(t => t.data === hoje);
        if (treinoHoje) {
            return false; // Já concluiu treino hoje
        }

        // Adicionar ao histórico
        this.historicoTreinos.push({
            data: hoje,
            treino: treino,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('historicoTreinos', JSON.stringify(this.historicoTreinos));

        // Limpar exercícios do dia
        this.exerciciosHoje = {};
        localStorage.setItem('exerciciosHoje', JSON.stringify(this.exerciciosHoje));

        // Determinar próximo treino (sequência A -> B -> C -> D -> A...)
        const sequencia = ['A', 'B', 'C', 'D'];
        const indexAtual = sequencia.indexOf(treino);
        const proximoTreino = sequencia[(indexAtual + 1) % sequencia.length];
        this.salvarTreinoAtual(proximoTreino);

        return true;
    }

    getDataHoje() {
        const hoje = new Date();
        return hoje.toISOString().split('T')[0];
    }

    getDiasDecorridos() {
        if (!this.dataInicial) return 0;
        const hoje = new Date();
        const diffTime = hoje - this.dataInicial;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    getUltimoTreino() {
        if (this.historicoTreinos.length === 0) return null;
        return this.historicoTreinos[this.historicoTreinos.length - 1];
    }

    treinoFoiRealizado(data) {
        return this.historicoTreinos.some(t => t.data === data);
    }

    getTreinosMes(ano, mes) {
        return this.historicoTreinos.filter(t => {
            const dataTreino = new Date(t.data);
            return dataTreino.getFullYear() === ano && dataTreino.getMonth() === mes;
        });
    }

    getTreinosSemana() {
        const hoje = new Date();
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        return this.historicoTreinos.filter(t => {
            const dataTreino = new Date(t.data);
            return dataTreino >= inicioSemana && dataTreino <= fimSemana;
        });
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

const treinoManager = new TreinoManager();

// ============================================
// INTERFACE - NAVEGAÇÃO DE TABS
// ============================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Atualizar botões
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Atualizar conteúdo
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tab).classList.add('active');

        // Atualizar conteúdo específico da tab
        if (tab === 'treino') {
            atualizarTelaTreino();
        } else if (tab === 'historico') {
            atualizarHistorico();
        }
    });
});

// ============================================
// DASHBOARD
// ============================================

// Data Inicial
const dataInicialInput = document.getElementById('dataInicial');
const salvarDataBtn = document.getElementById('salvarDataInicial');
const dataInicialExibida = document.getElementById('dataInicialExibida');

if (treinoManager.dataInicial) {
    const dataFormatada = treinoManager.dataInicial.toISOString().split('T')[0];
    dataInicialInput.value = dataFormatada;
    atualizarDataExibida();
}

salvarDataBtn.addEventListener('click', () => {
    const data = dataInicialInput.value;
    if (data) {
        treinoManager.salvarDataInicial(data);
        atualizarDataExibida();
        atualizarContadorDias();
        atualizarHistorico();
    }
});

function atualizarDataExibida() {
    if (treinoManager.dataInicial) {
        const dataFormatada = treinoManager.dataInicial.toLocaleDateString('pt-BR');
        dataInicialExibida.textContent = `Iniciado em: ${dataFormatada}`;
    }
}

// Contador de Dias
const diasDecorridosEl = document.getElementById('diasDecorridos');

function atualizarContadorDias() {
    const dias = treinoManager.getDiasDecorridos();
    diasDecorridosEl.textContent = dias;
}

// Seleção de Treino
document.querySelectorAll('.treino-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const treino = btn.dataset.treino;
        
        // Atualizar botões
        document.querySelectorAll('.treino-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Salvar treino atual
        treinoManager.salvarTreinoAtual(treino);
        
        // Atualizar exibição
        atualizarTreinoAtual();
        
        // Se estiver na tab de treino, atualizar
        if (document.getElementById('treino').classList.contains('active')) {
            atualizarTelaTreino();
        }
    });
});

function atualizarTreinoAtual() {
    const treinoBadge = document.getElementById('treinoBadge');
    const treino = treinoManager.treinoAtual;
    treinoBadge.textContent = `Treino ${treino}`;
    
    // Marcar botão ativo
    document.querySelectorAll('.treino-btn').forEach(btn => {
        if (btn.dataset.treino === treino) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Mostrar último treino
    const ultimoTreino = treinoManager.getUltimoTreino();
    const ultimoTreinoEl = document.getElementById('ultimoTreino');
    if (ultimoTreino) {
        const dataFormatada = new Date(ultimoTreino.data).toLocaleDateString('pt-BR');
        ultimoTreinoEl.textContent = `Último treino: ${ultimoTreino.treino} em ${dataFormatada}`;
    } else {
        ultimoTreinoEl.textContent = 'Nenhum treino realizado ainda';
    }
}

// Botão Treino Concluído
const treinoConcluidoBtn = document.getElementById('treinoConcluidoBtn');
const btnHint = document.getElementById('btnHint');

treinoConcluidoBtn.addEventListener('click', () => {
    const treino = treinoManager.treinoAtual;
    
    if (!treinoManager.todosExerciciosConcluidos(treino)) {
        alert('Complete todos os exercícios antes de concluir o treino!');
        return;
    }

    const sucesso = treinoManager.concluirTreino(treino);
    
    if (sucesso) {
        alert(`Treino ${treino} concluído com sucesso! 🎉`);
        atualizarTelaTreino();
        atualizarTreinoAtual();
        atualizarHistorico();
        atualizarBotaoConcluir();
    } else {
        alert('Você já concluiu um treino hoje!');
    }
});

function atualizarBotaoConcluir() {
    const treino = treinoManager.treinoAtual;
    const todosConcluidos = treinoManager.todosExerciciosConcluidos(treino);
    
    treinoConcluidoBtn.disabled = !todosConcluidos;
    
    if (todosConcluidos) {
        btnHint.textContent = 'Clique para concluir o treino';
    } else {
        const exercicios = TREINOS[treino].exercicios;
        const concluidos = exercicios.filter((_, index) => 
            treinoManager.exercicioEstaConcluido(treino, index)
        ).length;
        btnHint.textContent = `${concluidos}/${exercicios.length} exercícios concluídos`;
    }
}

// ============================================
// TELA DE TREINO
// ============================================

function atualizarTelaTreino() {
    const treino = treinoManager.treinoAtual;
    const treinoData = TREINOS[treino];
    
    // Atualizar header
    document.getElementById('treinoNomeHeader').textContent = treinoData.nome;
    
    // Limpar lista
    const exerciciosList = document.getElementById('exerciciosList');
    exerciciosList.innerHTML = '';
    
    // Criar exercícios
    treinoData.exercicios.forEach((exercicio, index) => {
        const concluido = treinoManager.exercicioEstaConcluido(treino, index);
        
        const exercicioItem = document.createElement('div');
        exercicioItem.className = `exercicio-item ${concluido ? 'concluido' : ''}`;
        
        exercicioItem.innerHTML = `
            <input type="checkbox" 
                   class="exercicio-checkbox" 
                   ${concluido ? 'checked' : ''}
                   data-treino="${treino}"
                   data-index="${index}">
            <div class="exercicio-info">
                <div class="exercicio-nome">${exercicio.nome}</div>
                <div class="exercicio-series">${exercicio.series}</div>
            </div>
        `;
        
        exerciciosList.appendChild(exercicioItem);
    });
    
    // Adicionar event listeners
    document.querySelectorAll('.exercicio-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const treino = e.target.dataset.treino;
            const index = parseInt(e.target.dataset.index);
            const concluido = e.target.checked;
            
            treinoManager.marcarExercicioConcluido(treino, index, concluido);
            
            // Atualizar visual
            const exercicioItem = e.target.closest('.exercicio-item');
            if (concluido) {
                exercicioItem.classList.add('concluido');
            } else {
                exercicioItem.classList.remove('concluido');
            }
            
            atualizarProgresso();
            atualizarBotaoConcluir();
        });
    });
    
    atualizarProgresso();
    atualizarBotaoConcluir();
}

function atualizarProgresso() {
    const treino = treinoManager.treinoAtual;
    const exercicios = TREINOS[treino].exercicios;
    const concluidos = exercicios.filter((_, index) => 
        treinoManager.exercicioEstaConcluido(treino, index)
    ).length;
    
    const porcentagem = (concluidos / exercicios.length) * 100;
    
    document.getElementById('progressBar').style.width = `${porcentagem}%`;
    document.getElementById('progressText').textContent = `${Math.round(porcentagem)}%`;
}

// ============================================
// HISTÓRICO
// ============================================

let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

function atualizarHistorico() {
    atualizarCalendarioSemanal();
    atualizarCalendarioMensal();
    atualizarEstatisticas();
}

function atualizarCalendarioSemanal() {
    const calendarioSemanal = document.getElementById('calendarioSemanal');
    calendarioSemanal.innerHTML = '';
    
    const hoje = new Date();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 0; i < 7; i++) {
        const data = new Date(inicioSemana);
        data.setDate(inicioSemana.getDate() + i);
        
        const dataStr = data.toISOString().split('T')[0];
        const treinoRealizado = treinoManager.treinoFoiRealizado(dataStr);
        const eHoje = dataStr === treinoManager.getDataHoje();
        
        const diaEl = document.createElement('div');
        diaEl.className = `dia-semana ${treinoRealizado ? 'verde' : (eHoje ? 'cinza' : 'vermelho')}`;
        
        diaEl.innerHTML = `
            <div class="dia-nome">${diasSemana[i]}</div>
            <div class="dia-numero">${data.getDate()}</div>
        `;
        
        calendarioSemanal.appendChild(diaEl);
    }
}

function atualizarCalendarioMensal() {
    const calendarioMensal = document.getElementById('calendarioMensal');
    calendarioMensal.innerHTML = '';
    
    // Atualizar título do mês
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('mesAtual').textContent = `${meses[mesAtual]} ${anoAtual}`;
    
    // Primeiro dia do mês
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    
    // Dia da semana do primeiro dia (0 = domingo)
    const diaSemanaInicio = primeiroDia.getDay();
    
    // Adicionar dias vazios antes do primeiro dia
    for (let i = 0; i < diaSemanaInicio; i++) {
        const diaVazio = document.createElement('div');
        diaVazio.className = 'dia-mes cinza';
        calendarioMensal.appendChild(diaVazio);
    }
    
    // Adicionar dias do mês
    const hoje = new Date();
    const hojeStr = treinoManager.getDataHoje();
    
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const data = new Date(anoAtual, mesAtual, dia);
        const dataStr = data.toISOString().split('T')[0];
        const treinoRealizado = treinoManager.treinoFoiRealizado(dataStr);
        const eHoje = dataStr === hojeStr;
        const eMesPassado = data.getMonth() !== mesAtual;
        
        const diaEl = document.createElement('div');
        diaEl.className = `dia-mes ${eMesPassado ? 'cinza' : (treinoRealizado ? 'verde' : 'vermelho')} ${eHoje ? 'hoje' : ''}`;
        diaEl.textContent = dia;
        
        calendarioMensal.appendChild(diaEl);
    }
}

// Navegação de mês
document.getElementById('mesAnterior').addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }
    atualizarCalendarioMensal();
});

document.getElementById('mesProximo').addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    atualizarCalendarioMensal();
});

function atualizarEstatisticas() {
    // Treinos do mês
    const treinosMes = treinoManager.getTreinosMes(anoAtual, mesAtual);
    document.getElementById('treinosMes').textContent = treinosMes.length;
    
    // Consistência semanal
    const treinosSemana = treinoManager.getTreinosSemana();
    const consistenciaSemana = Math.round((treinosSemana.length / 7) * 100);
    document.getElementById('consistenciaSemana').textContent = `${consistenciaSemana}%`;
    
    // Sequência atual
    let sequencia = 0;
    const hoje = new Date();
    for (let i = 0; i < 30; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() - i);
        const dataStr = data.toISOString().split('T')[0];
        if (treinoManager.treinoFoiRealizado(dataStr)) {
            sequencia++;
        } else {
            break;
        }
    }
    document.getElementById('sequenciaAtual').textContent = sequencia;
}

// ============================================
// INICIALIZAÇÃO AO CARREGAR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorDias();
    atualizarTreinoAtual();
    atualizarTelaTreino();
    atualizarHistorico();
    
    // Atualizar contador diariamente
    setInterval(() => {
        treinoManager.verificarNovoDia();
        atualizarContadorDias();
        atualizarTelaTreino();
        atualizarHistorico();
    }, 60000); // Verificar a cada minuto
});
