document.addEventListener('DOMContentLoaded', () => {
    const scorecardForm = document.getElementById('scorecardForm');
    const totalQuestions = 35;
    const maximumPossibleScore = totalQuestions * 5;
    const totalPossibleDealKillers = totalQuestions;
    const batteryFill = document.getElementById('battery-fill');
    const pursuitValueText = document.getElementById('pursuit-value-text');

    const groups = {
        'prospect-info': {
            questions: Array.from({ length: 12 }, (_, i) => `q${i + 1}`),
            maxScore: 12 * 5
        },
        'internal-info': {
            questions: Array.from({ length: 15 }, (_, i) => `q${i + 13}`),
            maxScore: 15 * 5
        },
        'market-info': {
            questions: Array.from({ length: 8 }, (_, i) => `q${i + 28}`),
            maxScore: 8 * 5
        }
    };

    scorecardForm.addEventListener('change', calculateMetrics);

    function calculateMetrics() {
        let totalScore = 0;
        let scoresRated1 = 0;
        let unkRatedCount = 0;
        let dealKillerPresent = false;
        let dealKillerCount = 0;

        for (const group in groups) {
            let groupScore = 0;
            groups[group].questions.forEach(q => {
                const scoreElement = document.querySelector(`input[name="${q}_score"]:checked`);
                const killerElement = document.querySelector(`input[name="${q}_killer"]`);

                if (scoreElement) {
                    const scoreValue = scoreElement.value;
                    groupScore += parseInt(scoreValue);
                    totalScore += parseInt(scoreValue);

                    if (scoreValue === '1') {
                        scoresRated1++;
                    } else if (scoreValue === '0') {
                        unkRatedCount++;
                    }
                }

                if (killerElement && killerElement.checked) {
                    dealKillerPresent = true;
                    dealKillerCount++;
                }
            });
            document.getElementById(`${group.split('-')[0]}-score`).innerText = groupScore;
        }

        const pursuitValue = (totalScore / maximumPossibleScore) * 100;
        const dealKillerRisk = (dealKillerCount / totalPossibleDealKillers) * 100;
        const pursuitValueRounded = pursuitValue.toFixed(1);

        // Update the display for overall totals
        document.getElementById('total-score').innerText = totalScore;
        document.getElementById('score-1-count').innerText = scoresRated1;
        document.getElementById('unk-count').innerText = unkRatedCount;
        document.getElementById('deal-killer-count').innerText = dealKillerCount;
        document.getElementById('deal-killer-risk-score').innerText = `${dealKillerRisk.toFixed(1)}%`;

        const warningDiv = document.getElementById('deal-killer-warning');
        if (dealKillerPresent) {
            warningDiv.style.display = 'block';
        } else {
            warningDiv.style.display = 'none';
        }

        // --- Corrected Battery Logic ---
        batteryFill.style.height = `${pursuitValue}%`;

        let textColor = '';
        let batteryColor = '';

        if (pursuitValue <= 25) {
            batteryColor = 'red';
            textColor = 'white';
        } else if (pursuitValue <= 50) {
            batteryColor = '#FFC107'; // Yellow
            textColor = '#002060';
        } else if (pursuitValue <= 75) {
            batteryColor = '#28a745'; // Green
            textColor = 'white';
        } else {
            batteryColor = '#0070C0'; // Blue
            textColor = 'white';
        }

        batteryFill.style.backgroundColor = batteryColor;
        pursuitValueText.innerText = `${pursuitValueRounded}%`;
        pursuitValueText.style.color = textColor;
        // --- End Corrected Battery Logic ---
    }
});