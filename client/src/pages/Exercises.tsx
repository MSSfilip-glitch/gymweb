import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";

/**
 * GSZZ Exercises Page
 * Design: Dynamic Athletic Energy
 * - Exercises organized by age categories
 * - Exercise descriptions and images
 * - Difficulty levels
 */

export default function ExercisesPage() {
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};

  const ageCategories = [
    {
      id: "3-5",
      name: "3-5 godina",
      description: "Početne vježbe za najmlađe",
      color: "bg-blue-100 text-blue-900",
      exercises: [
        {
          id: "ex-1",
          name: "Valjanje naprijed",
          description: "Osnovna vježba za razvoj koordinacije i ravnoteže.",
          difficulty: "Lako",
          image: "🤸",
        },
        {
          id: "ex-2",
          name: "Hodanje na rukama",
          description: "Vježba za jačanje ruku i ramena.",
          difficulty: "Lako",
          image: "🤸",
        },
        {
          id: "ex-3",
          name: "Preskakanje",
          description: "Razvoj koordinacije i snage nogu.",
          difficulty: "Lako",
          image: "🤸",
        },
      ],
    },
    {
      id: "6-8",
      name: "6-8 godina",
      description: "Osnovna tehnička obuka",
      color: "bg-green-100 text-green-900",
      exercises: [
        {
          id: "ex-4",
          name: "Kotač (Cartwheel)",
          description: "Osnovna vježba s rukama i nogama.",
          difficulty: "Srednje",
          image: "🤸",
        },
        {
          id: "ex-5",
          name: "Stajanje na rukama",
          description: "Razvoj snage i ravnoteže.",
          difficulty: "Srednje",
          image: "🤸",
        },
        {
          id: "ex-6",
          name: "Skok sa zaletom",
          description: "Tehnička vježba s dinamikom.",
          difficulty: "Srednje",
          image: "🤸",
        },
      ],
    },
    {
      id: "9-11",
      name: "9-11 godina",
      description: "Napredna tehnička obuka",
      color: "bg-yellow-100 text-yellow-900",
      exercises: [
        {
          id: "ex-7",
          name: "Flick-flack (Backflip)",
          description: "Napredna vježba s rotacijom.",
          difficulty: "Teško",
          image: "🤸",
        },
        {
          id: "ex-8",
          name: "Stajanje na rukama s rotacijom",
          description: "Kombinacija ravnoteže i rotacije.",
          difficulty: "Teško",
          image: "🤸",
        },
        {
          id: "ex-9",
          name: "Salto naprijed",
          description: "Osnovna salto vježba.",
          difficulty: "Teško",
          image: "🤸",
        },
      ],
    },
    {
      id: "12+",
      name: "12+ godina",
      description: "Profesionalna tehnička obuka",
      color: "bg-red-100 text-red-900",
      exercises: [
        {
          id: "ex-10",
          name: "Dupli flick-flack",
          description: "Napredna vježba s dvostrukom rotacijom.",
          difficulty: "Vrlo teško",
          image: "🤸",
        },
        {
          id: "ex-11",
          name: "Twisting salto",
          description: "Salto s rotacijom.",
          difficulty: "Vrlo teško",
          image: "🤸",
        },
        {
          id: "ex-12",
          name: "Kombinacijske vježbe",
          description: "Kombinacija više vježbi u nizu.",
          difficulty: "Vrlo teško",
          image: "🤸",
        },
      ],
    },
  ];

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Vježbe"
        description="Program vježbi sportske i ritmičke gimnastike podijeljen po uzrastima i kategorijama."
        keywords="gimnastičke vježbe, program gimnastika, GSZZ vježbe, kadeti, juniori"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-blue-900 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{settings.exercisesPageTitle || "Vježbe po Godinama"}</h1>
          <p className="text-white/80 text-lg whitespace-pre-line">
            {settings.exercisesPageSubtitle || "Otkrijte vježbe prilagođene dobi i razini vještina"}
          </p>
        </div>
      </section>

      {/* Exercises by Age */}
      <section className="py-12">
        <div className="container space-y-12">
          {ageCategories.map((category) => (
            <div key={category.id} className="space-y-6">
              <div className={`p-6 rounded-lg ${category.color}`}>
                <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                <p className="text-sm">{category.description}</p>
              </div>

              <div className="space-y-4">
                {category.exercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="border-border hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => toggleExercise(exercise.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            <span className="text-3xl">{exercise.image}</span>
                            {exercise.name}
                          </CardTitle>
                          <CardDescription className="text-base">
                            Težina: <span className="font-semibold text-secondary">{exercise.difficulty}</span>
                          </CardDescription>
                        </div>
                        <ChevronDown
                          className={`w-6 h-6 text-secondary transition-transform ${
                            expandedExercise === exercise.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </CardHeader>

                    {expandedExercise === exercise.id && (
                      <CardContent className="border-t border-border pt-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-secondary mb-2">Opis:</h4>
                            <p className="text-muted-foreground">{exercise.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-secondary mb-2">Koristi za:</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                              <li>Razvoj koordinacije</li>
                              <li>Jačanje mišića</li>
                              <li>Poboljšanje ravnoteže</li>
                              <li>Tehnička obuka</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-secondary mb-2">Sigurnosne mjere:</h4>
                            <p className="text-muted-foreground">
                              Vježbe trebaju biti izvedene pod nadzorom iskusnog trenera. Koristite zaštitnu opremu.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
