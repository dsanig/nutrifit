// 30 Preguntas del Test de Diagnóstico de Pérdida de Peso

export type QuestionType = 'likert' | 'single' | 'multi' | 'numeric';

export interface QuestionOption {
  value: string | number;
  label: string;
  score?: number;
}

export interface Question {
  id: number;
  category: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  unit?: string;
  helperText?: string;
}

export const likertOptions: QuestionOption[] = [
  { value: 1, label: 'Muy en desacuerdo', score: 1 },
  { value: 2, label: 'En desacuerdo', score: 2 },
  { value: 3, label: 'Neutral', score: 3 },
  { value: 4, label: 'De acuerdo', score: 4 },
  { value: 5, label: 'Muy de acuerdo', score: 5 },
];

export const frequencyOptions: QuestionOption[] = [
  { value: 1, label: 'Nunca', score: 1 },
  { value: 2, label: 'Raramente', score: 2 },
  { value: 3, label: 'A veces', score: 3 },
  { value: 4, label: 'Frecuentemente', score: 4 },
  { value: 5, label: 'Siempre', score: 5 },
];

export const questions: Question[] = [
  // Déficit calórico inconsistente (1-4)
  {
    id: 1,
    category: 'deficit_calorico',
    text: '¿Con qué frecuencia comes más de lo planeado o pierdes el control sobre las porciones?',
    type: 'likert',
    options: frequencyOptions,
  },
  {
    id: 2,
    category: 'deficit_calorico',
    text: '¿Sueles saltarte comidas durante el día para luego comer en exceso?',
    type: 'likert',
    options: frequencyOptions,
  },
  {
    id: 3,
    category: 'deficit_calorico',
    text: '¿Cuántas veces a la semana comes fuera de casa o pides comida a domicilio?',
    type: 'single',
    options: [
      { value: 1, label: '0-1 veces', score: 1 },
      { value: 2, label: '2-3 veces', score: 2 },
      { value: 3, label: '4-5 veces', score: 3 },
      { value: 4, label: '6-7 veces', score: 4 },
      { value: 5, label: 'Más de 7 veces', score: 5 },
    ],
  },
  {
    id: 4,
    category: 'deficit_calorico',
    text: '¿Llevas algún tipo de registro de lo que comes (app, diario, fotos)?',
    type: 'single',
    options: [
      { value: 5, label: 'Nunca', score: 5 },
      { value: 4, label: 'Lo intenté pero lo dejé', score: 4 },
      { value: 3, label: 'Ocasionalmente', score: 3 },
      { value: 2, label: 'La mayoría de días', score: 2 },
      { value: 1, label: 'Siempre', score: 1 },
    ],
  },

  // Saciedad y proteína (5-7)
  {
    id: 5,
    category: 'saciedad_proteina',
    text: '¿Incluyes una fuente de proteína en cada comida principal?',
    type: 'likert',
    options: [
      { value: 5, label: 'Nunca', score: 5 },
      { value: 4, label: 'Raramente', score: 4 },
      { value: 3, label: 'A veces', score: 3 },
      { value: 2, label: 'Frecuentemente', score: 2 },
      { value: 1, label: 'Siempre', score: 1 },
    ],
  },
  {
    id: 6,
    category: 'saciedad_proteina',
    text: '¿Con qué frecuencia sientes hambre entre comidas?',
    type: 'likert',
    options: frequencyOptions,
  },
  {
    id: 7,
    category: 'saciedad_proteina',
    text: '¿Cuántas porciones de verduras y hortalizas comes al día?',
    type: 'single',
    options: [
      { value: 5, label: 'Ninguna', score: 5 },
      { value: 4, label: '1 porción', score: 4 },
      { value: 3, label: '2 porciones', score: 3 },
      { value: 2, label: '3 porciones', score: 2 },
      { value: 1, label: '4 o más porciones', score: 1 },
    ],
  },

  // Ultraprocesados y picoteo (8-11)
  {
    id: 8,
    category: 'ultraprocesados',
    text: '¿Con qué frecuencia consumes alimentos ultraprocesados (bollería, snacks, comida preparada)?',
    type: 'likert',
    options: frequencyOptions,
  },
  {
    id: 9,
    category: 'ultraprocesados',
    text: '¿Picoteas entre horas sin tener hambre real?',
    type: 'likert',
    options: frequencyOptions,
  },
  {
    id: 10,
    category: 'ultraprocesados',
    text: '¿Tienes alimentos "prohibidos" que cuando empiezas no puedes parar?',
    type: 'likert',
    options: likertOptions,
  },
  {
    id: 11,
    category: 'ultraprocesados',
    text: '¿Comes frente a pantallas (TV, móvil, ordenador)?',
    type: 'likert',
    options: frequencyOptions,
  },

  // NEAT y sedentarismo (12-15)
  {
    id: 12,
    category: 'neat_sedentarismo',
    text: '¿Cuántas horas al día pasas sentado/a?',
    type: 'single',
    options: [
      { value: 1, label: 'Menos de 4 horas', score: 1 },
      { value: 2, label: '4-6 horas', score: 2 },
      { value: 3, label: '6-8 horas', score: 3 },
      { value: 4, label: '8-10 horas', score: 4 },
      { value: 5, label: 'Más de 10 horas', score: 5 },
    ],
  },
  {
    id: 13,
    category: 'neat_sedentarismo',
    text: '¿Cuántos pasos das aproximadamente al día?',
    type: 'single',
    options: [
      { value: 5, label: 'Menos de 3.000', score: 5 },
      { value: 4, label: '3.000-5.000', score: 4 },
      { value: 3, label: '5.000-7.500', score: 3 },
      { value: 2, label: '7.500-10.000', score: 2 },
      { value: 1, label: 'Más de 10.000', score: 1 },
    ],
  },
  {
    id: 14,
    category: 'neat_sedentarismo',
    text: '¿Utilizas escaleras en lugar de ascensor cuando es posible?',
    type: 'likert',
    options: [
      { value: 5, label: 'Nunca', score: 5 },
      { value: 4, label: 'Raramente', score: 4 },
      { value: 3, label: 'A veces', score: 3 },
      { value: 2, label: 'Frecuentemente', score: 2 },
      { value: 1, label: 'Siempre', score: 1 },
    ],
  },
  {
    id: 15,
    category: 'neat_sedentarismo',
    text: '¿Realizas pequeños movimientos o pausas activas durante el día?',
    type: 'likert',
    options: [
      { value: 5, label: 'Nunca', score: 5 },
      { value: 4, label: 'Raramente', score: 4 },
      { value: 3, label: 'A veces', score: 3 },
      { value: 2, label: 'Frecuentemente', score: 2 },
      { value: 1, label: 'Siempre', score: 1 },
    ],
  },

  // Entrenamiento de fuerza (16-18)
  {
    id: 16,
    category: 'entrenamiento_fuerza',
    text: '¿Realizas ejercicios de fuerza o resistencia semanalmente?',
    type: 'single',
    options: [
      { value: 5, label: 'Nunca', score: 5 },
      { value: 4, label: '1 vez por semana', score: 4 },
      { value: 3, label: '2 veces por semana', score: 3 },
      { value: 2, label: '3 veces por semana', score: 2 },
      { value: 1, label: '4 o más veces', score: 1 },
    ],
  },
  {
    id: 17,
    category: 'entrenamiento_fuerza',
    text: '¿Sientes que has perdido fuerza o masa muscular en los últimos años?',
    type: 'likert',
    options: likertOptions,
  },
  {
    id: 18,
    category: 'entrenamiento_fuerza',
    text: '¿Realizas principalmente cardio cuando haces ejercicio?',
    type: 'likert',
    options: likertOptions,
  },

  // Sueño y ritmo circadiano (19-21)
  {
    id: 19,
    category: 'sueno',
    text: '¿Cuántas horas duermes habitualmente por noche?',
    type: 'single',
    options: [
      { value: 5, label: 'Menos de 5 horas', score: 5 },
      { value: 4, label: '5-6 horas', score: 4 },
      { value: 3, label: '6-7 horas', score: 3 },
      { value: 2, label: '7-8 horas', score: 2 },
      { value: 1, label: 'Más de 8 horas', score: 1 },
    ],
  },
  {
    id: 20,
    category: 'sueno',
    text: '¿Te despiertas cansado/a aunque hayas dormido suficientes horas?',
    type: 'likert',
    options: frequencyOptions,
  },
  {
    id: 21,
    category: 'sueno',
    text: '¿Tienes horarios irregulares de sueño (diferentes cada día)?',
    type: 'likert',
    options: frequencyOptions,
  },

  // Estrés percibido (22-24)
  {
    id: 22,
    category: 'estres',
    text: '¿Cómo calificarías tu nivel de estrés general?',
    type: 'single',
    options: [
      { value: 1, label: 'Muy bajo', score: 1 },
      { value: 2, label: 'Bajo', score: 2 },
      { value: 3, label: 'Moderado', score: 3 },
      { value: 4, label: 'Alto', score: 4 },
      { value: 5, label: 'Muy alto', score: 5 },
    ],
  },
  {
    id: 23,
    category: 'estres',
    text: '¿Comes más cuando estás estresado/a, ansioso/a o aburrido/a?',
    type: 'likert',
    options: frequencyOptions,
  },
  {
    id: 24,
    category: 'estres',
    text: '¿Tienes técnicas para gestionar el estrés (meditación, ejercicio, hobbies)?',
    type: 'single',
    options: [
      { value: 5, label: 'No, ninguna', score: 5 },
      { value: 4, label: 'Sí, pero no las uso', score: 4 },
      { value: 3, label: 'A veces las uso', score: 3 },
      { value: 2, label: 'Las uso regularmente', score: 2 },
      { value: 1, label: 'Las uso a diario', score: 1 },
    ],
  },

  // Alcohol y calorías líquidas (25-26)
  {
    id: 25,
    category: 'alcohol_liquidas',
    text: '¿Cuántas bebidas alcohólicas consumes a la semana?',
    type: 'single',
    options: [
      { value: 1, label: 'Ninguna', score: 1 },
      { value: 2, label: '1-3 bebidas', score: 2 },
      { value: 3, label: '4-7 bebidas', score: 3 },
      { value: 4, label: '8-14 bebidas', score: 4 },
      { value: 5, label: 'Más de 14 bebidas', score: 5 },
    ],
  },
  {
    id: 26,
    category: 'alcohol_liquidas',
    text: '¿Consumes bebidas azucaradas, zumos o refrescos regularmente?',
    type: 'likert',
    options: frequencyOptions,
  },

  // Adherencia conductual (27-28)
  {
    id: 27,
    category: 'adherencia',
    text: '¿Cuántas dietas o planes de pérdida de peso has intentado en los últimos 5 años?',
    type: 'single',
    options: [
      { value: 1, label: 'Ninguna', score: 1 },
      { value: 2, label: '1-2', score: 2 },
      { value: 3, label: '3-5', score: 3 },
      { value: 4, label: '6-10', score: 4 },
      { value: 5, label: 'Más de 10', score: 5 },
    ],
  },
  {
    id: 28,
    category: 'adherencia',
    text: '¿Tiendes a abandonar los cambios de hábitos después de unas semanas?',
    type: 'likert',
    options: likertOptions,
  },

  // Factores médicos (29-30)
  {
    id: 29,
    category: 'factores_medicos',
    text: '¿Tienes alguna condición médica que pueda afectar tu peso?',
    type: 'multi',
    options: [
      { value: 'ninguna', label: 'Ninguna que yo sepa' },
      { value: 'tiroides', label: 'Problemas de tiroides' },
      { value: 'diabetes', label: 'Diabetes o prediabetes' },
      { value: 'sop', label: 'Síndrome de ovario poliquístico' },
      { value: 'menopausia', label: 'Menopausia o perimenopausia' },
      { value: 'medicacion', label: 'Tomo medicación que puede afectar el peso' },
      { value: 'otra', label: 'Otra condición' },
    ],
  },
  {
    id: 30,
    category: 'factores_medicos',
    text: '¿Has consultado con un médico sobre tu dificultad para perder peso?',
    type: 'single',
    options: [
      { value: 1, label: 'Sí, tengo seguimiento médico', score: 1 },
      { value: 2, label: 'Sí, pero hace tiempo', score: 2 },
      { value: 3, label: 'No, pero planeo hacerlo', score: 3 },
      { value: 4, label: 'No lo considero necesario', score: 4 },
      { value: 5, label: 'No me lo he planteado', score: 5 },
    ],
  },
];

export const categories = {
  deficit_calorico: {
    name: 'Déficit Calórico Inconsistente',
    description: 'Control de porciones y consistencia alimentaria',
  },
  saciedad_proteina: {
    name: 'Saciedad y Proteína',
    description: 'Sensación de saciedad y consumo proteico',
  },
  ultraprocesados: {
    name: 'Ultraprocesados y Picoteo',
    description: 'Consumo de alimentos procesados y hábitos de picoteo',
  },
  neat_sedentarismo: {
    name: 'NEAT y Sedentarismo',
    description: 'Movimiento diario y actividad no planificada',
  },
  entrenamiento_fuerza: {
    name: 'Entrenamiento de Fuerza',
    description: 'Ejercicio de resistencia y masa muscular',
  },
  sueno: {
    name: 'Sueño y Ritmo Circadiano',
    description: 'Calidad y cantidad de sueño',
  },
  estres: {
    name: 'Estrés Percibido',
    description: 'Niveles de estrés y gestión emocional',
  },
  alcohol_liquidas: {
    name: 'Alcohol y Calorías Líquidas',
    description: 'Consumo de bebidas calóricas',
  },
  adherencia: {
    name: 'Adherencia Conductual',
    description: 'Historial de dietas y mantenimiento de hábitos',
  },
  factores_medicos: {
    name: 'Factores Médicos',
    description: 'Condiciones de salud relevantes',
  },
};
