import { ref, provide, inject } from 'vue'
import axios from 'axios'
import { baseURL } from '../config'
import Swal from "sweetalert2";

const SUBJECT_UPDATE_KEY = Symbol()
const SESSION_UPDATE_KEY = Symbol()

// Shared state
const professorSubject = ref([])
const professorSession = ref([])
const loading = ref(false)

export function useSubjectSessionData() {
	const fetchSubjects = async () => {
		if (loading.value) return
		
		try {
			loading.value = true
			const proftoken = localStorage.getItem("proftoken")
			const response = await axios.get(`${baseURL}/api/professor/getAllSubject`, {
				headers: {
					proftoken: `${proftoken}`,
					"ngrok-skip-browser-warning": "69420",
				},
			})
			professorSubject.value = response.data.subject
		} catch (error) {
			console.error("Error getting subjects:", error)
			Swal.fire("Error", "Failed to fetch subjects", "error")
		} finally {
			loading.value = false
		}
	}

	const fetchSessions = async (subjectID) => {
		if (loading.value) return
		
		try {
			loading.value = true
			const proftoken = localStorage.getItem("proftoken")
			const response = await axios.get(
				`${baseURL}/api/professor/getClass/${subjectID}`,
				{
					headers: {
						proftoken: proftoken,
						"ngrok-skip-browser-warning": "69420",
					},
				}
			)
			professorSession.value = response.data.classes
		} catch (error) {
			console.error("Error getting sessions:", error)
			Swal.fire("Error", "Failed to fetch sessions", "error")
		} finally {
			loading.value = false
		}
	}

	return {
		professorSubject,
		professorSession,
		loading,
		fetchSubjects,
		fetchSessions
	}
}