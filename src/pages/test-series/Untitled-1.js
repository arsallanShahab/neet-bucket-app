${
                    (testData[activeSubject][activeSection].questions[
                      activeQuestion
                    ].optionSelectedbyUser === item.value ||
                      activeSelectedOption == item.value) &&
                    "bg-indigo-600 text-slate-100"
                  }


                  activeSubject === SUBJECTS.Physics &&
                      activeSection === SECTIONS.sectionA &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",



                          setTestData((prev) => ({
      ...prev,
      [activeSubject]: {
        ...prev[activeSubject],
        [activeSection]: {
          ...prev[activeSubject][activeSection],
          questions: prev[activeSubject][activeSection].questions.map(
            (item, i) => {
              if (i === parseInt(activeQuestion)) {
                if (activeSelectedOption === "") {
                  return {
                    ...item,
                    isSkipped: true,
                    isMarked: false,
                  };
                }
                return {
                  ...item,
                  optionSelectedbyUser: activeSelectedOption,
                  isMarked: true,
                  isSkipped: false,
                };
              }
              return item;
            },
          ),
        },
      },
    }));