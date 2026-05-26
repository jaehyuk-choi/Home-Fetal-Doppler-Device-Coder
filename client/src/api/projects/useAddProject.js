import instance from "../instance";


const useAddProject = async (project) => {
    try {
        const result = await instance.post('/addproject/', project)
        return result?.message === 'success'
    } catch (error) {
        console.error(error)
        return false
    }
}

export default useAddProject