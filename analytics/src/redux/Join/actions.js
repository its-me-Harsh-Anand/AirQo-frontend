/* eslint-disable */
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING,
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAILED,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    SHOW_CONFIRM_DIALOG,
    REGISTER_USER_FAILED,
    SHOW_EDIT_DIALOG,
    HIDE_EDIT_DIALOG,
    EDIT_USER_REQUEST,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILED,
    SHOW_DELETE_DIALOG,
    HIDE_DELETE_DIALOG,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAILED,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAILED,
    HIDE_CONFIRM_DIALOG,
    CONFIRM_USER_REQUEST,
    CONFIRM_USER_SUCCESS,
    CONFIRM_USER_FAILED,
    SET_DEFAULTS_REQUEST,
    SET_DEFAULTS_SUCCESS,
    SET_DEFAULTS_FAILED,
    REGISTRATION_SUCCESS,
    SHOW_REGISTER_USER,
    HIDE_REGISTER_USER,
    GET_COLLABORATORS_SUCCESS,
    GET_COLLABORATORS_FAILED,
    GET_COLLABORATORS_REQUEST,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    UPDATE_PROFILE_FAILED
} from "./types";
import constants from "../../config/constants";

/***************************fetching users ********************************* */
export const fetchUsers = () => {

    return (dispatch) => {
        dispatch(fetchUsersRequest());
        // Returns a promise
        console.log("we are now fetching users using the action for fetching ");
        return fetch(constants.GET_USERS_URI).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    dispatch(fetchUsersSuccess(data.users, data.message));
                });
            } else {
                response.json().then((error) => {
                    dispatch(fetchUsersFailed(error));
                });
            }
        });
    };
}


export const fetchUsersRequest = () => {
    return {
        type: GET_USERS_REQUEST,
    }
}

export const fetchUsersSuccess = (users, message) => {
    console.log("these are the users we are sending: ");
    console.dir(users);
    return {
        type: GET_USERS_SUCCESS,
        users: users,
        message: message,
        receiveAt: Date.now,
    }
}

export const fetchUsersFailed = (error) => {
    return {
        type: GET_USERS_FAILED,
        error
    }
}

/*********************** fetching collaborators ********************************/

export const fetchCollaborators = (id) => {

    return (dispatch) => {
        dispatch(fetchCollaboratorsRequest());
        // Returns a promise
        console.log("we are now fetching users using the action for fetching ");
        return fetch(constants.GET_COLLABORATORS_URI + id).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    dispatch(fetchCollaboratorsSuccess(data.users, data.message));
                });
            } else {
                response.json().then((error) => {
                    dispatch(fetchCollaboratorsFailed(error));
                });
            }
        });
    };

}

export const fetchCollaboratorsRequest = () => {
    return {
        type: GET_COLLABORATORS_REQUEST,
    }
}

export const fetchCollaboratorsSuccess = (users, message) => {
    console.log("these are the users we are sending: ");
    console.dir(users);
    return {
        type: GET_COLLABORATORS_SUCCESS,
        users: users,
        message: message,
        receiveAt: Date.now,
    }
}

export const fetchCollaboratorsFailed = (error) => {
    return {
        type: GET_COLLABORATORS_FAILED,
        error
    }
}


/********************* Add a new user ***********************************/
export const addNewUser = (user) => {
    return (dispatch) => {
        dispatch(addNewUserRequest(user));
        axios
            .post(constants.REGISTER_USER_URI, user)
            .then(res => {
                const { savedData, message } = res.data
                try {
                    dispatch(addNewUserRequestSuccess(savedData, message))
                } catch (e) {
                    console.log(e)
                }
            })
            .catch(error => {
                dispatch(addNewUserRequestFailed(error));
            })
    }
}

export const addNewUserRequest = user => {
    return {
        type: REGISTER_USER_REQUEST,
        user
    }
}

export const addNewUserRequestSuccess = (user, message) => {
    return {
        type: REGISTER_USER_SUCCESS,
        user: user,
        message: message
    }
}

export const addNewUserRequestFailed = (error) => {
    return {
        type: REGISTER_USER_FAILED,
        error
    }
}


export const showAddDialog = userToAdd => {
    return {
        type: SHOW_REGISTER_USER,
        user: userToAdd
    }
}

export const hideAddDialog = () => {
    return {
        type: HIDE_REGISTER_USER
    }
}

/********************* Edit a user ***********************************/

export const showEditDialog = userToEdit => {
    return {
        type: SHOW_EDIT_DIALOG,
        user: userToEdit
    }
}

export const hideEditDialog = () => {
    return {
        type: HIDE_EDIT_DIALOG
    }
}

export const editUser = (userToEdit) => (dispatch) => {
    dispatch(editUserRequest(userToEdit));
    console.log('user to edit: ');
    //console.log(userToEdit.values());
    let dataToSend = {};
    for (const [key, value] of userToEdit.entries()) {
        dataToSend[key] = value;
    }
    console.dir(dataToSend);
    return axios({
            method: 'put',
            url: constants.GET_USERS_URI,
            data: dataToSend,
        })
        .then(response => {
            if (response) {
                dispatch(editUserSuccess(response.data, response.data.message));
            } else {
                dispatch(editUserFailed(response.data.message));
            }
        })
        .catch(e => {
            dispatch(editUserFailed(e));
        })
};


export const editUserRequest = userToEdit => {

    return {
        type: EDIT_USER_REQUEST,
        userToEdit
    }
}

export const editUserSuccess = (userToEdit, message) => {
    return {
        type: EDIT_USER_SUCCESS,
        userToEdit: userToEdit,
        message: message,
    };
};

export const editUserFailed = (error) => {
    return {
        type: EDIT_USER_FAILED,
        error,
    };
};


/********************* Delete a user ***********************************/

export const deleteUserDialog = (userToDelete) => {
    return {
        type: SHOW_DELETE_DIALOG,
        user: userToDelete,
    };
};

export const hideDeleteDialog = () => {
    return {
        type: HIDE_DELETE_DIALOG,
    };
};

export const deleteUser = userToDelete => {
    return (dispatch) => {
        dispatch(deleteUserRequest(userToDelete));
        return fetch(constants.GET_USERS_URI + userToDelete._id, {
            method: "delete",
        }).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    dispatch(deleteUserSuccess(data.user, data.message));
                });
            } else {
                response.json().then((error) => {
                    dispatch(deleteUserFailed(error));
                });
            }
        });
    };
}

export const deleteUserRequest = userToDelete => {
    return {
        type: DELETE_USER_REQUEST,
        userToDelete
    }
}

export const deleteUserSuccess = (userToDelete, message) => {
    return {
        type: DELETE_USER_SUCCESS,
        userToDelete: userToDelete,
        message: message,
    }

}

export const deleteUserFailed = (error) => {
    return {
        type: DELETE_USER_FAILED,
        error,
    };
};


/************************* Register a new User  *****************************/
export const registerUser = (userData, history) => (dispatch) => {
    axios
        .post(constants.REGISTER_CANDIDATE_URI, userData)
        .then((res) => {
            try {
                history.push("/landing");
                registrationSuccess(res.data);
            } catch (e) {
                console.log(e);
            }
        }) // re-direct to login on successful register
        .catch((err) =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            })
        );
};



export const registrationSuccess = (data) => {

    return {
        type: REGISTRATION_SUCCESS,
        payload: data.savedData
    }
}


/************************* Login a new User  *********************************/
export const loginUser = (userData) => (dispatch) => {
    console.log("the login URL " + constants.LOGIN_USER_URI);
    axios
        .post(constants.LOGIN_USER_URI, userData)
        .then((res) => {
            try {
                // Save to localStorage
                // Set token to localStorage
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                // Set token to Auth header
                setAuthToken(token);
                // Decode token to get user data
                const decoded = jwt_decode(token);
                // Set current user
                dispatch(setCurrentUser(decoded));
            } catch (e) {
                console.log(e)
            }
        })
        .catch((err) =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response,
            })
        );
};

// Login - forgot password
export const forgotPassword = (userData) => (dispatch) => {
    axios
        .post(constants.FORGOT_PWD_URI, userData)
        .then((response) => {
            console.log(response.data);
            if (response.data === "email not recognized") {
                this.setState({
                    showError: true,
                    messageFromServer: "",
                });
            } else if (response.data === "recovery email sent") {
                this.setState({
                    showError: false,
                    messageFromServer: "",
                });
            }
        })
        .catch((err) =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response,
            })
        );
};

//Reset Password - verify Token

export const verifyToken = async(token) => {
    await axios
        .get(constants.VERIFY_TOKEN_URI, token)
        .then((response) => {
            console.log(response);
            if (response.data.message === "password reset link a-ok") {
                this.setState({
                    username: response.data.username,
                    update: false,
                    isLoading: false,
                    error: false,
                });
            } else {
                this.setState({
                    update: false,
                    isLoading: false,
                    error: true,
                });
            }
        })
        .catch((error) => {
            console.log(error.data);
        });
};


export const updatePassword = (userData) => (dispatch) => {
    axios
        .put(constants.UPDATE_PWD_IN_URI, userData)
        .then((response) => {
            console.log(response.data);
            if (response.data.success === true) {
                dispatch({
                    type: UPDATE_PASSWORD_SUCCESS,
                    payload: response.data.result
                })
            } else {
                dispatch({
                    type: UPDATE_PASSWORD_FAILED,
                    payload: response.data.err
                })
            }
        })
        .catch((error) => {
            console.log(error.data);
            dispatch({
                type: GET_ERRORS,
                payload: error.response,
            })
        });
};

export const updateProfile = (userData) => (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });
    return axios({
            method: 'put',
            url: constants.GET_USERS_URI,
            data: userData,
        })
        .then(response => {
            if (response) {
                dispatch({
                    type: UPDATE_PROFILE_SUCCESS
                });
            } else {
                dispatch({
                    type: UPDATE_PROFILE_FAILED
                });
            }
        })
        .catch(e => {
            dispatch({});
        })
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
    };
};
// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING,
    };
};
// Log user out
export const logoutUser = () => (dispatch) => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};

/*********************************** confirming users************************************/
export const confirmUserDialog = (userToConfirm, message) => {
    return {
        type: SHOW_CONFIRM_DIALOG,
        user: userToConfirm
    }
}

export const hideConfirmDialog = () => {
    return {
        type: HIDE_CONFIRM_DIALOG,
    };
};

export const confirmUser = (userToConfirm) => (dispatch) => {
    dispatch(confirmUserRequest(userToConfirm));
    return axios.post(constants.GET_USERS_URI, userToConfirm)
        .then(response => {
            if (response) {
                dispatch(confirmUserSuccess(response.data.user, response.data.message));
            } else {
                dispatch(confirmUserFailed(response.data.message));
            }
        })
        .catch(e => {
            dispatch(confirmUserFailed(e));
        })
}

export const confirmUserRequest = (userToConfirm) => {
    return {
        type: CONFIRM_USER_REQUEST,
        user: userToConfirm
    }
}

export const confirmUserSuccess = (userToConfirm, message) => {

    return {
        type: CONFIRM_USER_SUCCESS,
        userToConfirm: userToConfirm,
        message: message

    }
}

export const confirmUserFailed = (error) => {
    return {
        type: CONFIRM_USER_FAILED,
        error

    }
}


//*********************************** setting defaults ************************************/
export const setDefaults = (values) => (dispatch) => {
    dispatch(setDefaultsRequest(values));
    return axios.post(constants.GET_USERS_URI, values)
        .then(response => {
            if (response) {
                dispatch(setDefaultsSuccess(response.data.user, response.data.message));
            } else {
                dispatch(setDefaultsFailed(response.data.message));
            }
        })
        .catch(e => {
            dispatch(confirmUserFailed(e));
        })
}

export const setDefaultsRequest = (values) => {
    return {
        type: SET_DEFAULTS_REQUEST,
        userToDefault: values.id,
        userDefaults: values
    }
}

export const setDefaultsSuccess = (message) => {

    return {
        type: SET_DEFAULTS_SUCCESS,
        userToDefault: null,
        message: message
    }
}

export const setDefaultsFailed = (error) => {
    return {
        type: SET_DEFAULTS_FAILED,
        error
    }
}