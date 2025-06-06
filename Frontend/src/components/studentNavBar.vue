<script setup>
import { RouterLink, useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue"; // Import 'watch'
import { Collapse } from "bootstrap";

// Assuming these composables are for clearing student-related data
// You'll need to define these or remove if not applicable to the student side
// import { useSubjectData } from "../composables/useSubjectData";
// import { useShopData } from "../composables/useShopData";
// import { useEventData } from "../composables/useEventData";

// const { clearStateDataProfessor } = useShopData(); // Adjust or remove
// const { clearStateEvent } = useEventData(); // Adjust or remove
// const { clearStateSubject } = useSubjectData(); // Adjust or remove

const router = useRouter();
const route = useRoute();

const activeNavSection = ref("");

// Watch for route changes to determine the active section
watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith("/student/shop")) {
      activeNavSection.value = "incentives";
    } else if (newPath.startsWith("/student/leaderboard")) {
      activeNavSection.value = "leaderboard";
    } else if (newPath.startsWith("/student")) {
      activeNavSection.value = "home";
    } else {
      activeNavSection.value = "";
    }
  },
  { immediate: true }
);

const isActive = (sectionName) => activeNavSection.value === sectionName;

const logout = async () => {
  const result = await Swal.fire({
    title: "Do you want to log out?",
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "No",
  });

  if (result.isConfirmed) {
    localStorage.removeItem("studtoken");
    router.push("/");
  }
};

const navbarCollapse = ref(null);
const navbarToggler = ref(null);
let bsCollapseInstance = null;

const toggleNavbar = () => {
  if (navbarCollapse.value) {
    if (!bsCollapseInstance) {
      bsCollapseInstance = new Collapse(navbarCollapse.value);
    }
    if (navbarCollapse.value.classList.contains("show")) {
      bsCollapseInstance.hide();
    } else {
      navbarCollapse.value.style.backgroundColor = "white";
      bsCollapseInstance.show();
    }
  }
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  if (navbarCollapse.value && !bsCollapseInstance) {
    bsCollapseInstance = new Collapse(navbarCollapse.value, {
      toggle: false,
    });
  }
});

const handleDocumentClick = (event) => {
  if (
    navbarCollapse.value &&
    !navbarCollapse.value.contains(event.target) &&
    navbarToggler.value &&
    !navbarToggler.value.contains(event.target)
  ) {
    if (navbarCollapse.value.classList.contains("show") && bsCollapseInstance) {
      bsCollapseInstance.hide();
    }
  }
};

onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      navbarCollapse.value?.classList.contains("show") &&
      bsCollapseInstance
    ) {
      bsCollapseInstance.hide();
    }
  });
});
</script>

<template>
  <nav class="navbar navbar-expand-lg inv" style="background-color: white">
    <a class="navbar-brand left ml-2" style="color: black">ScanMatic</a>
    <button
      ref="navbarToggler"
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
      @click="toggleNavbar"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" ref="navbarCollapse" id="navbarNav">
      <div class="d-flex justify-content-center w-100">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink
              class="nav-link pointer curr"
              to="/student"
              :class="{ active: isActive('home') }"
              style="color: black"
            >
              Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link pointer curr"
              to="/student/shop"
              :class="{ active: isActive('incentives') }"
              style="color: black"
            >
              Incentives
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link pointer curr"
              to="/student/leaderboard"
              :class="{ active: isActive('leaderboard') }"
              style="color: black"
            >
              Leaderboard
            </RouterLink>
          </li>
        </ul>
      </div>
      <div class="ml-auto mr-2">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a
              class="nav-link pointer curr"
              to="/"
              style="color: red"
              @click="logout"
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-item {
  font-size: 20px !important;
  margin: 25px;
}

.navbar-brand {
  margin-left: 60px;
  font-family: Outfit-Bold;
  font-size: 32px !important;
}

nav {
  height: 80px;
  background-color: white !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 1000;
  width: 100%;
  top: 0;
  font-family: Outfit-regular;
}

.nav-link {
  position: relative;
  color: white;
}

a {
  cursor: pointer;
}
.nav-link::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px; /* Adjust for thickness and spacing */
  width: 0; /* Initially no underline */
  height: 2px; /* Adjust for thickness */
  background-color: black; /* Or your desired underline color */
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::before {
  width: 100%; /* Underline on hover */
}

.nav-link.active {
  font-weight: bold; /* Keep the bold style for active items */
}

.nav-link.active::before {
  width: 100%; /* Keep underline visible for active items */
}

@media (max-width: 992px) {
  .navbar-nav {
    flex-direction: column;
    align-items: center;
  }
  .nav-item {
    margin: 10px;
  }
  .navbar-brand {
    margin-left: 10px;
  }
  .ml-auto,
  .mr-2 {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .navbar-toggler {
    border-color: black; /* Make the hamburger icon visible */
  }
  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(0, 0, 0, 0.5)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }
  .collapse {
    background-color: white; /* Ensure a background color for visibility */
    position: fixed; /* Make it stick to the viewport */
    top: 80px; /* Position it below the main navbar (adjust if your navbar height changes) */
    left: 0;
    right: 0;
    z-index: 1000; /* Ensure it's above other content */
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: Add a subtle shadow */
    height: auto !important; /* Allow it to expand */
    max-height: 80vh; /* Limit its maximum height to prevent it from covering the whole screen */
    overflow-y: auto; /* Enable scrolling within the fixed menu */
    visibility: hidden; /* Initially hidden */
    opacity: 0; /* Initially transparent */
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  }
  .collapse.show {
    visibility: visible;
    opacity: 1;
  }
  .collapse:not(.show) {
    height: 0 !important; /* Ensure it collapses properly */
  }
}
</style>
