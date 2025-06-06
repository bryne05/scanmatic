<template>
  <div v-if="loading || isLoading" class="loading-overlay">
    <moon-loader :loading="loading || isLoading" color="white" size="150px" />
  </div>
  <div v-else class="container d-flex flex-column">
    <div class="row">
      <div class="col-xl-6 col-12 text-xl-start text-center">
        <h1>EVENT DASHBOARD</h1>
        <h5>
          This section provides an overview of all your events. Each event
          represents a unique gathering or session. Here, you can easily create,
          update, or delete an event, and view participants' attendance.
        </h5>
      </div>
      <div class="col-xl-6 col-12 text-xl-end text-center">
        <button
          class="btnsyle mb-3"
          data-bs-toggle="modal"
          data-bs-target="#addsubject"
        >
          Add Event
        </button>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-8 col-12 d-flex flex-wrap gap-3">
        <div class="int search" style="max-width: 350px">
          <img src="../assets/Prof-Class/search.png" alt="subject icon" />
          <input
            type="text"
            class="form-control"
            placeholder="Search Events..."
            v-model="searchQuery"
            @input="filterEvents"
          />
        </div>
      </div>
    </div>

    <div class="scroll-container mt-3">
      <div
        class="col-xxl-12 col-md-10 d-flex justify-content-start align-items-center flex-wrap"
      >
        <div
          class="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 d-flex justify-content-start align-items-center"
          v-for="subject in filteredProfessorEvents"
          :key="subject.subject_id"
        >
          <div class="card d-flex justify-content-between">
            <div class="row">
              <div
                class="col-xl-2 d-flex justify-content-center align-items-start"
              >
                <img src="../assets/Prof-Class/event.png" alt="event icon" />
              </div>
              <div
                class="col-xl-7 d-flex justify-content-xl-start justify-content-center align-items-xl-start align-items-center flex-column"
              >
                <h5 class="card-title text-wrap">
                  {{ subject.subject_name }}
                </h5>

                <h6>
                  <img src="../assets/Prof-Class/Delivery Time.png" alt="" />
                  {{ formatTime(subject.subject_start_time) }} -
                  {{ formatTime(subject.subject_end_time) }}
                </h6>
              </div>
              <div
                class="col-xl-3 d-flex justify-content-xl-start justify-content-center align-items-xl-start align-items-center gap-2 flex-lg-nowrap"
              >
                <img
                  data-bs-toggle="modal"
                  data-bs-target="#updateSubject"
                  @click="setUpdateSubject(subject)"
                  src="../assets/Prof-Class/Create.png"
                  alt="update icon"
                />
                <img
                  @click="deleteItem(subject)"
                  src="../assets/Prof-Class/Delete.png"
                  alt="update icon"
                />
              </div>
            </div>
            <div class="row">
              <div
                class="col-12 d-flex align-items-end justify-content-center align-self-end"
              >
                <button
                  class="btn btn-dark mar w-100 button-row"
                  @click="enterSession(subject)"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div></div>

  <div
    class="modal fade"
    id="addsubject"
    tabindex="-1"
    aria-labelledby="addCategory"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      style="color: black"
    >
      <div class="modal-content">
        <form>
          <div class="modal-header">
            <h5 class="modal-title" id="addsubject">Event Details</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <label class="form-label fw-bold inv">Event Name</label>
              <input
                v-model="subjectName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter Event Name"
              />

              <label class="form-label fw-bold inv">Start Time</label>
              <VueDatePicker
                v-model="subjectStartTime"
                time-picker
                placeholder="Start Time"
                :is24="false"
                auto-position="top"
                :teleport="true"
              >
                <template #input-icon>
                  <img class="input-slot-image" src="../assets/clock.png" />
                </template>
              </VueDatePicker>

              <label class="form-label fw-bold inv">End Time</label>
              <VueDatePicker
                v-model="subjectEndTime"
                time-picker
                placeholder="End Time"
                :is24="false"
                auto-position="top"
                :teleport="true"
              >
                <template #input-icon>
                  <img class="input-slot-image" src="../assets/clock.png" />
                </template>
              </VueDatePicker>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-primary" @click="addSubject">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="updateSubject"
    tabindex="-1"
    aria-labelledby="addCategory"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      style="color: black"
    >
      <div class="modal-content">
        <form>
          <div class="modal-header">
            <h5 class="modal-title" id="updateSubject">New Event Details</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <h6 style="color: gray">
              <i
                >"Leave it blank if you don't want to update certain details"</i
              >
            </h6>
            <div class="col-md-12">
              <label class="form-label fw-bold inv">Event Name</label>
              <input
                v-model="updateSubjectName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new name for event"
              />

              <label class="form-label fw-bold inv">Start Time</label>
              <VueDatePicker
                v-model="updateSubjectStartTime"
                time-picker
                placeholder="Start Time"
                :is24="false"
                auto-position="top"
                :teleport="true"
              >
                <template #input-icon>
                  <img class="input-slot-image" src="../assets/clock.png" />
                </template>
              </VueDatePicker>

              <label class="form-label fw-bold inv">End Time</label>
              <VueDatePicker
                v-model="updateSubjectEndTime"
                time-picker
                placeholder="End Time"
                :is24="false"
                auto-position="top"
                :teleport="true"
              >
                <template #input-icon>
                  <img class="input-slot-image" src="../assets/clock.png" />
                </template>
              </VueDatePicker>
              <input type="hidden" v-model="currentSubjectId" />
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateSubject"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btnsyle {
  background-color: white;
  color: black;
  width: 260px;
  height: 50px;
  border: black 2px solid;
  border-radius: 16px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: black;
  color: white;
}
.button-row {
  border-radius: 8px;
  transition: 0.3s;
}
.int {
  display: flex;

  align-items: center;
  background-color: white;
  width: 320px;
  border-radius: 8px;
  gap: 3px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  height: 45px;
}

.int input {
  border: none;
}
.int img {
  margin-left: 10px;
  width: 25px;
  height: 25px;
}

.search {
  border: none;
}
.search input {
  font-size: 18px;
}

.search input:focus {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
.button-row:hover {
  color: black;
  background-color: white;
}

.card h6 img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.scroll-container {
  min-height: 620px;
  overflow-y: auto;
}
.card h6 {
  display: flex;
  align-items: center;
  color: #464646;
}
.card .col-xl-3 img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.card .col-xl-3 img:hover {
  transform: scale(1.3);
}

.card .col-xl-2 img {
  width: 60px;
  height: 60px;
  margin-top: -3px;
}
.card {
  max-width: 420px;
  min-height: 269px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
  margin: 10px;
  overflow: hidden;
}
.card h5 {
  font-family: Outfit-bold;
  white-space: nowrap; /* Prevents text from wrapping to the next line */
  overflow: hidden; /* Hides any content that goes beyond the element's box */
  text-overflow: ellipsis;
  display: block; /* Essential: text-overflow requires a block-level or inline-block element */
  max-width: 100%;
}
h1 {
  color: #464646;
  letter-spacing: 1px;
  font-family: Outfit-bold;
}

h5 {
  color: #464646;
}
span {
  font-size: 20px;
}
.container {
  padding-top: 100px;
}

.scroll-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

@media (max-width: 767px) {
  .btnsyle {
    width: 250px;
  }
}

@media (max-height: 800px) {
  .scroll-container {
    max-height: 400px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .card {
    padding: 12px;
  }
}
</style>
<script setup>
import { ref, provide, computed } from "vue";
import axios from "axios";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useEventData } from "../composables/useEventData";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const router = useRouter();
const proftoken = localStorage.getItem("proftoken");
const { professorEvent, loading, fetchEvent } = useEventData();

const subjectDetails = ref(null);
//Current Subject
const currentSubjectId = ref(null);
const currentSubjectName = ref(null);
const currentSubjectCourseYearSection = ref(null);
const currentSubjectStartTime = ref(null);
const currentSubjectEndTime = ref(null);

//Add Subject
const subjectName = ref("");

const subjectStartTime = ref("");
const subjectEndTime = ref("");
//Update Subject

const updateSubjectName = ref("");

const updateSubjectStartTime = ref("");
const updateSubjectEndTime = ref("");

// Search functionality
const searchQuery = ref("");

const filteredProfessorEvents = computed(() => {
  let events = [...professorEvent.value]; // Create a copy to avoid mutating the original

  // Sort by subject_id in descending order (newest to oldest)
  events.sort((a, b) => b.subject_id - a.subject_id);

  if (!searchQuery.value) {
    return events;
  }
  const query = searchQuery.value.toLowerCase();
  return events.filter((subject) =>
    subject.subject_name.toLowerCase().includes(query)
  );
});

function formatTime(timeString) {
  if (!timeString) return ""; // Handle null or undefined

  const [hours, minutes, seconds] = timeString.split(":");
  let formattedHours = parseInt(hours, 10);
  const amPm = formattedHours >= 12 ? "PM" : "AM";

  formattedHours = formattedHours % 12 || 12; // Convert to 12-hour format (0 becomes 12)

  return `${formattedHours}:${minutes} ${amPm}`;
}

const setUpdateSubject = (subject) => {
  currentSubjectId.value = subject.subject_id;
  currentSubjectName.value = subject.subject_name;
  currentSubjectCourseYearSection.value = subject.subject_courseYearSection;
  if (subject.subject_start_time) {
    const [hours, minutes] = subject.subject_start_time.split(":");
    updateSubjectStartTime.value = {
      hours: parseInt(hours),
      minutes: parseInt(minutes),
    };
  } else {
    updateSubjectStartTime.value = null; // Or a default object if needed
  }

  if (subject.subject_end_time) {
    const [hours, minutes] = subject.subject_end_time.split(":");
    updateSubjectEndTime.value = {
      hours: parseInt(hours),
      minutes: parseInt(minutes),
    };
  } else {
    updateSubjectEndTime.value = null; // Or a default object if needed
  }
};

const updateSubject = async () => {
  const confirmationResult = await Swal.fire({
    title: "Update Subject",
    text: "Are you sure you want to update this event?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    isLoading.value = true;
    try {
      console.log("END", currentSubjectEndTime.value);
      console.log("Start", currentSubjectStartTime.value);
      const updatedData = {
        subject_name: updateSubjectName.value || currentSubjectName.value,
        subject_courseYearSection: "",
        subject_start_time: `${updateSubjectStartTime.value.hours}:${updateSubjectStartTime.value.minutes}`,
        subject_end_time: `${updateSubjectEndTime.value.hours}:${updateSubjectEndTime.value.minutes}`,
      };

      const response = await axios.put(
        `${baseURL}/api/professor/updateSubject/${currentSubjectId.value}`,
        updatedData,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Subject name updated successfully",
          icon: "success",
        });

        await fetchEvent();
        updateSubjectName.value = "";
      } else {
        isLoading.value = false;
        Swal.fire({
          title: "Error",
          text: "Failed to update subject",
          icon: "error",
        });
      }
    } catch (error) {
      isLoading.value = false;
      console.error("Error updating Subject:", error);
      Swal.fire({
        title: "Error",
        text: "A subject with that name already exist",
        icon: "error",
      });
    }
  }
};

const addSubject = async () => {
  if (!subjectName.value || !subjectStartTime.value || !subjectEndTime.value) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }
  console.log(subjectName.value);
  console.log(subjectStartTime.value);
  console.log(subjectEndTime.value);
  try {
    const response = await axios.post(
      `${baseURL}/api/professor/createEvent`,
      {
        subject_name: subjectName.value,
        subject_start_time: `${subjectStartTime.value.hours}:${subjectStartTime.value.minutes}`,
        subject_end_time: `${subjectEndTime.value.hours}:${subjectEndTime.value.minutes}`,
      },
      {
        headers: {
          proftoken: `${proftoken}`,
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    if (response.status === 200) {
      Swal.fire("Success", "Event added successfully!", "success");
      await fetchEvent();
      subjectName.value = "";

      subjectStartTime.value = "";
      subjectEndTime.value = "";
    } else {
      Swal.fire("Error", "Failed to add subject", "error");
    }
  } catch (error) {
    console.error("Error adding subject:", error);
    Swal.fire("Error", "Subject with that name is already Existing", "error");
  }
};

const deleteItem = async (subject) => {
  const subjectID = subject.subject_id;
  const confirmationResult = await Swal.fire({
    title: "Delete Subject",
    text: "Are you sure you want to delete this Subject?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    isLoading.value = true;
    try {
      const response = await axios.delete(
        `${baseURL}/api/professor/deleteSubject/${subjectID}`,
        {
          headers: {
            proftoken: proftoken,
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      if (response.status === 200) {
        await fetchEvent();
        isLoading.value = false;

        Swal.fire({
          title: "Success",
          text: "Subject Deleted successfully",
          icon: "success",
        });
      } else {
        isLoading.value = false;
        Swal.fire({
          title: "Error",
          text: "Failed to delete Subject item",
          icon: "error",
        });
      }
    } catch (error) {
      isLoading.value = false;
      console.error("Error deleting Subject item:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting subject",
        icon: "error",
      });
    }
  }
};
provide("subjectDetails", subjectDetails);
const enterSession = (subject) => {
  router.push({
    name: "ProfessorEventSession",
    params: {
      subjectID: subject.subject_id,
      subjectName: subject.subject_name,
      startTime: subject.subject_start_time,
      endTime: subject.subject_end_time,
    },
  });
};
</script>
