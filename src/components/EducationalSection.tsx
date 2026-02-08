// Educational explainer cards
import { HelpCircle, Target, ShieldAlert, BarChart3 } from "lucide-react";

const cards = [
  {
    icon: <HelpCircle size={24} />,
    title: "What is an Asteroid?",
    text: "Asteroids are rocky objects orbiting the Sun, mostly found in the asteroid belt between Mars and Jupiter. They range from a few meters to hundreds of kilometers wide.",
  },
  {
    icon: <Target size={24} />,
    title: "What is a NEO?",
    text: "A Near-Earth Object (NEO) is any asteroid or comet whose orbit brings it within 1.3 AU of the Sun — close enough to potentially approach Earth.",
  },
  {
    icon: <ShieldAlert size={24} />,
    title: 'What does "Hazardous" mean?',
    text: "A Potentially Hazardous Asteroid (PHA) is larger than ~140m and passes within 7.5 million km of Earth's orbit. It doesn't mean an impact is imminent.",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "How is Risk Calculated?",
    text: "Risk considers size, velocity, miss distance, and orbital uncertainty. HIGH risk means a large, close approach; LOW means distant and small.",
  },
];

export function EducationalSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Learn About Asteroids</h2>
        <p className="text-muted-foreground text-sm">Beginner-friendly explanations of key concepts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="glass rounded-xl p-5 space-y-3 animate-fade-in">
            <div className="text-primary">{card.icon}</div>
            <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
