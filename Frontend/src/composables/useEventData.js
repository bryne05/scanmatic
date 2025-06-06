import { ref } from "vue";
import axios from "axios";
import { baseURL } from "../config";
import Swal from "sweetalert2";

// Shared state for subjects
const professorEvent = ref([]);
const loading = ref(false);
let initialized = false;

export function useEventData() {
  const clearStateEvent = async () => {
    professorEvent.value = []; // Clear data
    initialized = false; // Reset initialization state
  };
  const fetchEvent = async () => {
    if (loading.value) return;

    try {
      loading.value = true;
      const proftoken = localStorage.getItem("proftoken");
      const response = await axios.get(`${baseURL}/api/professor/getEvent`, {
        headers: {
          proftoken: `${proftoken}`,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      professorEvent.value = response.data.subject;
      initialized = true;
    } catch (error) {
      console.error("Error getting subjects:", error);
      Swal.fire("Error", "Failed to fetch subjects", "error");
    } finally {
      loading.value = false;
    }
  };

  // Only fetch if not already initialized
  if (!initialized) {
    fetchEvent();
  }

  return {
    professorEvent,
    loading,
    fetchEvent,
    clearStateEvent,
  };
}
