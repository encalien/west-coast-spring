<script lang="ts">
import axios from "axios";
import { DateTime } from "luxon";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RegistrationDTO, TShirt } from "../../dto";

export default {
  data() {
    return {
      registrations: [] as RegistrationDTO[],
      isLoading: true,
      error: "",
      newRegistrationsData: [] as (Pick<
        RegistrationDTO,
        | "id"
        | "attends_city_tour"
        | "attends_competitions"
        | "attends_preparty"
        | "day_trip_status"
        | "t_shirt"
      > & { isTShirtAdded: boolean })[],
      isFormEnabled: false,
      isSubmitting: false,
    };
  },
  methods: {
    async fetchRegistrations() {
      const hash = this.$route.params.hash;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}get-registrations/${hash}`
        );
        this.registrations = response.data;
        console.log("registrations", this.registrations.length);

        if (!this.registrations.length) return;

        this.newRegistrationsData = this.registrations.map((r) => ({
          id: r.id,
          attends_city_tour: r.attends_city_tour,
          attends_competitions: r.attends_competitions,
          attends_preparty: r.attends_preparty,
          day_trip_status: r.day_trip_status,
          t_shirt: r.t_shirt ?? {
            model: "",
            size: undefined,
            quantity: 0,
            price: 0,
          },
          isTShirtAdded: r.t_shirt != null,
        }));
        console.log(2, this.newRegistrationsData[0].id);
      } catch (err) {
        this.error = "Failed to load registrations.";
      } finally {
        this.isLoading = false;
      }
    },
    formatTimestamp(timestamp: string) {
      return DateTime.fromISO(timestamp, { setZone: true }).toFormat(
        "dd.MM.yyyy HH:mm:ss"
      );
    },
    async saveDetails(i: number) {
      this.isSubmitting = true;
      try {
        // Make the API call to update registration
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}update-registration`,
          this.newRegistrationsData[i]
        );
        console.log("success", response.data);
        this.isFormEnabled = false;
      } catch (error) {
        console.log("error", error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  mounted() {
    this.fetchRegistrations();
  },
};
</script>

<template>
  <div>
    <h1>Your Registrations</h1>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else>
      <template v-for="(registration, i) in registrations" :key="{ i }">
        <div class="registration" :class="registration.status.toLowerCase()">
          <div>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.status") }}:
              </span>
              <span class="grid-item important">
                {{ registration.status.toUpperCase() }}
              </span>
            </span>
          </div>
          <div class="registration-details">
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.id") }}:
              </span>
              <span class="grid-item">
                {{ registration.id }}
              </span>
            </span>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.receivedAt") }}:
              </span>
              <span class="grid-item">
                {{ formatTimestamp(registration.received_at) }}
              </span>
            </span>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.name") }}:
              </span>
              <span class="grid-item">
                {{ registration.first_name }} {{ registration.last_name }}
              </span>
            </span>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.email") }}:
              </span>
              <span class="grid-item">
                {{ registration.submitted_email }}
              </span>
            </span>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.country") }}:
              </span>
              <span class="grid-item">
                {{ registration.country }}
              </span>
            </span>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.wsdc") }}:
              </span>
              <span class="grid-item">
                {{ registration.wsdc_number ?? "-" }}
              </span>
            </span>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.role") }}:
              </span>
              <span class="grid-item">
                {{ registration.role }}
              </span>
            </span>
            <span class="grid-container grid-row">
              <span class="grid-item important">
                {{ $t("userProfile.details.passType") }}:
              </span>
              <span class="grid-item">
                {{ registration.pass_type }}
              </span>
            </span>
            <span
              class="grid-container grid-row"
              v-if="registration.pass_type == 'Full pass'"
            >
              <span class="grid-item important">
                {{ $t("userProfile.details.level") }}:
              </span>
              <span class="grid-item">
                {{ registration.level }}
              </span>
            </span>
            <span
              class="grid-container grid-row"
              v-if="registration.price != null"
            >
              <span class="grid-item important">
                {{ $t("userProfile.details.price") }}:
              </span>
              <span class="grid-item">{{ registration.price }} EUR</span>
            </span>
            <span
              class="grid-container grid-row"
              v-if="registration.price != null"
            >
              <span class="grid-item important">
                {{ $t("userProfile.details.paid") }}:
              </span>
              <span class="grid-item">
                <span v-if="registration.paid_amount">
                  {{ registration.paid_amount ?? 0 }} ({{
                    registration.paid_at ?? $t("userProfile.details.notPaid")
                  }})
                </span>
                <span v-else>{{ $t("userProfile.details.notPaid") }}</span>
              </span>
            </span>
          </div>

          <!-- Form with extra services -->
          <form
            @submit.prevent="() => saveDetails(i)"
            class="registration-update-form"
          >
            <!-- Day Trip -->
            <div
              class="grid-container grid-row"
              v-if="registration.pass_type != 'Zero to Hero'"
            >
              <div class="grid-item important">
                {{ $t("userProfile.details.dayTrip.title") }}
              </div>
              <div
                v-if="!isFormEnabled || registration.day_trip_status != null"
                class="grid-item flex-container"
              >
                {{
                  $t(
                    `userProfile.details.dayTrip.status[${
                      registration.day_trip_status ?? 0
                    }]`
                  )
                }}
              </div>
              <fieldset v-else class="grid-item flex-container">
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].day_trip_status"
                    id="dayTripYes"
                    name="dayTrip"
                    :value="1"
                  />
                  <label for="dayTripYes">Yes</label>
                </div>
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].day_trip_status"
                    id="dayTripNo"
                    name="dayTrip"
                    :value="null"
                  />
                  <label for="dayTripNo">No</label>
                </div>
              </fieldset>
            </div>
            <div
              class="grid-item sub-form important"
              style="grid-column: span 2"
              v-if="newRegistrationsData[i].day_trip_status != null"
            >
              {{ $t("userProfile.details.dayTrip.info") }}
            </div>
            <!-- T-shirt -->
            <div class="grid-container grid-row">
              <div class="grid-item important">
                {{ $t("userProfile.details.tShirt.title") }}
              </div>
              <fieldset class="grid-item flex-container">
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].isTShirtAdded"
                    id="tShirtYes"
                    name="tShirt"
                    :value="true"
                    :disabled="!isFormEnabled"
                  />
                  <label for="tShirtYes">Yes</label>
                </div>
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].isTShirtAdded"
                    id="tShirtNo"
                    name="tShirt"
                    :value="false"
                    :disabled="!isFormEnabled"
                  />
                  <label for="tShirtNo">No</label>
                </div>
              </fieldset>
            </div>
            <div
              class="grid-item sub-form important"
              style="grid-column: span 2"
              v-if="newRegistrationsData[i].isTShirtAdded"
            >
              {{ $t("userProfile.details.tShirt.info") }}
            </div>
            <div
              class="grid-container grid-row"
              v-if="newRegistrationsData[i].isTShirtAdded"
            >
              <label class="grid-item sub-form" for="tShirtModel">
                {{ $t("userProfile.details.tShirt.model") }}
              </label>
              <select
                v-model="(newRegistrationsData[i].t_shirt as TShirt).model"
                id="tShirtModel"
                class="grid-item"
                :required="newRegistrationsData[i].isTShirtAdded"
              >
                <option value="">
                  {{ $t("userProfile.details.tShirt.selectModel") }}
                </option>
                <option value="womens">womens</option>
                <option value="mens">mens</option>
              </select>
            </div>
            <div
              class="grid-container grid-row"
              v-if="newRegistrationsData[i].isTShirtAdded"
            >
              <label class="grid-item sub-form" for="tShirtSize">
                {{ $t("userProfile.details.tShirt.size") }}
              </label>
              <select
                v-model="(newRegistrationsData[i].t_shirt as TShirt).size"
                id="tShirtSize"
                class="grid-item"
                :required="newRegistrationsData[i].isTShirtAdded"
              >
                <option :value="undefined">
                  {{ $t("userProfile.details.tShirt.selectSize") }}
                </option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <!-- Competition -->
            <div
              class="grid-container grid-row"
              v-if="registration.pass_type != 'Zero to Hero'"
            >
              <div class="grid-item" for="competition">
                {{ $t("userProfile.details.planToCompete") }}
              </div>
              <fieldset class="grid-item flex-container">
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].attends_competitions"
                    id="compYes"
                    name="competition"
                    :value="true"
                    :disabled="!isFormEnabled"
                    required
                  />
                  <label for="compYes">Yes</label>
                </div>
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].attends_competitions"
                    id="compNo"
                    name="competition"
                    :value="false"
                    :disabled="!isFormEnabled"
                    required
                  />
                  <label for="compNo">No</label>
                </div>
              </fieldset>
            </div>
            <!-- Preparty -->
            <div
              class="grid-container grid-row"
              v-if="registration.pass_type != 'Zero to Hero'"
            >
              <div class="grid-item" for="preparty">
                {{ $t("userProfile.details.planToAttendPreparty") }}
              </div>
              <fieldset class="grid-item flex-container">
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].attends_preparty"
                    id="prepartyYes"
                    name="preparty"
                    :value="true"
                    :disabled="!isFormEnabled"
                    required
                  />
                  <label for="prepartyYes">Yes</label>
                </div>
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].attends_preparty"
                    id="prepartyNo"
                    name="preparty"
                    :value="false"
                    :disabled="!isFormEnabled"
                    required
                  />
                  <label for="prepartyNo">No</label>
                </div>
              </fieldset>
            </div>
            <!-- City Tour -->
            <div class="grid-container grid-row">
              <div class="grid-item">
                {{ $t("userProfile.details.planToAttendCityTour") }}
              </div>
              <fieldset class="grid-item flex-container">
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].attends_city_tour"
                    id="cityTourYes"
                    name="cityTour"
                    :value="true"
                    :disabled="!isFormEnabled"
                    required
                  />
                  <label for="cityTourYes">Yes</label>
                </div>
                <div class="flex-item flex-container">
                  <input
                    type="radio"
                    v-model="newRegistrationsData[i].attends_city_tour"
                    id="cityTourNo"
                    name="cityTour"
                    :value="false"
                    :disabled="!isFormEnabled"
                    required
                  />
                  <label for="cityTourNo">No</label>
                </div>
              </fieldset>
            </div>
            <button
              v-if="isFormEnabled"
              type="submit"
              :disabled="isSubmitting"
              class="btn btn-primary"
            >
              {{ $t("userProfile.details.save") }}
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              @click="isFormEnabled = true"
            >
              {{ $t("userProfile.details.edit") }}
            </button>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.grid-row.grid-container {
  grid-template-columns: 1fr 1fr !important;
  padding: 0;
}

.grid-item {
  padding: 0.6rem 1rem;
}

.grid-item.sub-form {
  padding-left: 2.6rem;
}

.registration {
  margin: auto;
  max-width: 600px;
  border: 3px solid black;
  border-radius: 1rem;
  margin: 1rem auto 2rem;
}

.registration-details {
  padding: 0.5rem 0;
  background-color: var(--white);
  margin-bottom: 3px;
}

.registration-update-form {
  padding: 0.5rem 0;
  width: 100%;
  max-width: none;
  margin: 0;
  background-color: var(--white);
  border-bottom-right-radius: 1rem;
  border-bottom-left-radius: 1rem;
  gap: 0;
}

.flex-container {
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  gap: 1rem;
}

.flex-container > .flex-item {
  flex: 0 0 content;
  padding: 0;
}

.flex-item.flex-container {
  gap: 0.2rem;
}

.grid-item.flex-container {
  justify-content: flex-start;
}

.btn.btn-secondary {
  margin: 0;
  text-transform: none;
  font-size: 16px;
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: 1rem;
  background-color: var(--accepted);
}

.btn.btn-secondary.selected {
  background-color: var(--confirmed);
}

.btn.btn-secondary.close {
  background-color: var(--received);
}

select.grid-item,
input.grid-item {
  margin: 0.5rem 1rem;
  padding: 0.2rem 0.5rem;
  font-size: 16px;
}

fieldset {
  border: none;
}

.important {
  color: var(--black) !important;
}

.received {
  background-color: var(--received);
  border-color: var(--received);
}

.waitlist {
  background-color: var(--waitlist);
  border-color: var(--waitlist);
}

.accepted {
  background-color: var(--accepted);
  border-color: var(--accepted);
}

.confirmed {
  background-color: var(--confirmed);
  border-color: var(--confirmed);
}

.other {
  background-color: var(--other);
  border-color: var(--other);
}
</style>
