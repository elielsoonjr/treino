# 💪 APP TREINO - Acompanhamento de Musculação

Site moderno e funcional para acompanhamento de treinos de musculação, focado em **consistência, clareza e motivação**.

## 🎯 Funcionalidades

### ✅ Dashboard Principal
- **Data Inicial do Treino**: Configure quando começou seu ciclo de treino
- **Contador de Dias**: Visualize quantos dias já passaram desde o início
- **Treino do Dia**: Selecione e visualize qual treino deve ser executado
- **Botão Treino Concluído**: Registre a conclusão do treino (só ativa quando todos os exercícios estão marcados)

### ✅ Tela de Treino
- **Checklist Interativo**: Marque cada exercício conforme executa
- **Progresso Visual**: Barra de progresso mostra quantos exercícios foram concluídos
- **Feedback Visual**: Exercícios concluídos ficam riscados e com opacidade reduzida
- **4 Treinos Pré-configurados**:
  - Treino A: Peito e Tríceps
  - Treino B: Costas e Bíceps
  - Treino C: Pernas e Glúteos
  - Treino D: Ombros e Trapézio

### ✅ Histórico e Consistência
- **Calendário Semanal**: Visualize os últimos 7 dias
- **Calendário Mensal**: Acompanhe todo o mês
- **Código de Cores**:
  - 🟢 Verde: Treino realizado
  - 🔴 Vermelho: Sem treino
- **Estatísticas**:
  - Treinos realizados no mês
  - Consistência semanal (%)
  - Sequência atual de dias consecutivos

## 🎨 Design

- **Estilo Premium**: Visual moderno inspirado em academias premium
- **Paleta de Cores**:
  - Preto/Cinza escuro (base)
  - Verde neon (progresso/sucesso)
  - Vermelho forte (falha/ausência)
- **Microinterações**: Animações suaves e feedback visual em todas as ações
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** no seu navegador
2. **Configure a Data Inicial**: No dashboard, selecione quando começou seu ciclo de treino
3. **Selecione o Treino do Dia**: Escolha entre Treino A, B, C ou D
4. **Execute o Treino**: Vá para a aba "Treino" e marque cada exercício conforme executa
5. **Conclua o Treino**: Quando todos os exercícios estiverem marcados, clique em "Treino Concluído"
6. **Acompanhe o Progresso**: Use a aba "Histórico" para ver sua consistência

## 📋 Regras de Negócio

- ✅ Um treino só pode ser marcado como concluído **uma vez por dia**
- ✅ Se nenhum treino for concluído no dia, o calendário marca automaticamente como vermelho
- ✅ O último treino feito define o próximo treino sugerido (sequência A → B → C → D → A...)
- ✅ Checklists reiniciam diariamente
- ✅ Todos os dados são salvos no **LocalStorage** do navegador

## 🛠️ Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Design moderno com gradientes, animações e responsividade
- **JavaScript Vanilla**: Lógica completa sem dependências externas
- **LocalStorage**: Persistência de dados no navegador

## 📁 Estrutura de Arquivos

```
.
├── index.html      # Estrutura HTML principal
├── styles.css      # Estilos premium e responsivos
├── script.js       # Lógica completa do aplicativo
└── README.md       # Documentação
```

## 🔮 Evoluções Futuras

- [ ] Autenticação de usuário
- [ ] Backup em nuvem
- [ ] Estatísticas avançadas (gráficos, progressão de cargas)
- [ ] Versão mobile (PWA)
- [ ] Personalização de treinos
- [ ] Exportação de dados

## 💡 Dicas

- Configure a data inicial assim que começar um novo ciclo
- Use o calendário para identificar padrões de treino
- Mantenha a sequência para melhor progressão
- O sistema mostra claramente quando você falhou - use isso como motivação!

---

**Treino não é opinião. É execução.** 💪
