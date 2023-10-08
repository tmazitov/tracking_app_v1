<template>
  <ion-toast
    :is-open="data.orderCreatedIsOpen"
    message="Заказ успешно создан!"
    :duration="5000"
    layout="stacked"
    color="success"
    :icon="checkmarkCircleOutline"
  >
  </ion-toast>

  <transition name="modal">
    <div class="order_create_form" v-if="isOpen">
      <CreateOrderBillModal
        v-if="data.priceList"
        :isOpen="data.billIsOpen"
        :closer="closeBill"
        :form="form.values"
        :submit="orderSubmit"
        :priceList="data.priceList"
      />

      <div class="form">
        <div class="form__header">
          <div class="header__go-back" @click="close()">
            <ion-icon :icon="arrowBackOutline"></ion-icon>
          </div>
          <div class="header__title">Создать заказ</div>
        </div>

        <div class="form__tabs">
          <div
            class="form__tab"
            @click="() => selectTab(0)"
            v-bind:class="{
              selected: data.selectedTab == 0,
            }"
          >
            Инфо
          </div>
          <div
            class="form__tab"
            @click="() => selectTab(1)"
            v-bind:class="{
              selected: data.selectedTab == 1,
            }"
          >
            Точки - {{ form.values.points.length }}
          </div>
        </div>

        <div class="form__tabs-content">
          <div class="form__page-1" v-if="data.selectedTab == 0">
            <div class="form__datetime-title">
              <!-- Datetime -->

              <div class="form__datetime">
                <div class="datetime__date">
                  <ion-input
                    v-model="fields.date.value"
                    type="date"
                    name="date"
                    id="date"
                    :color="form.errors.value['title'] ? 'danger' : 'primary'"
                    label="Дата"
                    label-placement="floating"
                    fill="solid"
                  >
                  </ion-input>

                  <ion-input
                    type="time"
                    v-model="fields.start.value"
                    name="start"
                    @ionInput="onTimeInput"
                    ref="inputTimeRef"
                    :color="form.errors.value['title'] ? 'danger' : 'primary'"
                    label="Начало"
                    label-placement="floating"
                    fill="solid"
                  >
                  </ion-input>
                </div>

                <ion-text v-if="form.errors.value.date" color="danger">
                  {{ form.errors.value.date }}
                </ion-text>
                <ion-text v-if="form.errors.value.start" color="danger">
                  {{ form.errors.value.start }}
                </ion-text>

                <RNumberInput
                  inputType="hour"
                  label-placement="floating"
                  fill="solid"
                  label="Часы работы"
                  v-model:value="fields.duration.value"
                  :step="1"
                  :min="2"
                  :max="1000"
                />
              </div>

              <ion-text v-if="form.errors.value.duration" color="danger">
                {{ form.errors.value.duration }}
              </ion-text>

              <!-- Title -->

              <div class="form__title-container">
                <ion-input
                  type="text"
                  v-model="fields.title.value"
                  name="title"
                  :color="form.errors.value['title'] ? 'danger' : 'primary'"
                  label="Название заказа"
                  fill="solid"
                  label-placement="floating"
                  placeholder="По умолчанию адрес первой точки"
                >
                </ion-input>
              </div>

              <ion-text v-if="form.errors.value.title" color="danger">
                {{ form.errors.value.title }}
              </ion-text>
            </div>

            <!-- Comment -->

            <div class="form__comment-container">
              <ion-textarea
                name="comment"
                label="Комментарий заказа"
                labelPlacement="floating"
                fill="solid"
                v-model="fields.comment.value"
              >
              </ion-textarea>
            </div>

            <RSelector
              v-model:current-item="fields.currentOrderType.value"
              :items="orderTypes"
              :selector="selectOrderType"
              :label="'Тип заказа'"
              :multiple="true"
            />

            <ion-text v-if="form.errors.value.currentOrderType" color="danger">
              {{ form.errors.value.currentOrderType }}
            </ion-text>

            <!-- Is Regular customer -->
            <ion-checkbox labelPlacement="end" v-model="fields.isRegularCustomer.value"
              >Постоянный клиент</ion-checkbox
            >

            <!-- Make the table of worker business -->
          </div>
          <div class="form__page-2" v-if="data.selectedTab == 1">
            <OrderPointsMap
              v-model:points="form.values.points"
              v-model:wayHours="fields.duration.value"
              v-model:km-count="form.values.price.kmCount"
            />
          </div>
        </div>

        <div class="form__submit-container" v-if="data.selectedTab == 0">
          <ion-text
            v-if="form.errors.value.points && data.submitIsTouched"
            color="danger"
          >
            {{ form.errors.value.points }}
          </ion-text>
          <ion-button @click="openBill">Создать</ion-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import OrderPointsMap from "../../map/OrderPointsMap.vue";
import CreateOrderBillModal from "../../modal/CreateOrderBillModal.vue";
import {
  IonTitle,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonCheckbox,
  IonButton,
  IonRippleEffect,
  IonToast,
  IonText,
} from "@ionic/vue";
import {
  add,
  arrowBackOutline,
  checkmarkCircleOutline,
  key,
  remove,
} from "ionicons/icons";
import { ComputedRef, computed, reactive, ref, watch } from "vue";
import RSelector from "../../inputs/RSelector.vue";
import TMS from "@/api/tms";
import { UTCString } from "@/assets/data";
import "./tabs.css";
import { useStore } from "vuex";
import { isEqual, yyyymmdd } from "@/assets/date";
import OrderCreateForm from "./instanse";
import Order from "@/assets/order";
import OrderPriceList from "@/assets/orderPriceList";
import RNumberInput from "@/components/inputs/RNumberInput.vue";
import StaffWorkTime from "@/assets/staffWorkTime";
// import * as yup from "yup"

import {
  FieldContext,
  FormValidationResult,
  ValidationResult,
  useField,
  useForm,
} from "vee-validate";

interface IOrderStorage {
  orders: Array<Order>;
}

interface IOrderCreateFields {
  title: FieldContext<string>;
  date: FieldContext<string>;
  start: FieldContext<string>;
  duration: FieldContext<number>;
  comment: FieldContext<string>;
  currentOrderType: FieldContext<Array<number>>;
  isRegularCustomer: FieldContext<boolean>;
}

export default {
  name: "OrderCreateForm",
  components: {
    OrderPointsMap,
    IonTitle,
    IonInput,
    IonToast,
    IonText,
    IonTextarea,
    IonIcon,
    IonCheckbox,
    RSelector,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonRippleEffect,
    RNumberInput,
    CreateOrderBillModal,
  },

  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    closer: {
      type: Function,
      required: true,
    },
    date: {
      type: Date,
    },
    storage: {
      type: Object as () => IOrderStorage,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const inputTimeRef = ref();
    const data = reactive<{
      billIsOpen: boolean;
      submitIsTouched: boolean;
      selectedTab: number;
      orderCreatedIsOpen: boolean;
      priceList: OrderPriceList | null;
      staffWorkTime: StaffWorkTime | null;
      defaultDuration: number;
    }>({
      priceList: null,
      selectedTab: 0,
      billIsOpen: false,
      submitIsTouched: false,
      staffWorkTime: null,
      orderCreatedIsOpen: false,
      defaultDuration: 2,
    });

    let form = useForm<OrderCreateForm>({
      validationSchema: OrderCreateForm.schema(),
      initialValues: new OrderCreateForm(),
    });
    form.handleSubmit((data) => {
      console.log("data :>> ", data);
    });

    let fields: IOrderCreateFields = {
      title: useField("title"),
      date: useField("date"),
      start: useField("start"),
      duration: useField("duration"),
      comment: useField("comment"),
      currentOrderType: useField("currentOrderType"),
      isRegularCustomer: useField("isRegularCustomer"),
    };
    if (props.date) {
      fields.date.setValue(yyyymmdd(props.date));
      watch(
        () => props.date,
        () => {
          if (!props.date) return;
          fields.date.setValue(yyyymmdd(props.date));
        }
      );
    }

    const isOpen = computed(() => {
      let isOpen = props.isOpen;
      if (isOpen) {
        TMS.order()
          .priceList()
          .then((response) => {
            if (!response.data) return;
            if (response.data.err) throw response.data.err;

            data.priceList = new OrderPriceList(response.data);
            fields.duration.setValue(data.priceList.bigCarTime);
          });
        TMS.user()
          .getStaffWorkTime()
          .then((response) => {
            if (!response.data) return;
            if (response.data.err) throw response.data.err;

            data.staffWorkTime = new StaffWorkTime(response.data);
            fields.start.setValue(data.staffWorkTime.startAt);
          });
      }
      return isOpen;
    });
    const workers = computed(() => store.getters.staffWorkers);
    const selectOrderType = (orderType: Array<number>) =>
      fields.currentOrderType.setValue(orderType);

    const orderTypes = [
      { value: 1, title: "Город" },
      { value: 2, title: "Пригород" },
      { value: 4, title: "Меж. город" },
    ];

    const selectTab = (index: number) => (data.selectedTab = index);

    const openBill = () => {
      data.submitIsTouched = true;
      form.validate().then((result: FormValidationResult<OrderCreateForm>) => {
        if (result.valid) {
          data.billIsOpen = true;
        }
      });
    };
    const closeBill = () => (data.billIsOpen = false);

    const openCreatedOrder = () => (data.orderCreatedIsOpen = true);
    const closeCreatedOrder = () => (data.orderCreatedIsOpen = false);

    const onTimeInput = (ev: CustomEvent) => {
      if (!data.staffWorkTime) return;
      let value: string = ev.detail.value;

      let isIncluded = data.staffWorkTime.includes(value);
      if (isIncluded == -1) {
        inputTimeRef.value.$el.value = data.staffWorkTime.startAt;
        fields.start.setValue(data.staffWorkTime.startAt);
      } else if (isIncluded == 1) {
        inputTimeRef.value.$el.value = data.staffWorkTime.endAt;
        fields.start.setValue(data.staffWorkTime.endAt);
      }
    };

    const orderSubmit = () => {
      let values = form.values;

      let startDate = new Date(values.date + " " + values.start);

      let endDate = new Date(startDate.getTime());
      endDate.setHours(startDate.getHours() + values.duration);

      TMS.order()
        .create({
          title: values.title,
          startAt: UTCString(startDate),
          endAt: UTCString(endDate),
          points: values.points,
          workerId: values.currentWorkerId,
          orderType: values.currentOrderType.reduce((a, b) => a + b),
          comment: values.comment,
          isRegularCustomer: values.isRegularCustomer,
          price: values.price,
        })
        .then((response) => {
          if (response.data && response.data["err"]) throw response.data["err"];

          let order: Order = new Order(response.data);
          let date: Date | undefined = props.date;
          if (date && isEqual(order.startAt, date)) {
            props.storage.orders.push(order);
          }

          closeBill();
          props.closer();
          setTimeout(() => {
            openCreatedOrder();
            setTimeout(() => {
              closeCreatedOrder();
            }, 5000);
          }, 500);
        });
    };

    return {
      remove,
      isOpen,
      close: props.closer,
      add,
      data,
      form,
      workers,
      orderTypes,
      inputTimeRef,
      selectTab,
      orderSubmit,
      selectOrderType,
      arrowBackOutline,
      onTimeInput,
      fields: {
        title: fields.title.value,
        date: fields.date.value,
        start: fields.start.value,
        duration: fields.duration.value,
        comment: fields.comment.value,
        currentOrderType: fields.currentOrderType.value,
        isRegularCustomer: fields.isRegularCustomer.value,
      },
      openBill,
      closeBill,
      closeCreatedOrder,
      checkmarkCircleOutline,
    };
  },
};
</script>

<style lang="css" scoped>
@import url(../../../theme/variables.css);



.form__header {
  font-size: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.header__title {
  font-size: 24px;
}

.form__header > * {
  display: flex;
  align-items: center;
}

.order_create_form {
  height: 100%;
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  left: 0;
  background: white;
}

@media (prefers-color-scheme: dark) {
  .order_create_form{
    background: var(--ion-background-color);
  }
}
.form {
  height: 100%;
  width: 100%;
  min-width: 350px;
  max-width: 640px;

  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form__datetime-title {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form__datetime {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.datetime__date {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.datetime__duration {
  display: grid;
  grid-template-columns: calc(100% - 16px - 56px - 16px - 56px) 56px 56px;
  grid-column-gap: 16px;
}

@media (max-width: 768px) {
  .form {
    width: 100vw;
  }

  .form__tabs-content {
    height: 100%;
    overflow: auto;
  }

  .from__order-type {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

@media (min-width: 768px) {
  .form {
    width: 60vw;
    background: var(--ion-color-step-100);
    border-radius: 4px;
    height: 100%;
    gap: 0;
  }

  .form__datetime {
    flex-direction: row;
  }

  .order_create_form {
    padding: 50px 0;
    height: 100%;
  }
  .form__tabs-content {
    height: 100%;
    padding: 20px;
  }

  .from__order-type {
    display: grid;
    grid-template-columns: calc(50% - 8px) calc(50% - 8px);
    grid-column-gap: 16px;
  }
}

.form__page-3 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form__time {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.form__page-1 {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form__tabs-content {
  overflow-y: auto;
}

ion-checkbox::part(container) {
  border-radius: 6px;
  border: 2px solid var(--ion-color-primary);
}

ion-checkbox {
  width: fit-content;
}

.form__submit-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form__submit-container > ion-button {
  width: 100%;
}

.form__helpers {
  display: grid;
  grid-template-columns: calc(100% - 16px - 56px - 16px - 56px) 56px 56px;
  grid-column-gap: 16px;
}

.form__helpers-button {
  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--ion-color-step-50, #f2f2f2);
  border-radius: 4px;

  width: 56px;
  height: 56px;
  cursor: pointer;
}

.ripple-parent {
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  user-select: none;
}

.modal-enter-active {
  animation: 0.45s modal cubic-bezier(0.76, 0.03, 0.54, 0.96);
}
.modal-leave-active {
  animation: 0.45s modal reverse cubic-bezier(0.76, 0.03, 0.54, 0.96);
}

@keyframes modal {
  from {
    left: 100vw;
  }
  to {
    left: 0;
  }
}
</style>
