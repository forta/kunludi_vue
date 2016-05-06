//export const increment = function (store) {  store.dispatch('INCREMENT') }

export const resetUserId = ({ dispatch }) => dispatch('RESETUSERID')

export const setUserId = function (store, par) {  store.dispatch('SETUSERID', par) }

export const increment = ({ dispatch }) => dispatch('INCREMENT')

export const incrementBy = function (store, par) {  store.dispatch('INCREMENTBY', par) }


/*
export const decrement = ({ dispatch }) => dispatch('DECREMENT')



export const incrementIfOdd = ({ dispatch, state }) => {
  if ((state.count + 1) % 2 === 0) {
    dispatch('INCREMENT')
  }
}

export const incrementAsync = ({ dispatch }) => {
  setTimeout(() => {
    dispatch('INCREMENT')
  }, 1000)
}

*/