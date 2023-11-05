# Quantum Copilot API

This developer's guide explainse how to access Qauntum Copilot API using programmatic tools such as `curl` or programming languages.

## Authorization

Go to [https://qc.vuics.com/keys](https://qc.vuics.com/keys) and create an API Key.
Set the environment variables:
```bash
export QCOPILOT_API_URL=https://api.qc.vuics.com/v1
export QCOPILOT_API_KEY=<YOUR_KEY>
```

Exchange the API key for an access token.

```bash
curl --user $QCOPILOT_API_KEY -H 'Content-Type: application/json' -d '{ "grant_type": "client_credentials" }' -X POST $QCOPILOT_API_URL/oauth2/token

# Output:
# {"access_token":"<TOKEN>","token_type":"Bearer"}
export QCOPILOT_TOKEN=<TOKEN>
```

## Usage

### Ask

```bash
curl -H 'Authorization: Bearer '$QCOPILOT_TOKEN -H 'Content-Type: application/json' -X POST $QCOPILOT_API_URL/ask/api -d '{ "prompt": "What is quantum teleportation?" }'

# Output:
# {"result":"ok","reply":"Quantum teleportation is a method of transferring quantum information (such as the quantum state of a particle) from one location to another, without physically moving the particle itself."}
```

### Run

```bash
curl -H 'Authorization: Bearer '$QCOPILOT_TOKEN -H 'Content-Type: application/json' -X POST $QCOPILOT_API_URL/run/api -d '{ "code": "OPENQASM 2.0; include \"qelib1.inc\"; qreg q[2]; creg c[2]; h q[0]; cx q[0], q[1]; measure q -> c;", "device": "simulator_statevector" }'

# Output:
# {"result":"ok","output":"{\n  \"11\": 1941,\n  \"00\": 2059\n}","drawing":"     ┌───┐     ┌─┐   \nq_0: ┤ H ├──■──┤M├───\n     └───┘┌─┴─┐└╥┘┌─┐\nq_1: ─────┤ X ├─╫─┤M├\n          └───┘ ║ └╥┘\nc: 2/═══════════╩══╩═\n                0  1 "}
```
