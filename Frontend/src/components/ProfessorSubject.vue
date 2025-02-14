<!-- ProfessorSubject.vue -->
<template>
  <div>
    <button
      class="btnsyle mb-3"
      data-bs-toggle="modal"
      data-bs-target="#addsubject"
    >
      Add Subject
    </button>
    <div
      class="row scroll-container"
      :style="{ width: professorSubject.length <= 2 ? '80vw' : 'auto' }"
    >
      <div
        class="col-md-4 col-sm-6 mt-3"
        v-for="subject in professorSubject"
        :key="subject.subject_id"
      >
        <div class="card h-100">
          <div class="card-body">
            <button
              class="btn btn-dark mar w-100 mb-3"
              @click="enterSession(subject)"
            >
              Enter
            </button>
            <h5 class="card-title mb-3">{{ subject.subject_name }}</h5>

            <h5>Program Level: {{ subject.subject_courseYearSection }}</h5>
            <h6>
              Start Time: {{ formatTime(subject.subject_start_time) }} End Time:
              {{ formatTime(subject.subject_end_time) }}
            </h6>
            <button
              class="btn btn-primary mar"
              data-bs-toggle="modal"
              data-bs-target="#updateSubject"
              @click="setUpdateSubject(subject)"
            >
              Update
            </button>
            <button class="btn btn-danger mar" @click="deleteItem(subject)">
              Delete
            </button>

            <button
              class="btn btn-danger mar w-100 mb-3 d-flex text-center align-item-center justify-content-center"
              style="background-color: #00c04b; border: none"
              @click="enterParticipationRecords(subject)"
            >
              Student Participation Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Subject Modal -->
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

  <!-- Update Subject Modal -->
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
import { ref, provide } from "vue";
import axios from "axios";
import { baseURL } from "../config";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useSubjectData } from "../composables/useSubjectData";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

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
    text: "Are you sure you want to update this Subject?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (confirmationResult.isConfirmed) {
    try {
      console.log("END", currentSubjectEndTime.value);
      console.log("Start", currentSubjectStartTime.value);
      const updatedData = {
        subject_name: updateSubjectName.value || currentSubjectName.value,
        subject_courseYearSection:
          updateSubjectCourseYearSection.value ||
          currentSubjectCourseYearSection.value,
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
        Swal.fire({
          title: "Success",
          text: "Subject name updated successfully",
          icon: "success",
        });

        await fetchSubjects();
        updateSubjectName.value = "";
        updateSubjectCourseYearSection.value = "";
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
        text: "A subject with that name already exist",
        icon: "error",
      });
    }
  }
};

const addSubject = async () => {
  if (
    !subjectName.value ||
    subjectCourseYearSection.value.length === 0 ||
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
        Swal.fire({
          title: "Success",
          text: "Subject Deleted successfully",
          icon: "success",
        });

        await fetchSubjects();
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
    },
  });
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

.scroll-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

.btnsyle {
  background-color: white;
  color: black;
  width: 335px;
  height: 44px;
  border-radius: 30px;
  transition: background-color 0.3s ease-in, color 0.3s ease-in;
}

.btnsyle:hover {
  background-color: gray;
  color: white;
  border-color: white;
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
