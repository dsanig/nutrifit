export interface VagusExercise {
  day: number;
  exercise: string;
  learn: string;
  description?: string;
}

export const vagusExercises: VagusExercise[] = [
  { day: 1, exercise: "Anclaje al entorno", learn: "Anclaje al entorno", description: "Observa 5 cosas que puedas ver, 4 que puedas tocar, 3 que puedas oír, 2 que puedas oler y 1 que puedas saborear." },
  { day: 2, exercise: "Masaje lóbulo auricular", learn: "Nervio vago", description: "Masajea suavemente los lóbulos de tus orejas durante 2-3 minutos para estimular el nervio vago." },
  { day: 3, exercise: "Alimentación consciente", learn: "Alimentación consciente", description: "Come una comida prestando atención plena a cada bocado, texturas, sabores y sensaciones." },
  { day: 4, exercise: "Técnica Havening", learn: "Havening", description: "Acaricia suavemente tus brazos, cara y manos con movimientos lentos para activar la respuesta de calma." },
  { day: 5, exercise: "Masticación consciente", learn: "Masticación", description: "Mastica cada bocado al menos 20-30 veces antes de tragar." },
  { day: 6, exercise: "Descanso activo", learn: "Recuperación", description: "Día de descanso. Pasea al aire libre o haz estiramientos suaves." },
  { day: 7, exercise: "Practica la gratitud", learn: "Eje intestino-cerebro", description: "Escribe 3 cosas por las que estés agradecido/a hoy." },
  { day: 8, exercise: "Respiración 3-3", learn: "Sistema nervioso", description: "Inhala contando hasta 3, exhala contando hasta 3. Repite durante 5 minutos." },
  { day: 9, exercise: "Duchas frías", learn: "Meditación", description: "Termina tu ducha con 30-60 segundos de agua fría para activar el nervio vago." },
  { day: 10, exercise: "Masaje nuca/cervical", learn: "Meditación (atención plena, bondad amorosa, body scan, respiración consciente)", description: "Masajea la zona de la nuca y cervicales durante 5 minutos combinando con respiración profunda." },
  { day: 11, exercise: "Combina técnicas", learn: "Integración", description: "Combina: masaje + respiración + ducha fría por la mañana, mindful eating al mediodía, havening por la tarde." },
  { day: 12, exercise: "Escritura expresiva", learn: "Neuroplasticidad", description: "Escribe libremente durante 10 minutos sobre tus pensamientos y emociones." },
  { day: 13, exercise: "Probar algo nuevo", learn: "Neuroplasticidad", description: "Toma una ruta diferente, prueba una habilidad nueva o cambia tu rutina habitual." },
  { day: 14, exercise: "Masca chicle", learn: "Neurotransmisores", description: "Masca chicle sin azúcar durante 10-15 minutos para estimular el nervio vago a través de la mandíbula." },
  { day: 15, exercise: "Camina 30 min sin móvil", learn: "Estrés", description: "Anda 30 minutos sin el móvil, conectando con la naturaleza y prestando atención al entorno." },
  { day: 16, exercise: "Relajación muscular progresiva", learn: "Hormonas (dopamina, cortisol, melatonina, serotonina, tiroideas, insulina, estrógenos y testosterona)", description: "Tensa y relaja cada grupo muscular durante 10-15 minutos." },
  { day: 17, exercise: "Completa una pequeña tarea", learn: "Cortisol", description: "Elige una tarea pendiente sencilla y termínala. La sensación de logro reduce el cortisol." },
  { day: 18, exercise: "Exposición a la luz solar 15-30 min", learn: "Serotonina", description: "Sal al exterior y exponte a la luz natural durante 15-30 minutos para aumentar la serotonina." },
  { day: 19, exercise: "Alimentos ricos en triptófano", learn: "Dopamina", description: "Incluye en tu dieta: huevo, pavo, frutos secos, semillas y queso." },
  { day: 20, exercise: "Dormir 7-9 horas", learn: "Insulina", description: "Intenta acostarte a una hora fija para conseguir 7-9 horas de sueño." },
  { day: 21, exercise: "Escucha tu música favorita", learn: "Tiroideas", description: "Dedica 15-20 minutos a escuchar música que te haga sentir bien." },
  { day: 22, exercise: "Alimentos ricos en tirosina", learn: "Melatonina", description: "Come almendras, plátano, aguacate, huevo o lácteos para apoyar la producción de neurotransmisores." },
  { day: 23, exercise: "Sin pantallas 2h antes de dormir", learn: "Ciclos del sueño", description: "Apaga pantallas 2 horas antes de acostarte para mejorar la calidad del sueño." },
  { day: 24, exercise: "Baño caliente antes de dormir", learn: "Melatonina", description: "Toma un baño caliente 1-2 horas antes de dormir para favorecer la producción de melatonina." },
  { day: 25, exercise: "Alimentos ricos en melatonina", learn: "Higiene del sueño", description: "Incluye cerezas, nueces y pavo en tu cena." },
  { day: 26, exercise: "Técnica de relajación antes de dormir", learn: "Alteradores del sueño", description: "Practica respiración profunda o meditación guiada antes de dormir." },
  { day: 27, exercise: "Aceite de lavanda antes de dormir", learn: "Hidratación", description: "Aplica unas gotas de aceite esencial de lavanda en la almohada o muñecas." },
  { day: 28, exercise: "Imaginación guiada antes de dormir", learn: "Nutrición y energía", description: "Visualiza un lugar tranquilo y seguro mientras te duermes." },
  { day: 29, exercise: "Movimiento suave + luz solar + respiración", learn: "Entender el bajón del mediodía", description: "Después de comer, pasea a la luz del sol y practica respiración profunda." },
  { day: 30, exercise: "Siesta + alimentos fermentados", learn: "Microbiota intestinal", description: "Descubre tu mejor hora para la siesta. Incorpora yogur, kéfir, chucrut o kimchi." },
];

export const bonusTips: { tip: string; category: string }[] = [
  { tip: "Probióticos: alimentos clave para la salud intestinal", category: "Microbiota" },
  { tip: "Evitar agua durante la comida, mindful eating, masticar bien, horario regular", category: "Mejorar digestión" },
  { tip: "Cómo afecta el estrés a la salud intestinal", category: "Estrés" },
  { tip: "Agua fría en la cara para activar el nervio vago", category: "Nootrópicos" },
  { tip: "Establecer un plan de día sin pantallas o reducción de éstas", category: "Digital detox" },
  { tip: "Reformula un pensamiento negativo", category: "Mentalidad de crecimiento" },
  { tip: "Etiqueta tus emociones para procesarlas mejor", category: "Inteligencia emocional" },
  { tip: "Come sin procesados durante un día", category: "Detox hepático" },
  { tip: "Abre ventanas para que entre aire fresco", category: "Salud inmunitaria" },
  { tip: "Aplica calor y frío alternados cada 10-15 min para el dolor", category: "Alivio del dolor" },
];
