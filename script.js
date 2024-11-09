function generateMatrix() {
    const n = parseInt(document.getElementById('matrixSize').value);
    let html = '<div class="matrix">';
    
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            html += `<input type="number" class="matrix-cell" id="cell_${i}_${j}" value="0">`;
        }
        html += '<br>';
    }
    html += '</div>';
    document.getElementById('matrixInput').innerHTML = html;
}

function factorizeLDU() {
    const n = parseInt(document.getElementById('matrixSize').value);
    let A = [];
    let L = [];
    let D = [];
    let U = [];
    let steps = [];

    // Initialize matrices
    for(let i = 0; i < n; i++) {
        A[i] = [];
        L[i] = Array(n).fill(0);
        D[i] = Array(n).fill(0);
        U[i] = Array(n).fill(0);
        L[i][i] = 1;
        U[i][i] = 1;
        for(let j = 0; j < n; j++) {
            A[i][j] = parseFloat(document.getElementById(`cell_${i}_${j}`).value);
        }
    }

    steps.push({
        step: "Initial Matrix A:",
        matrix: JSON.parse(JSON.stringify(A))
    });

    // LDU Factorization
    for(let k = 0; k < n; k++) {
        D[k][k] = A[k][k];
        
        for(let i = k + 1; i < n; i++) {
            L[i][k] = A[i][k] / A[k][k];
            steps.push({
                step: `Computing L[${i}][${k}] = A[${i}][${k}]/A[${k}][${k}] = ${L[i][k]}`,
                L: JSON.parse(JSON.stringify(L))
            });
        }

        for(let j = k + 1; j < n; j++) {
            U[k][j] = A[k][j] / A[k][k];
            steps.push({
                step: `Computing U[${k}][${j}] = A[${k}][${j}]/A[${k}][${k}] = ${U[k][j]}`,
                U: JSON.parse(JSON.stringify(U))
            });
        }

        for(let i = k + 1; i < n; i++) {
            for(let j = k + 1; j < n; j++) {
                A[i][j] = A[i][j] - L[i][k] * D[k][k] * U[k][j];
            }
        }
    }

    // Display results
    let output = '';
    steps.forEach((step, index) => {
        output += `<div class="step">
            <h3>Step ${index + 1}</h3>
            <p>${step.step}</p>`;
        
        if(step.matrix) {
            output += displayMatrix("A", step.matrix);
        }
        if(step.L) {
            output += displayMatrix("L", step.L);
        }
        if(step.U) {
            output += displayMatrix("U", step.U);
        }
        output += '</div>';
    });

    output += '<h3>Final Results:</h3>';
    output += displayMatrix("L", L);
    output += displayMatrix("D", D);
    output += displayMatrix("U", U);

    document.getElementById('output').innerHTML = output;
}

function displayMatrix(label, matrix) {
    let html = `<div class="matrix">
        <div class="matrix-label">${label}:</div>`;
    
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[0].length; j++) {
            html += `<span class="matrix-cell">${matrix[i][j].toFixed(2)}</span>`;
        }
        html += '<br>';
    }
    html += '</div>';
    return html;
}
