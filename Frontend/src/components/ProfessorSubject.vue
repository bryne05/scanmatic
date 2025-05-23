<template>
  <div>
    <div v-if="loading || isLoading" class="loading-overlay">
      <moon-loader :loading="loading || isLoading" color="white" size="150px" />
    </div>

    <div v-else class="container desc">
      <div class="row">
        <div class="col-xl-6">
          <div class="text-xl-start text-center t">
            <h1 style="font-family: Outfit-bold">MY SUBJECTS</h1>

            <h5>
              An overview of all your subjects. Each subject corresponds to a
              unique program of study. Select, Enter, Update, Delete a Subject,
              and View Students' Participation.
            </h5>
          </div>
        </div>
        <div class="col-xl-6 d-flex justify-content-xl-end justify-content-center align-items-center">
          <button
            class="btnsyle mb-3"
            data-bs-toggle="modal"
            data-bs-target="#addsubject"
          >
            Add Subject
          </button>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-8 col-12 d-flex flex-wrap gap-3">
          <div class="int search flex-grow-1" style="max-width: 350px">
            <img src="../assets/Prof-Class/search.png" alt="subject icon" />
            <input
              v-model="searchQueryCombined"
              type="text"
              class="form-control"
              placeholder="Search Subjects..."
            />
          </div>

          <div class="flex-grow-1" style="max-width: 200px">
            <select
              class="form-select cus-border"
              v-model="selectedFilterProgramLevel"
            >
              <option value="">All Programs</option>
              <option
                v-for="program in uniqueProgramLevels"
                :key="program"
                :value="program"
              >
                {{ program }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="row scroll-container pb-3">
        <div
          class="col-xxl-4 col-xl-6 col-md-12 col-sm-12 col-12 mt-3 d-flex justify-content-center align-items-center"
          v-for="subject in filteredAndSortedSubjects"
          :key="subject.subject_id"
        >
          <div class="card d-flex justify-content-between">
            <div class="row">
              <div class="col-2 d-flex justify-content-center">
                <img src="../assets/Prof-Class/book.png" alt="book-icon" />
              </div>
              <div class="col-7 text-start">
                <h5>{{ subject.subject_name }}</h5>
                <h6 class="d-flex align-items-center">
                  <img
                    src="../assets/Prof-Class/Delivery Time.png"
                    alt="time icon"
                  />
                  {{ formatTime(subject.subject_start_time) }} -
                  {{ formatTime(subject.subject_end_time) }}
                </h6>
                <h6 class="d-flex align-items-center">
                  <img
                    src="../assets/Prof-Class/People.png"
                    alt="people icon"
                  />
                  {{ subject.subject_courseYearSection }}
                </h6>
              </div>
              <div class="col-3 d-flex justify-content-between gap-3">
                <img
                  class="icon-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#updateSubject"
                  @click="setUpdateSubject(subject)"
                  src="../assets/Prof-Class/Create.png"
                  alt="update icon"
                />

                <img
                  class="icon-btn"
                  @click="deleteItem(subject)"
                  src="../assets/Prof-Class/Delete.png"
                  alt="delete icon"
                />
              </div>
            </div>

            <div class="row">
              <div
                class="col-12 d-flex justify-content-center flex-column align-items-center"
              >
                <button
                  class="enter-btn text-center"
                  @click="enterSession(subject)"
                >
                  View Sessions
                </button>

                <a @click="enterParticipationRecords(subject)">
                  View Participation Overview
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            !filteredAndSortedSubjects || filteredAndSortedSubjects.length === 0
          "
          class="col-12 text-center mt-4 text-muted"
        >
          No subjects found matching your criteria.
        </div>
      </div>
    </div>
  </div>

  <!-- Add Modal -->
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
            <h5 class="modal-title" id="addsubject">Subject Details</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-md-12">
              <label class="form-label fw-bold inv">Subject Name</label>
              <input
                v-model="subjectName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter Subject Name"
              />
              <label class="form-label fw-bold inv">Program Level</label>
              <input
                v-model="subjectCourseYearSection"
                type="text"
                class="form-control cus-border"
                placeholder="Enter Program Level eg: BSCS 4A, STEM 11A, ACT 1A"
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
  <!-- Update Modal -->
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
            <h5 class="modal-title" id="updateSubject">New Subject Details</h5>

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
              <label class="form-label fw-bold inv">Subject Name</label>
              <input
                v-model="updateSubjectName"
                type="text"
                class="form-control cus-border"
                placeholder="Enter new name for subject"
              />
              <label class="form-label fw-bold inv">Program Level</label>
              <input
                v-model="updateSubjectCourseYearSection"
                type="text"
                class="form-control cus-border"
                placeholder="Enter Program Level eg: BSCS 4A, STEM 11A, ACT 1A"
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

<script setup>
import { ref, provide, computed } from "vue";
import axios from "axios";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useSubjectData } from "../composables/useSubjectData";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { MoonLoader } from "vue3-spinner";

const isLoading = ref(false);
const router = useRouter();
const proftoken = localStorage.getItem("proftoken");
const { professorSubject, loading, fetchSubjects } = useSubjectData();

const subjectDetails = ref(null);
//Current Subject
const currentSubjectId = ref(null);
const currentSubjectName = ref(null);
const currentSubjectCourseYearSection = ref(null);
const currentSubjectStartTime = ref(null);
const currentSubjectEndTime = ref(null);

//Add Subject
const subjectName = ref("");
const subjectCourseYearSection = ref("");
const subjectStartTime = ref("");
const subjectEndTime = ref("");
//Update Subject

const updateSubjectName = ref("");
const updateSubjectCourseYearSection = ref("");
const updateSubjectStartTime = ref("");
const updateSubjectEndTime = ref("");

// Search Query
const searchQueryTitle = ref("");
const searchQueryProgram = ref("");
const searchQueryCombined = ref("");

// NEW: Program Level Filter Ref
const selectedFilterProgramLevel = ref("");

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
  updateSubjectName.value = subject.subject_name; // Set for update modal
  updateSubjectCourseYearSection.value = subject.subject_courseYearSection; // Set for update modal
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
    text: "Are you sure you want to update this Subject?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    isLoading.value = true;
    try {
      console.log("END", updateSubjectEndTime.value);
      console.log("Start", updateSubjectStartTime.value);
      const updatedData = {
        subject_name: updateSubjectName.value,
        subject_courseYearSection: updateSubjectCourseYearSection.value,
        subject_start_time: updateSubjectStartTime.value
          ? `${updateSubjectStartTime.value.hours}:${updateSubjectStartTime.value.minutes}`
          : null,
        subject_end_time: updateSubjectEndTime.value
          ? `${updateSubjectEndTime.value.hours}:${updateSubjectEndTime.value.minutes}`
          : null,
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
        await fetchSubjects();
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Subject name updated successfully",
          icon: "success",
        });
        // Clear update form fields after successful update
        updateSubjectName.value = "";
        updateSubjectCourseYearSection.value = "";
        updateSubjectStartTime.value = null;
        updateSubjectEndTime.value = null;
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update subject",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating Subject:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "A subject with that name already exists or an unexpected error occurred",
        icon: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const addSubject = async () => {
  if (
    !subjectName.value ||
    !subjectCourseYearSection.value || // Changed from .length === 0 to !value
    !subjectStartTime.value ||
    !subjectEndTime.value
  ) {
    Swal.fire("Error", "All fields are required", "error");
    return;
  }

  try {
    const response = await axios.post(
      `${baseURL}/api/professor/createSubject`,
      {
        subject_name: subjectName.value,
        subject_courseYearSection: subjectCourseYearSection.value,
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
      Swal.fire("Success", "Subject added successfully!", "success");
      await fetchSubjects();
      subjectName.value = "";
      subjectCourseYearSection.value = "";
      subjectStartTime.value = "";
      subjectEndTime.value = "";
    } else {
      Swal.fire("Error", "Failed to add subject", "error");
    }
  } catch (error) {
    console.error("Error adding subject:", error);
    Swal.fire(
      "Error",
      error.response?.data?.message ||
        "Subject with that name is already Existing or an unexpected error occurred",
      "error"
    );
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
        await fetchSubjects();
        isLoading.value = false;
        Swal.fire({
          title: "Success",
          text: "Subject Deleted successfully",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete Subject item",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting Subject item:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while deleting subject",
        icon: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }
};
provide("subjectDetails", subjectDetails);

const enterSession = (subject) => {
  router.push({
    name: "ProfessorSession",
    params: {
      subjectID: subject.subject_id,
      subjectName: subject.subject_name,
      subjectCourse: subject.subject_courseYearSection,
      startTime: subject.subject_start_time,
      endTime: subject.subject_end_time,
    },
  });
};

const enterParticipationRecords = (subject) => {
  router.push({
    name: "ParticipantsOverview",
    params: {
      subjectID: subject.subject_id,
      subjectName: subject.subject_name,
      subjectProgramLevel: subject.subject_courseYearSection,
    },
  });
};

// NEW: Computed property for unique program levels for the dropdown
const uniqueProgramLevels = computed(() => {
  const programs = new Set();
  professorSubject.value.forEach((subject) => {
    if (subject.subject_courseYearSection) {
      programs.add(subject.subject_courseYearSection);
    }
  });
  return Array.from(programs).sort();
});

// Computed property for filtered subjects
const filteredAndSortedSubjects = computed(() => {
  let result = professorSubject.value;

  // Filter by combined search query
  if (searchQueryCombined.value) {
    const combinedQuery = searchQueryCombined.value.toLowerCase();
    result = result.filter(
      (subject) =>
        subject.subject_name.toLowerCase().includes(combinedQuery) ||
        subject.subject_courseYearSection.toLowerCase().includes(combinedQuery)
    );
  }

  // NEW: Filter by selected program level
  if (selectedFilterProgramLevel.value) {
    result = result.filter(
      (subject) =>
        subject.subject_courseYearSection === selectedFilterProgramLevel.value
    );
  }
  result.sort((a, b) => {
    return b.subject_id - a.subject_id;
  });

  return result;
});
</script>

<style scoped>
.t {
  color: #464646;
  margin-bottom: 35px;

}
.card {
  max-width: 420px;
  height: 269px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
}

.card a {
  text-decoration: underline !important;
  padding-top: 10px;
  cursor: pointer;
  color: #464646 !important;
  transition: 0.3s !important;
  font-size: 17px;
}

.card a:hover {
  color: black !important;
  font-weight: 900;
}
.card .enter-btn {
  color: white;
  border-radius: 8px;
  width: 320px;
  height: 35px;
  background-color: #464646;
  border: #464646 2px solid;
  transition: 0.3s;
}

.card .enter-btn:hover {
  color: black;

  background-color: white;
}
.card .col-2 img {
  width: 60px;
  height: 60px;
}

.card h5 {
  font-family: Outfit-bold;
  /* white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden; */
}
.card h6 img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.card .col-3 img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.card .col-3 img:hover {
  transform: scale(1.3);
}

.desc {
  color: white;
  padding-top: 100px;
}
.scroll-container {
  max-height: 600px;
  overflow-y: auto;
}

.btnsyle {
  background-color: #464646;
  color: white;
  width: 229px;
  height: 50px;
  border-radius: 8px;
  transition: 0.3s ease-in-out;
  border: none;
}

.btnsyle:hover {
  color: black;
  background-color: white;
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


/*
.int-2 {
  display: flex;
  align-items: center;
  background-color: white;
  width: 220px;
  border-radius: 8px;
  gap: 3px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.int-2 input {
  border: none;
}
.int-2 img {
  margin-left: 10px;
  width: 25px;
  height: 25px;
}
*/

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
  border: none !important; /* Change border */
  box-shadow: none !important; /* Add a shadow */
  outline: none !important;
}

.form-select.cus-border {
  border: 1px solid #ced4da;
  border-radius: 0.375rem; /* Bootstrap's default radius */
  padding: 0.375rem 2.25rem 0.375rem 0.75rem; /* Standard Bootstrap padding */
  height: 45px; /* Match height of search input */
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
</style>
