import { ref, provide, inject } from "vue";
import axios from "axios";
import { baseURL } from "../config";
import Swal from "sweetalert2";

// Create a symbol for injection key
const SHOP_UPDATE_KEY = Symbol();

// Shared state
const studentData = ref(null);
const filteredShopItems = ref([]);
const professorShopItems = ref([]);
const loading = ref(false);
let initialized = false;

export function useShopData() {
  const clearStateDataProfessor = () => {
    professorShopItems.value = [];
    initialized = false;
  };
  const clearStateData = () => {
    studentData.value = null;
    filteredShopItems.value = [];
  };

  const fetchStudentData = async () => {
    try {
      loading.value = true;
      const token = localStorage.getItem("studtoken");

      const [studentResponse, shopItemsResponse] = await Promise.all([
        axios.get(`${baseURL}/api/student/getStudent/`, {
          headers: {
            studtoken: token,
            "ngrok-skip-browser-warning": "69420",
          },
        }),
        axios.get(`${baseURL}/api/student/getStudentShopItems/`, {
          headers: {
            studtoken: token,
            "ngrok-skip-browser-warning": "69420",
          },
        }),
      ]);

      studentData.value = studentResponse.data;
      filteredShopItems.value = shopItemsResponse.data.filteredShopItems;
      initialized = true;
    } catch (error) {
      console.error("Error getting student data:", error);
    } finally {
      loading.value = false;
    }
  };

  const fetchProfessorData = async () => {
    try {
      loading.value = true;
      const token = localStorage.getItem("proftoken");

      const response = await axios.get(`${baseURL}/api/professor/getItems`, {
        headers: {
          proftoken: token,
          "ngrok-skip-browser-warning": "69420",
        },
      });
      professorShopItems.value = response.data.shopItem;
      initialized = true;
      // Emit update event after professor data changes
      const emitter = inject(SHOP_UPDATE_KEY);
      if (emitter) {
        emitter();
      }
    } catch (error) {
      console.error("Error getting professor data:", error);
    } finally {
      loading.value = false;
    }
  };

  const refreshAllData = async () => {
    // Refresh both student and professor data
    await Promise.all([fetchStudentData(), fetchProfessorData()]);
  };

  const buyItem = async (item) => {
    const token = localStorage.getItem("studtoken");
    try {
      loading.value = true;
      const itemId = item.item_id;
      const response = await axios.post(
        `${baseURL}/api/student/buyStudentShopItems/${itemId}`,
        {},
        {
          headers: {
            studtoken: token,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        await fetchStudentData();
        return true;
      }
      return false;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Points",
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Provide the update function
  const provideShopUpdate = (callback) => {
    provide(SHOP_UPDATE_KEY, callback);
  };
  if (!initialized) {
    refreshAllData();
  }

  return {
    studentData,
    filteredShopItems,
    professorShopItems,
    loading,
    fetchStudentData,
    fetchProfessorData,
    refreshAllData,
    provideShopUpdate,
    buyItem,
    clearStateData,
    clearStateDataProfessor,
  };
}
