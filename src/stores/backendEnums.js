const movementTypes = ["Entrada", "Eixida", "Préstec"];

const loanStates = ["Pendent", "Tornat", "Atrassat"];
const itemCategories = [
  "Pirotècnia",
  "Menjar",
  "Oficina",
  "Arts plàstiques",
  "Beguda",
  "Infraestructura",
  "Electrònica / Informàtica",
  "Altres",
];
const accessTypes = ["Sense càrrec", "Representatiu", "Gestor", "Superusuari"];
const foodNeedTypes = [
  "Vegà",
  "Vegetarià",
  "Celiaquia",
  "Intolerància a la Lactosa",
  "Intorlerància a la fructosa",
  "Histaminia",
  "Al·lèrgia als fruits secs",
  "Al·lèrgia als cacaus",
  "Al·lèrgia als mariscs",
  "Al·lèrgia al peix",
  "Al·lèrgia als ous",
  "Al·lèrgia a la soja",
  "Kosher",
  "Halal",
  "Altra",
];

const otherPaymentTypes = [
  { id: 3, value: "Pagament de quota", name: "Pagament de quota" },
];

const paymentTypes = [
  { id: 1, value: "Venda de tiquet", name: "Venda de tiquet" },
  { id: 2, value: "Bescanvi de tiquet", name: "Bescanvi de tiquet" },
  { id: 3, value: "Pagament de quota", name: "Pagament de quota" },
  { id: 4, value: "Pagament d.abonats", name: "Pagament d'abonats" },
  { id: 5, value: "Pagament de loteria", name: "Pagament de loteria" },
  { id: 6, value: "Pagament de subvenció", name: "Pagament de subvenció" },
  {
    id: 7,
    value: "Pagament de recompensa per premi",
    name: "Pagament de recompensa per premi",
  },
  { id: 8, value: "Pagament d.esdeveniment", name: "Pagament d'esdeveniment" },
  { id: 9, value: "Gasto de manteniment", name: "Gasto de manteniment" },
  { id: 10, value: "Gasto de lloguer", name: "Gasto de lloguer" },
  { id: 11, value: "Gasto administratiu", name: "Gasto administratiu" },
  { id: 12, value: "Gasto de loteria", name: "Gasto de loteria" },
  { id: 13, value: "Gasto de pirotècnia", name: "Gasto de pirotècnia" },
  { id: 14, value: "Gasto de personal", name: "Gasto de personal" },
  {
    id: 15,
    value: "Gasto de material artístic o plàstic",
    name: "Gasto de material artístic o plàstic",
  },
  {
    id: 16,
    value: "Gasto de material d.oficina",
    name: "Gasto de material d'oficina",
  },
  {
    id: 17,
    value: "Gasto informàtic o electrònic",
    name: "Gasto informàtic o electrònic",
  },
  {
    id: 18,
    value: "Gasto de beguda o menjar",
    name: "Gasto de beguda o menjar",
  },
  { id: 19, value: "Gasto d.abonats", name: "Gasto d'abonats" },
  { id: 20, value: "Donació", name: "Donació" },
  { id: 21, value: "Altre gasto", name: "Altre gasto" },
  { id: 22, value: "Altre pagament", name: "Altre pagament" },
];

export {
  movementTypes,
  accessTypes,
  itemCategories,
  loanStates,
  foodNeedTypes,
  paymentTypes,
  otherPaymentTypes,
};
