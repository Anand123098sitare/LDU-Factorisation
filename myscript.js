let A = []; // Initial matrix provided by user.
let L = []; // Lower triangular matrix.
let D = []; // Diagonal matrix.
let U = []; // Upper triangular matrix.
let steps = []; // Store steps of LDU Factorization.
let n; // Matrix size

function Create_Matrix() {
  n = parseInt(document.getElementById("matrixSize").value);

  // Validate input
  if (isNaN(n) || n <= 0) {
    alert("Please enter a valid positive integer for matrix size.");
    return;
  }

  let html = '<div class="matrix">';

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      html += `<input type="number" class="matrix-cell" id="cell_${i}_${j}" value="0">`;
    }
    html += "<br>";
  }
  html += "</div>";
  document.getElementById("matrixInput").innerHTML = html;

  resetMatrices(); // Reset matrices when creating a new one
}

function resetMatrices() {
  A = [];
  L = Array.from({ length: n }, () => Array(n).fill(0)); // Initialize L
  D = Array.from({ length: n }, () => Array(n).fill(0)); // Initialize D
  U = Array.from({ length: n }, () => Array(n).fill(0)); // Initialize U
}

function Initialize_Matrices() {
  for (let i = 0; i < n; i++) {
    A[i] = [];

    for (let j = 0; j < n; j++) {
      A[i][j] = parseFloat(document.getElementById(`cell_${i}_${j}`).value);
    }

    // Set diagonal elements of L and U to 1
    L[i][i] = 1;
    U[i][i] = 1;
  }
}

function factorise_LDU() {
  Initialize_Matrices(); // Initialize matrices first

  steps.push({
    step: "Initial Matrix A:",
    matrix: JSON.parse(JSON.stringify(A)),
  });

  steps.push({
    step: "Initial Matrix L:",
    matrix: JSON.parse(JSON.stringify(L)),
  });

  steps.push({
    step: "Initial Matrix D:",
    matrix: JSON.parse(JSON.stringify(D)),
  });

  steps.push({
    step: "Initial Matrix U:",
    matrix: JSON.parse(JSON.stringify(U)),
  });

  // Start LDU Factorization
  for (let k = 0; k < n; k++) {
    if (A[k][k] === 0) {
      alert(
        `Division by zero encountered at row ${k}. Please ensure the matrix is suitable for LDU factorization.`
      );
      return;
    }

    D[k][k] = A[k][k];

    for (let i = k + 1; i < n; i++) {
      L[i][k] = A[i][k] / D[k][k];
      steps.push({
        step: `Computing L[${i}][${k}]`,
        matrix: JSON.parse(JSON.stringify(L)),
      });
    }

    for (let j = k + 1; j < n; j++) {
      U[k][j] = A[k][j] / D[k][k];
      steps.push({
        step: `Computing U[${k}][${j}]`,
        matrix: JSON.parse(JSON.stringify(U)),
      });
    }

    for (let i = k + 1; i < n; i++) {
      for (let j = k + 1; j < n; j++) {
        A[i][j] -= L[i][k] * D[k][k] * U[k][j];
      }
    }
  }

  displayResults();
}

function displayResults() {
  let output = "";

  steps.forEach((step, index) => {
    output += `<div class="step">
            <h3>Step ${index + 1}</h3>
            <p>${step.step}</p>`;

    if (step.matrix) {
      output += displayMatrix(step.matrix);
    }

    output += "</div>";
  });

  output += "<h3>Final Results:</h3>";
  output += "<h4>Lower Triangular Matrix L:</h4>";
  output += displayMatrix(L);
  output += "<h4>Diagonal Matrix D:</h4>";
  output += displayMatrix(D);
  output += "<h4>Upper Triangular Matrix U:</h4>";
  output += displayMatrix(U);

  document.getElementById("output").innerHTML = output;
}

function displayMatrix(matrix) {
  let html = `<div class="matrix">
        <div class="matrix-label">Matrix:</div>`;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      html += `<span class="matrix-cell">${matrix[i][j].toFixed(2)}</span>`;
    }
    html += "<br>";
  }

  html += "</div>";
  return html;
}
