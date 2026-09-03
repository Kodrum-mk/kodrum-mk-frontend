interface Question {
  question: string;
  answer: string;
  bulletPoints?: string[];
}

const questions: Question[] = [
  {
    question: "Дали нудите приватни часови за студенти на ФИНКИ?",
    answer:
      "Да! Нудиме специјализирани индивидуални (1-на-1) и групни приватни часови за студентите на ФИНКИ за сите најтешки предмети. Часовите се одвиваат во живо во Скопје или онлајн со искусни ментори.",
    bulletPoints: [
      "Структурно и Објектно-ориентирано програмирање (СП / ООП)",
      "Алгоритми и структури на податоци (АПС)",
      "Калкулус 1 и 2 / Дискретна математика",
      "Веб програмирање и Бази на податоци",
    ],
  },
  {
    question: "Зошто Припрема во Кодрум?",
    answer:
      "Во Кодрум се спремаме преку решавање испитни задачи, учење на корисни теми од материјалот, и разни техники и финти за положување на испитот на НАЈЛЕСЕН и НАЈБРЗ начин.",
  },
  {
    question: "Што е различно за Кодрум?",
    answer: "Кодрум нуди различни можности за спремање на испит:",
    bulletPoints: ["Во живо Припреми во Скопје", "Онлајн приватни часови и менторство", "Курсеви со испитни задачи"],
  },
  {
    question: "Како да се пријавам?",
    answer:
      "Пријавувањето е едноставно – пополни ја брзата форма на страницата, пиши ни на Viber/WhatsApp на +389 75 295 582, или контактирај нè преку социјалните мрежи. Наш тим ќе те исконтактира веднаш.",
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
