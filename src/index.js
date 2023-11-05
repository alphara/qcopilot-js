import axios from 'axios'
import { config } from 'dotenv'
import minimist from 'minimist'
import lodash from 'lodash'
const { has } = lodash

const argv = minimist(process.argv.slice(2));

const result = config()
if (result.error) {
  result.error.code === 'ENOENT'
    ? console.log('.env file is omitted')
    : console.error('.env error:', result.error)
}

const apiUrl = process.env.QCOPILOT_API_URL ||
  'http://localhost:6368/v1'
  // 'https://api.qc.vuics.com/v1'
const apiKey = process.env.QCOPILOT_API_KEY || '<YOUR_KEY>'
const appName = process.env.QCOPILOT_APP_NAME || 'npm start --'

const help = `
${appName} <command> [arguments]

Commands:
  ask --prompt='text'
  run --code='code' [--device='device']
  code-run --prompt [--device='device']

Arguments:
  -v - verbose mode

Devices:
  Quantum Simulators:
    - 'simulator_statevector' (by default)
    - 'ibmq_qasm_simulator'
    - 'simulator_mps'
  Real Quantum Hardware:
    - 'ibm_perth'
    - 'ibm_nairobi'
    - 'ibm_lagos'
    - 'ibmq_jakarta'
    - 'ibmq_manila'
    - 'ibmq_quito'
    - 'ibmq_belem'
    - 'ibmq_lima'

Examples:
  ${appName} ask --prompt='Code a quantum cirquit on OpenQASM 2 that implements entanglement'
  ${appName} run --code='OPENQASM 2.0; include "qelib1.inc"; qreg q[2]; creg c[2]; h q[0]; cx q[0], q[1]; measure q -> c;' --device='simulator_statevector'
  ${appName} code-run --prompt='Write me a code example of quantum cirquit algorithm on OpenQASM 2' --device='simulator_statevector'
`

const auth = async () => {
  let res = null
  try {
    const [username, password] = apiKey.split(':')
    res = await axios.post(`${apiUrl}/oauth2/token`, {
      grant_type: 'client_credentials',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username,
        password,
      },
    })
    // console.log('auth res.data:', res.data)
    const tokenType = res.data.token_type
    const token = res.data.access_token
    // console.log('tokenType:', tokenType)
    // console.log('token:', token)
    if (tokenType !== 'Bearer' || !token) {
      throw new Error('Authorization error')
    }
    return token
  } catch (err) {
    console.error('Error:', err)
  }
}

const ask = async ({ accessToken, prompt }) => {
  let res = null
  try {
    res = await axios.post(`${apiUrl}/ask/api`, {
      prompt,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    // console.log('ask res.data:', res.data)
    return res.data
  } catch (err) {
    console.error('Error:', err)
  }
}

const run = async ({ accessToken, code, device }) => {
  let res = null
  try {
    res = await axios.post(`${apiUrl}/run/api`, {
      code,
      device
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    // console.log('run res.data:', res.data)
    return res.data
  } catch (err) {
    console.error('Error:', err)
  }
}

const main = async () => {
  try {
    let accessToken = null
    const v = argv['v']
    const commands = argv['_']
    const prompt = argv['prompt'] || ''
    const code = argv['code'] || ''
    const device = argv['device'] || 'simulator_statevector'

    v && console.log('Arguments:', argv)
    v && console.log('Prompt:', prompt)
    v && console.log('Code:')
    v && code && console.log(code)
    v && console.log('Device:', device)

    if (commands.includes('ask')) {
      v && console.log('Ask')
      if (!accessToken) { accessToken = await auth() }
      if (!prompt) { return console.error('Error: No prompt specified.') }
      const { reply } = await ask({
        accessToken,
        prompt,
      })
      v && console.log('Reply:')
      console.log(reply)

    } else if (commands.includes('run')) {
      v && console.log('Run')
      if (!accessToken) { accessToken = await auth() }
      if (!code) { return console.error('Error: No code specified.') }
      const { output, drawing } = await run({
        accessToken,
        code,
        device,
      })
      v && console.log('Drawing:')
      console.log(drawing)
      v && console.log('Output:')
      console.log(output)

    } else if (commands.includes('code-run')) {
      v && console.log('Code-run')
      if (!accessToken) { accessToken = await auth() }
      if (!prompt) { return console.error('Error: No prompt specified.') }
      const { reply } = await ask({
        accessToken,
        prompt,
      })
      // console.log('reply:', reply)
      const code = reply.split('```\n')[1]
      v && console.log('Code:')
      console.log(code)
      if (!code) { return console.error('Error: No code generated.') }
      const { output, drawing } = await run({
        accessToken,
        code,
        device,
      })
      v && console.log('Drawing:')
      console.log(drawing)
      v && console.log('Output:')
      console.log(output)

    } else if (commands.includes('help')) {
      console.log(help)

    } else {
      console.log(`No command. Use: ${appName} help`)

    }
  } catch (err) {
    console.error('Error:', err)
  }
}

(() => main())()

