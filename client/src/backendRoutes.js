// backend routings for frontend
const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5001/").replace(/\/?$/, "/")

// Use query param so empty project names (legacy bad rows) can still be deleted
const projectDeletePath = (owner, name, id) => {
    const ownerSeg = encodeURIComponent(owner)
    if (id) {
        return `project/${ownerSeg}?id=${encodeURIComponent(id)}`
    }
    return `project/${ownerSeg}?name=${encodeURIComponent(name)}`
}

const backendRoutes = {
    DOCUMENT_URL: baseUrl + "document/",
    SUMMARY_URL: baseUrl + "summary/",
    DECISION_URL: baseUrl + "decision/",
    PROFILE_URL: baseUrl + "profile/",
    PROJECTS_URL: baseUrl + "projects/",
    PROJECT_URL: baseUrl + "project/",
    ADD_PROJECT_URL: baseUrl + "addproject/",
    LOGIN_URL: baseUrl + "login/",
    REGISTER_URL: baseUrl + "register/",
    EDIT_URL: baseUrl + "edit/",
    SIMILARITY_URL: baseUrl + "stats/" + "similarity/",
    COHEN_KAPPA_URL: baseUrl + "stats/" + "ck/",
    USERS_URL: baseUrl + "users/",
    CODE_GROUP_URL: baseUrl + "codegroup/"
}

export { projectDeletePath }
export default backendRoutes;
