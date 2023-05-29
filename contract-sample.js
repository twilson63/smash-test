export async function handle(state, action) {
  if (action.input.function === 'balance') {
    return {
      result: {
        target: action.input.target || action.caller,
        balance: state.balances[action.input.target || action.caller]
      }
    }
  }
  if (action.input.function === 'transfer') {
    ContractAssert(action.input.target, 'Target is required!')
    ContractAssert(action.input.qty, 'Qty is required!')
    ContractAssert(Number.isInteger(action.input.qty), 'Qty must be integer!')

    if (!state.balances[action.caller]) {
      state.balances[action.caller] = 0
    }
    if (!state.balances[action.input.target]) {
      state.balances[action.input.target] = 0
    }
    ContractAssert(state.balances[action.caller] > action.input.qty, 'Not enough balance to transfer!')

    state.balances[action.caller] -= action.input.qty
    state.balances[action.input.target] += action.input.qty
    return { state }
  }

  if (action.input.function === 'log') {
    state.log[SmartWeave.transaction.id] = SmartWeave.transaction.reward
    return { state }
  }
  throw new ContractError('function not found!')
}