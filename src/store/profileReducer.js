import * as actionTypes from './actions';

const initState = {
  profileUrl: ''
};

const profileReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.PROFILE:
        console.log("action.payload : ", action.payload)
      return {
        ...state,
        profileUrl: action.payload
      };
    default:
      return state;
  }
};

export default profileReducer;
