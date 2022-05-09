import axios from "axios";

const rootEl = document.getElementById('root') as HTMLElement;
const urlPrefix = rootEl.getAttribute("url_prefix") || "";

const axios_ = axios.create({
  baseURL: urlPrefix,
});

export default axios_;