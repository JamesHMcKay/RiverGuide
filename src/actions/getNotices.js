import axios from "axios";

import {
    CLEAR_NOTICES,
    GET_NOTICES,
    GET_ERRORS,
    CLEAR_LOADING_SPINNER,
    CLOSE_MODAL,
    CLEAR_ERRORS,
    SET_LOADING_SPINNER,
} from "./types";

const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const getNotices = (guideId) => dispatch => {
    let query_text = `{notices(where: {guide_id: ["${guideId}"], active: true}){id, description, status, priority, active, user_name, createdAt, end_date, user_id}}`;

    axios
    .get(`${rapidsApiUrl}graphql`,
        {
            headers: {'Authorization': ''},
            params: {query: query_text},
        }
    )
    .then(res => {
        let data = res.data.data.notices;
        let result = data.map(item => (
            {
                id: item.id,
                description: item.description,
                status: item.status,
                priority: item.priority,
                guideId: item.guide_id,
                userName: item.user_name,
                userId: item.user_id,
                active: item.active,
                endDate: item.end_date,
                createdAt: item.createdAt,
            }));
        dispatch({
            type: GET_NOTICES,
            payload: result,
        });
    })
    .catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: {message: "Notices request failed"}
        });
        dispatch({
            type: CLEAR_NOTICES
        });
    });
}

export const addNotice = (item, id) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "submitNotice",
    });
    const request = {
        description: item.description,
        status: item.status,
        priority: item.priority,
        guide_id: item.guideId,
        user_name: item.userName,
        user_id: item.userId,
        active: item.active,
        end_date: item.endDate
    };
    if (id) {
        axios
        .put(rapidsApiUrl + 'notices/' + id, request)
        .then(res => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch(getNotices(item.guideId));
            dispatch({ type: CLEAR_ERRORS });
            dispatch({
                type: CLOSE_MODAL,
            });
        }).catch(error => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch({
                type: GET_ERRORS,
                payload: {
                    message: "An error occured, please try submitting again",
                    id: "noticeSubmissionError",
                }
            });
        }); 
    } else {
        axios
    .post(rapidsApiUrl + 'notices', request)
    .then(res => {
        dispatch({
            type: CLEAR_LOADING_SPINNER,
        });
        dispatch(getNotices(item.guideId));
        dispatch({ type: CLEAR_ERRORS });
        dispatch({
            type: CLOSE_MODAL,
        });
    }).catch(error => {
        dispatch({
            type: CLEAR_LOADING_SPINNER,
        });
        dispatch({
            type: GET_ERRORS,
            payload: {
                message: "An error occured, please try submitting again",
                id: "noticeSubmissionError",
            }
        });
    }); 
    }
};

export const deleteNotice = (id, guideId) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "deleteNotice",
    });
        axios
        .delete(rapidsApiUrl + 'notices/' + id)
        .then(res => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch(getNotices(guideId));
            dispatch({ type: CLEAR_ERRORS });
            dispatch({
                type: CLOSE_MODAL,
            });
        }).catch(error => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch({
                type: GET_ERRORS,
                payload: {
                    message: "An error occured, please try submitting again",
                    id: "noticeDeleteError",
                }
            });
        }); 
   
};