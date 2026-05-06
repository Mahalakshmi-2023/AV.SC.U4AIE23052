import axios from "axios";

const API = axios.create({
    baseURL: "http://20.207.122.201/evaluation-service"
});

API.interceptors.request.use((config) => {

    config.headers.Authorization =
        `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`;

    return config;
});

export default API;