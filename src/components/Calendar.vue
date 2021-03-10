<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="mr-4" color="primary" dark @click.stop="dialog = true">
            New Event
          </v-btn>

          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>

          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>

          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>

          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>

              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>

              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>

              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-form @submit.prevent="addEvent" class="add-form">
            <h6 v-if="showAlert == true" class="alert-text">
              *this field is required..!!
            </h6>

            <v-text-field
              solo
              class="transition-text"
              v-model="name"
              type="text"
              label="Event name (required)"
              placeholder="e.g. Birthday"
            ></v-text-field>

            <v-text-field
              solo
              v-model="details"
              class="transition-text"
              type="text"
              label="Detail"
              placeholder="e.g. Dad's B'day"
            ></v-text-field>

            <v-card style="background-color:#efefef">
            <h6 v-if="showAlert == true" class="alert-text">
              *this field is required..!!
            </h6>

            <h6 v-else style="color:#4c4c4c">Start Date-time (required)</h6>

            <div class="space-15"></div>

            <v-text-field
              solo
              v-model="start"
              type="date"
            ></v-text-field>

            <v-time-picker
              class="tpicker"
              format="24hr"
              landscape
              v-model="stime"
            ></v-time-picker>
            </v-card>

            <div class="space"></div>

            <v-card style="background-color:#efefef">

            <h6 v-if="showAlert == true" class="alert-text">
              *this field is required..!!
            </h6>

            <h6 v-else style="color:#4c4c4c">End Date-time(required)</h6>

            <div class="space-15"></div>

            <v-text-field
              solo-inverted
              v-model="end"
              type="date"
              label="end (required)"
            ></v-text-field>

            <v-time-picker
              class="tpicker"
              format="24hr"
              landscape
              v-model="etime"
            ></v-time-picker>
            </v-card>

            <div class="space"></div>

            <h6>
              Picked Color
              <v-tooltip right
                ><template v-slot:activator="{ on, attrs }"
                  ><v-btn
                    v-bind="attrs"
                    v-on="on"
                    height="10px"
                    width="10px"
                    :style="swatchStyle"
                  ></v-btn></template
                ><span>{{ color }}</span></v-tooltip
              >
            </h6>

            <v-color-picker
              hide-mode-switch
              hide-inputs
              class="ma-2"
              canvas-width="100%"
              width="447"
              v-model="color"
              flat
            ></v-color-picker>

            <h6 v-if="showAlert == true" class="alert-text">
              *Event name, start date and start time are required..!!
            </h6>
            <v-btn type="submit" color="primary" class="mr-4">
              Create Event
            </v-btn>
          </v-form>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :now="today"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>

              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>

              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.details }}
              </form>

              <form v-else>
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                  placeholder="Add note"
                >
                </textarea-autosize>
              </form>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Close
              </v-btn>

              <v-btn
                text
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent)"
              >
                Edit
              </v-btn>

              <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "@/main";
export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4Days",
    },
    name: null,
    details: null,
    start: null,
    stime: null,
    end: null,
    etime: null,
    color: "#00FFB7",
    currentlyEditing: null,
    showAlert: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false,
  }),
  mounted() {
    this.getEvents();
  },
  computed: {
    swatchStyle() {
      return {
        backgroundColor: this.color,
      };
    },
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection("calEvent").get();

      const events = [];
      snapshot.forEach((doc) => {
        let appData = doc.data();
        appData.id = doc.id;
        events.push(appData);
      });

      this.events = events;
    },
    async updateEvent(ev) {
      await db.collection("calEvent").doc(this.currentlyEditing).update({
        details: ev.details,
      });
      this.selectedOpen = false;
      this.currentlyEditing = null;
    },
    async deleteEvent(ev) {
      await db.collection("calEvent").doc(ev).delete();
      this.selectedOpen = false;
      this.getEvents();
    },
    async addEvent() {
      if (this.name && this.start && this.end && this.stime && this.etime) {
        await db.collection("calEvent").add({
          name: this.name,
          details: this.details,
          start: this.start + " " + this.stime,
          end: this.end + " " + this.etime,
          color: this.color,
        });
        this.getEvents();
        this.name = "";
        this.details = "";
        this.start = "";
        this.end = "";
        this.etime = "";
        this.stime = "";
        this.color = "#1976D2";
        this.dialog = false;
      } else {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 2000);
      }
    },
    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },
    getEventColor(ev) {
      return ev.color;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
  },
};
</script>

<style scoped>
.add-form {
  padding: 10px;
}
.alert-text {
  color: red;
}
.tpicker {
  margin-top: 0px;
  margin-bottom: 30px;
}
.space {
  height: 30px;
}
.space-15 {
  height: 8px;
}
</style>