import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Es esto un diagnóstico médico?",
    answer: "No. Esta herramienta es educativa y está diseñada para ayudarte a identificar hábitos y patrones que pueden estar afectando tu peso. No sustituye el consejo de profesionales sanitarios. Si tienes condiciones médicas, te recomendamos consultar con tu médico.",
  },
  {
    question: "¿Cuánto tiempo dura el test?",
    answer: "El test completo consta de 30 preguntas y suele completarse en 3-5 minutos. Puedes pausarlo y retomarlo cuando quieras.",
  },
  {
    question: "¿Qué incluye el plan personalizado?",
    answer: "El plan incluye un análisis de las causas que frenan tu pérdida de peso, un roadmap por fases, hábitos personalizados, rutinas de movimiento, estrategias nutricionales generales y técnicas de psicología conductual.",
  },
  {
    question: "¿El plan incluye una dieta específica?",
    answer: "No proporcionamos menús diarios ni contamos calorías. Nos enfocamos en principios nutricionales generales, estrategias prácticas y cambios de hábitos sostenibles que puedas mantener a largo plazo.",
  },
  {
    question: "¿Puedo ver parte del plan antes de pagar?",
    answer: "Sí. Ofrecemos un período de prueba de 7 días donde puedes ver un resumen de tu perfil, una causa raíz identificada y un hábito inicial. El plan completo se desbloquea con la suscripción.",
  },
  {
    question: "¿Cómo funciona la suscripción?",
    answer: "Ofrecemos planes de 7 días, 1 mes y 3 meses. Puedes cancelar en cualquier momento. Los reembolsos se gestionan según la política de Stripe y la legislación vigente.",
  },
  {
    question: "¿Qué es el seguimiento premium?",
    answer: "Es un servicio adicional opcional (25€/mes) que incluye informes semanales generados por IA, ajustes automáticos del plan según tu progreso y mensajes motivacionales personalizados.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer: "Sí. Cumplimos con el RGPD. Tus datos se almacenan de forma segura y nunca los compartimos con terceros. Puedes solicitar la eliminación de tus datos en cualquier momento.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Todo lo que necesitas saber antes de empezar
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-xl border-0 shadow-card px-6"
              >
                <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
