interface Question {
  question: string;
  answer: string;
  bulletPoints?: string[];
}

const questions: Question[] = [
  {
    question: "Зошто Припрема во Кодрум?",
    answer:
      "Во Кодрум се спремаме преку решавање испитни задачи, учење на корисни теми од материјалот, и разни техники и финти за положување на испитот на НАЈЛЕСЕН и НАЈБРЗ начин.",
  },
  {
    question: "Што е различно за Кодрум?",
    answer: "Кодрум нуди различни можности за спремање на испит:",
    bulletPoints: ["Во живо Припреми", "Онлајн Курс за предметот"],
  },
  {
    question: "Како да се пријавам",
    answer:
      "Пријавувањето е едноставно – избери го курсот кој те интересира, кликни на 'Дознај повеќе', пополни ја формата со твоите податоци и наш тим ќе те контактира за следните чекори. Можеш да не контактираш и преку email или телефон.",
  },
];

export function InfoQuestions() {
  return (
    <div data-analytics-section="faq" className="space-y-8">
      {questions.map((item) => (
        <div
          key={item.question}
          className="space-y-3 pb-6 border-b border-[#008081]/15 last:border-b-0"
        >
          <h4 className="text-xl font-bold text-[#1E424A]">{item.question}</h4>
          <p className="text-base text-[#1E424A]/70 leading-relaxed">
            {item.answer}
          </p>
          {item.bulletPoints && (
            <ul className="list-disc list-inside space-y-1 ml-2">
              {item.bulletPoints.map((pt) => (
                <li
                  key={pt}
                  className="text-base text-[#1E424A]/70 leading-relaxed"
                >
                  {pt}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
