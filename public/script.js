// Objeto para armazenar respostas temporariamente
const respostas = {};

// Navegação entre perguntas
document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', () => {
        const currentQuestionId = button.closest('.question-card').id;
        const nextQuestionId = button.getAttribute('data-next');

        // Valida se uma opção foi selecionada
        const selectedOption = document.querySelector(`input[name="${currentQuestionId.replace('question-', 'q')}"]:checked`);
        if (!selectedOption) {
            alert('Selecione uma opção antes de continuar!');
            return;
        }

        // Salva a resposta no objeto - corrigido para usar r1, r2, r3 consistentemente
        const questionNumber = currentQuestionId.replace('question-', '');
        respostas[`r${questionNumber}`] = selectedOption.value;

        // Oculta a pergunta atual e mostra a próxima
        document.getElementById(currentQuestionId).style.display = 'none';
        document.getElementById(nextQuestionId).style.display = 'block';

        // Atualiza a barra de progresso
        updateProgressBar();
    });
});

// Botão "Anterior"
document.querySelectorAll('.prev-btn').forEach(button => {
    button.addEventListener('click', () => {
        const currentQuestionId = button.closest('.question-card').id;
        const prevQuestionId = button.getAttribute('data-prev');

        document.getElementById(currentQuestionId).style.display = 'none';
        document.getElementById(prevQuestionId).style.display = 'block';
        updateProgressBar();
    });
});

// Atualiza a barra de progresso
function updateProgressBar() {
    const totalQuestions = document.querySelectorAll('.question-card').length;
    const currentQuestion = document.querySelector('.question-card[style="display: block;"]').id;
    const currentQuestionNumber = parseInt(currentQuestion.replace('question-', ''));
    const progress = (currentQuestionNumber / totalQuestions) * 100;

    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

document.getElementById('submit-btn').addEventListener('click', async (event) => {
    // Desabilita o botão imediatamente
    const submitBtn = event.target;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Garante que a última resposta (q3) seja capturada como r3
    const lastQuestionId = document.querySelector('.question-card[style="display: block;"]').id;
    const lastQuestionNumber = lastQuestionId.replace('question-', '');
    const lastAnswer = document.querySelector(`input[name="q${lastQuestionNumber}"]:checked`).value;
    respostas[`r${lastQuestionNumber}`] = lastAnswer;

    // Verifica no console o que está sendo enviado
    console.log("Respostas a serem enviadas:", respostas);

    try {
        const response = await fetch('https://backend-odonto-f3e12de14a6f.herokuapp.com/respostas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                r1: respostas.r1,
                r2: respostas.r2,
                r3: respostas.r3
            })
        });

        if (response.ok) {
            document.getElementById('success-message').style.display = 'block';
            setTimeout(() => {
                window.location.href = 'obrigado.html';
            }, 2000);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao enviar respostas');
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(`Falha no envio: ${error.message}`);

        // Reabilita o botão em caso de erro
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Respostas';
    }
});