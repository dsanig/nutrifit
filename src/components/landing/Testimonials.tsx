import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "María G.",
    location: "Madrid",
    text: "Después de años probando dietas, por fin entendí por qué no funcionaban. El plan me ayudó a cambiar mis hábitos de forma gradual y sostenible.",
    rating: 5,
    result: "-8 kg en 3 meses",
  },
  {
    name: "Carlos R.",
    location: "Barcelona",
    text: "Lo que más me gustó fue que no es una dieta restrictiva. Aprendí a comer mejor sin pasar hambre y a moverme más sin ir al gimnasio.",
    rating: 5,
    result: "-12 kg en 4 meses",
  },
  {
    name: "Ana P.",
    location: "Valencia",
    text: "El test identificó que mi problema principal era el estrés y el sueño. Nadie me había hablado de eso antes. Ahora duermo mejor y como menos por ansiedad.",
    rating: 5,
    result: "-6 kg en 2 meses",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-muted-foreground text-lg">
            Miles de personas ya han descubierto por qué no perdían peso
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            * Testimonios ilustrativos. Los resultados individuales pueden variar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-card bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                
                <p className="text-foreground text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">
                    {testimonial.result}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
