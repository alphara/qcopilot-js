# qcopilot-js

The qcopilot-js is a command line tool for interacting with the [Quantum Copilot](https://qc.vuics.com) API.

You can read the [API.md](./API.md) document to learn more about the Quantum Copilot API.

## Install

You can install the package from NPM globally:
```bash
npm i -g @vuics/qcopilot-js
```

Or install locally from the repo:
```bash
npm i
```

## Setup

Create an API key on [Quantum Copilot](https://qc.vuics.com/keys).
Create `.env` file with the following content:
```
QCOPILOT_API_URL=https://api.qc.vuics.com/v1
QCOPILOT_API_KEY=<GET_API_KEY_ON_QUANTUM_COPILOT>
```

## Run

To run:
```bash
qc
qc help
```

## Usage Examples

### Ask

Ask a question and get an answer.
```bash
qc ask --prompt='What is a qubit?'
```
Example output:
```
A qubit, short for "quantum bit," is the basic unit of quantum information in quantum computing and quantum information theory. Similar to the classical binary bit, which can represent either a 0 or a 1, a qubit can represent a 0, a 1, or both simultaneously thanks to a property called superposition. This is due to a quantum mechanical phenomenon known as quantum superposition.

The most common physical representation of a qubit is using the spin of an electron or the polarization of a photon. In the case of an electron, its spin can be either "up" or "down," which corresponds to the classical binary states 0 and 1. However, a qubit can exist in a superposition of both states simultaneously, allowing for more complex computational possibilities.

Furthermore, qubits can also exhibit another quantum phenomenon called entanglement. Entanglement allows for a strong correlation between qubits, even if they are physically separated, enabling certain operations on one qubit to affect the state of another qubit instantly.

Qubits form the foundation of quantum computing and hold the potential to perform complex calculations exponentially faster than classical computers, leading to advancements in fields such as cryptography, optimization, and simulation.
```

### Run

Run a code on a quantum simulator or a real quantum hardware.
```bash
qc run --code='OPENQASM 2.0; include "qelib1.inc"; qreg q[2]; creg c[2]; h q[0]; cx q[0], q[1]; measure q -> c;' --device='simulator_statevector'
```
Example output:
```
     ┌───┐     ┌─┐
q_0: ┤ H ├──■──┤M├───
     └───┘┌─┴─┐└╥┘┌─┐
q_1: ─────┤ X ├─╫─┤M├
          └───┘ ║ └╥┘
c: 2/═══════════╩══╩═
                0  1
{
  "00": 2040,
  "11": 1960
}
```

By default, it runs code on a quantum simulator but you can set real quantum harware, for instance `--device='ibmq_quito'`.
```bash
qc run --code='OPENQASM 2.0; include "qelib1.inc"; qreg q[2]; creg c[2]; h q[0]; cx q[0], q[1]; measure q -> c;' --device='ibmq_quito'
```

### Code-run

Generate code and run it on a quantum simulator.
```bash
qc code-run --prompt='Write me a code example of quantum cirquit algorithm on OpenQASM 2'
```
Example output:
```
OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Applying a Hadamard gate to the first qubit
h q[0];

// Applying a controlled-X gate to entangle the qubits
cx q[0], q[1];

// Measuring the qubits
measure q[0] -> c[0];
measure q[1] -> c[1];

     ┌───┐     ┌─┐
q_0: ┤ H ├──■──┤M├───
     └───┘┌─┴─┐└╥┘┌─┐
q_1: ─────┤ X ├─╫─┤M├
          └───┘ ║ └╥┘
c: 2/═══════════╩══╩═
                0  1
{
  "11": 2025,
  "00": 1975
}
```

## Use in Jupyter Notebook

It is possible to use the qcopilot-js directly from your Jupyter Notebooks.
See the [notebook-example.ipynb](./notebook-example.ipynb) for more information.

