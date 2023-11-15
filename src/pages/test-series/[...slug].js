import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OPTIONS, SECTIONS, SUBJECTS, formatTime } from "@/lib/CONST";
import client from "@/lib/contentful";
import { cn } from "@/lib/utils";
import { setTest } from "@/redux/reducer/test";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TEST_DURATION = 200;

const TestSeiesById = ({ data, title, sections }) => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubject, setActiveSubject] = useState(SUBJECTS.Physics);
  const [activeSection, setActiveSection] = useState(SECTIONS.sectionA);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [activeSelectedOption, setActiveSelectedOption] = useState("");
  const [testProgress, setTestProgress] = useState({
    attempted: 0,
    skipped: 0,
    markedForReview: 0,
    notVisited: 200,
  });
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION * 60 * 1000);
  const [testData, setTestData] = useState({
    physics: {
      sectionA: {
        questions: sections.physics.sectionA.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
      sectionB: {
        questions: sections.physics.sectionB.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
    },
    chemistry: {
      sectionA: {
        questions: sections.chemistry.sectionA.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
      sectionB: {
        questions: sections.chemistry.sectionB.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
    },
    botany: {
      sectionA: {
        questions: sections.botany.sectionA.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
      sectionB: {
        questions: sections.botany.sectionB.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
    },
    zoology: {
      sectionA: {
        questions: sections.zoology.sectionA.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
      sectionB: {
        questions: sections.zoology.sectionB.fields.questions.map((item) => {
          return {
            questionImage: item.fields.questionImage,
            correctOption: item.fields.correctOption,
            optionSelectedbyUser: "",
            isSkipped: false,
            isMarkedForReview: false,
            isAttempted: false,
          };
        }),
      },
    },
  });

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTimeRemaining = timeRemaining - 1000;
      setTimeRemaining(newTimeRemaining);
    }, 1000);
    if (timeRemaining <= 0) {
      alert("Time's up!");
      window.location.href = "/profile";
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [timeRemaining]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Are you sure you want to leave the test? Your progress will be lost.";
      event.returnValue = message;
      return message;
    };

    const handleKeyPress = (event) => {
      if (event.key === "F5") {
        event.preventDefault();
        const message =
          "Are you sure you want to leave the test? Your progress will be lost.";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("contextmenu", (event) => event.preventDefault());
    // alert on back button click
    window.history.pushState(null, null, window.location.pathname);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    const alert = window.confirm(
      "Are you sure you want to leave the test? Your progress will be lost.",
    );
    if (alert) {
      window.location.href = "/profile";
    } else {
      router.push(`/profile`);
    }
    // alert(
    //   "Are you sure you want to leave the test? Your progress will be lost.",
    // );
  };

  useEffect(() => {
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  const progress = () => {
    let attempted = 0;
    let skipped = 0;
    let markedForReview = 0;
    let notVisited = 0;
    testData.physics.sectionA.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    testData.physics.sectionB.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    testData.chemistry.sectionA.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    testData.chemistry.sectionB.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    testData.botany.sectionA.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    testData.botany.sectionB.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    testData.zoology.sectionA.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    testData.zoology.sectionB.questions.forEach((item) => {
      if (item.isSkipped) {
        skipped += 1;
      }
      if (item.isMarkedForReview) {
        markedForReview += 1;
      }
      if (item.isAttempted) {
        attempted += 1;
      }
      if (!item.isAttempted && !item.isSkipped && !item.isMarkedForReview) {
        notVisited += 1;
      }
    });
    setTestProgress({
      attempted,
      skipped,
      markedForReview,
      notVisited,
    });
    return { attempted, skipped, markedForReview, notVisited };
  };

  const calculateMarks = () => {
    let totalMarks = 0;
    let physicsMarks = 0;
    let chemistryMarks = 0;
    let botanyMarks = 0;
    let zoologyMarks = 0;
    testData.physics.sectionA.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          physicsMarks += 4;
        } else {
          totalMarks -= 1;
          physicsMarks -= 1;
        }
      }
    });
    testData.physics.sectionB.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          physicsMarks += 4;
        } else {
          totalMarks -= 1;
          physicsMarks -= 1;
        }
      }
    });
    testData.chemistry.sectionA.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          chemistryMarks += 4;
        } else {
          totalMarks -= 1;
          chemistryMarks -= 1;
        }
      }
    });
    testData.chemistry.sectionB.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          chemistryMarks += 4;
        } else {
          totalMarks -= 1;
          chemistryMarks -= 1;
        }
      }
    });
    testData.botany.sectionA.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          botanyMarks += 4;
        } else {
          totalMarks -= 1;
          botanyMarks -= 1;
        }
      }
    });
    testData.botany.sectionB.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          botanyMarks += 4;
        } else {
          totalMarks -= 1;
          botanyMarks -= 1;
        }
      }
    });
    testData.zoology.sectionA.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          zoologyMarks += 4;
        } else {
          totalMarks -= 1;
          zoologyMarks -= 1;
        }
      }
    });
    testData.zoology.sectionB.questions.forEach((item) => {
      if (item.isAttempted || item.isMarkedForReview) {
        if (item.optionSelectedbyUser === item.correctOption) {
          totalMarks += 4;
          zoologyMarks += 4;
        } else {
          totalMarks -= 1;
          zoologyMarks -= 1;
        }
      }
    });
    return {
      totalMarks,
      physicsMarks,
      chemistryMarks,
      botanyMarks,
      zoologyMarks,
    };
  };

  const handleOptionsClick = (e) => {
    const { value } = e.target.dataset;
    setActiveSelectedOption(value);
    console.log(value);
    setTestData((prev) => ({
      ...prev,
      [activeSubject]: {
        ...prev[activeSubject],
        [activeSection]: {
          ...prev[activeSubject][activeSection],
          questions: prev[activeSubject][activeSection].questions.map(
            (item, i) => {
              if (i === parseInt(activeQuestion)) {
                return {
                  ...item,
                  optionSelectedbyUser: value,
                  isSkipped: false,
                  isMarkedForReview: false,
                  isAttempted: true,
                };
              }
              return item;
            },
          ),
        },
      },
    }));
  };

  const handleMarkForReview = () => {
    setTestData((prev) => ({
      ...prev,
      [activeSubject]: {
        ...prev[activeSubject],
        [activeSection]: {
          ...prev[activeSubject][activeSection],
          questions: prev[activeSubject][activeSection].questions.map(
            (item, i) => {
              if (i === parseInt(activeQuestion)) {
                return {
                  ...item,
                  isSkipped: false,
                  isMarkedForReview: true,
                  isAttempted: false,
                };
              }
              return item;
            },
          ),
        },
      },
    }));
  };

  const handleClearResponse = () => {
    setTestData((prev) => ({
      ...prev,
      [activeSubject]: {
        ...prev[activeSubject],
        [activeSection]: {
          ...prev[activeSubject][activeSection],
          questions: prev[activeSubject][activeSection].questions.map(
            (item, i) => {
              if (i === parseInt(activeQuestion)) {
                return {
                  ...item,
                  optionSelectedbyUser: "",
                  isSkipped: false,
                  isMarkedForReview: false,
                  isAttempted: false,
                };
              }
              return item;
            },
          ),
        },
      },
    }));
  };

  const handleSkip = () => {
    setTestData((prev) => ({
      ...prev,
      [activeSubject]: {
        ...prev[activeSubject],
        [activeSection]: {
          ...prev[activeSubject][activeSection],
          questions: prev[activeSubject][activeSection].questions.map(
            (item, i) => {
              if (i === parseInt(activeQuestion)) {
                return {
                  ...item,
                  isSkipped: true,
                  isMarkedForReview: false,
                  isAttempted: false,
                };
              }
              return item;
            },
          ),
        },
      },
    }));
  };

  const handleNext = () => {
    setActiveSelectedOption("");
    if (
      !testData[activeSubject][activeSection].questions[activeQuestion]
        .isSkipped &&
      testData[activeSubject][activeSection].questions[activeQuestion]
        .optionSelectedbyUser === "" &&
      !testData[activeSubject][activeSection].questions[activeQuestion]
        .isMarkedForReview
    ) {
      handleSkip();
    }
    if (activeSubject === SUBJECTS.Physics) {
      if (activeSection === SECTIONS.sectionA) {
        if (
          activeQuestion ===
          sections.physics.sectionA.fields.questions.length - 1
        ) {
          setActiveSection(SECTIONS.sectionB);
          setActiveQuestion(0);
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
      if (activeSection === SECTIONS.sectionB) {
        if (
          activeQuestion ===
          sections.physics.sectionB.fields.questions.length - 1
        ) {
          setActiveSubject(SUBJECTS.Chemistry);
          setActiveSection(SECTIONS.sectionA);
          setActiveQuestion(0);
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
    }
    if (activeSubject === SUBJECTS.Chemistry) {
      if (activeSection === SECTIONS.sectionA) {
        if (
          activeQuestion ===
          sections.chemistry.sectionA.fields.questions.length - 1
        ) {
          setActiveSection(SECTIONS.sectionB);
          setActiveQuestion(0);
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
      if (activeSection === SECTIONS.sectionB) {
        if (
          activeQuestion ===
          sections.chemistry.sectionB.fields.questions.length - 1
        ) {
          setActiveSubject(SUBJECTS.Botany);
          setActiveSection(SECTIONS.sectionA);
          setActiveQuestion(0);
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
    }
    if (activeSubject === SUBJECTS.Botany) {
      if (activeSection === SECTIONS.sectionA) {
        if (
          activeQuestion ===
          sections.botany.sectionA.fields.questions.length - 1
        ) {
          setActiveSection(SECTIONS.sectionB);
          setActiveQuestion(0);
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
      if (activeSection === SECTIONS.sectionB) {
        if (
          activeQuestion ===
          sections.botany.sectionB.fields.questions.length - 1
        ) {
          setActiveSubject(SUBJECTS.Zoology);
          setActiveSection(SECTIONS.sectionA);
          setActiveQuestion(0);
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
    }
    if (activeSubject === SUBJECTS.Zoology) {
      if (activeSection === SECTIONS.sectionA) {
        if (
          activeQuestion ===
          sections.zoology.sectionA.fields.questions.length - 1
        ) {
          setActiveSection(SECTIONS.sectionB);
          setActiveQuestion(0);
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
      if (activeSection === SECTIONS.sectionB) {
        if (
          activeQuestion ===
          sections.zoology.sectionB.fields.questions.length - 1
        ) {
          return;
        }
        setActiveQuestion((prev) => prev + 1);
      }
    }
  };

  const handleJumpToQuestion = (e) => {
    const { section, sectionType, question } = e.target.dataset;
    setActiveSubject(section);
    setActiveSection(sectionType);
    setActiveQuestion(parseInt(question));
  };

  const handleSubmit = async () => {
    console.log("submitted");
    const marks = calculateMarks();
    const test_progress = progress();

    try {
      setIsLoading(true);
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          test_id: data.sys.id,
          ...marks,
          ...test_progress,
          timeTaken: TEST_DURATION - timeRemaining / 1000,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        dispatch(setTest(resData.data));
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(testData);
  return (
    <div className="flex flex-row border-b px-10">
      <div className="h-[75vh] max-h-[900px] w-[300px] overflow-y-scroll rounded-xl py-5 pb-10 pr-5">
        <div className="flex flex-col gap-2 p-2">
          <h3 className="font-sora text-xl font-semibold capitalize">
            Physics
          </h3>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections.physics.sectionA.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections.physics.sectionA.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Physics}
                  data-section-type={SECTIONS.sectionA}
                  data-question={i}
                  data-marks={1}
                  onClick={handleJumpToQuestion}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.physics.sectionA.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.physics.sectionA.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.physics.sectionA.questions[i].isMarkedForReview &&
                      "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Physics &&
                      activeSection === SECTIONS.sectionA &&
                      activeQuestion === i &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections.physics.sectionB.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections.physics.sectionB.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Physics}
                  data-section-type={SECTIONS.sectionB}
                  data-question={i}
                  onClick={handleJumpToQuestion}
                  data-marks={2}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.physics.sectionB.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.physics.sectionB.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.physics.sectionB.questions[i].isMarkedForReview &&
                      "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Physics &&
                      activeSection === SECTIONS.sectionB &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2 p-2">
          <h3 className="font-sora text-xl font-semibold capitalize">
            Chemistry
          </h3>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections?.chemistry?.sectionA.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections?.chemistry?.sectionA.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Chemistry}
                  data-section-type={SECTIONS.sectionA}
                  data-question={i}
                  onClick={handleJumpToQuestion}
                  data-marks={1}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.chemistry.sectionA.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.chemistry.sectionA.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.chemistry.sectionA.questions[i]
                      .isMarkedForReview && "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Chemistry &&
                      activeSection === SECTIONS.sectionA &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections.chemistry?.sectionB.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections?.chemistry?.sectionB.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Chemistry}
                  data-section-type={SECTIONS.sectionB}
                  data-question={i}
                  onClick={handleJumpToQuestion}
                  data-marks={2}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.chemistry.sectionB.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.chemistry.sectionB.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.chemistry.sectionB.questions[i]
                      .isMarkedForReview && "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Chemistry &&
                      activeSection === SECTIONS.sectionB &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2 p-2">
          <h3 className="font-sora text-xl font-semibold capitalize">Botany</h3>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections?.botany?.sectionA.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections?.botany?.sectionA.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Botany}
                  data-section-type={SECTIONS.sectionA}
                  data-question={i}
                  onClick={handleJumpToQuestion}
                  data-marks={1}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.botany.sectionA.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.botany.sectionA.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.botany.sectionA.questions[i].isMarkedForReview &&
                      "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Botany &&
                      activeSection === SECTIONS.sectionA &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections.botany?.sectionB.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections?.botany?.sectionB.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Botany}
                  data-section-type={SECTIONS.sectionB}
                  data-question={i}
                  onClick={handleJumpToQuestion}
                  data-marks={2}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.botany.sectionB.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.botany.sectionB.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.botany.sectionB.questions[i].isMarkedForReview &&
                      "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Botany &&
                      activeSection === SECTIONS.sectionB &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2 p-2">
          <h3 className="font-sora text-xl font-semibold capitalize">
            Zoology
          </h3>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections?.zoology?.sectionA.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections?.zoology?.sectionA.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Zoology}
                  data-section-type={SECTIONS.sectionA}
                  data-question={i}
                  onClick={handleJumpToQuestion}
                  data-marks={1}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.zoology.sectionA.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.zoology.sectionA.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.zoology.sectionA.questions[i].isMarkedForReview &&
                      "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Zoology &&
                      activeSection === SECTIONS.sectionA &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <h4 className="font-inter text-sm font-semibold capitalize text-gray-500 ">
            {sections.zoology?.sectionB.fields.sectionName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sections?.zoology?.sectionB.fields.questions.map((_, i) => {
              return (
                <button
                  key={i}
                  data-section={SUBJECTS.Zoology}
                  data-section-type={SECTIONS.sectionB}
                  data-question={i}
                  onClick={handleJumpToQuestion}
                  data-marks={2}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-sm text-black",
                    testData.zoology.sectionB.questions[i].isAttempted &&
                      "bg-green-500 text-white",
                    testData.zoology.sectionB.questions[i].isSkipped &&
                      "bg-rose-500 text-white",
                    testData.zoology.sectionB.questions[i].isMarkedForReview &&
                      "bg-yellow-500 text-white",
                    activeSubject === SUBJECTS.Zoology &&
                      activeSection === SECTIONS.sectionB &&
                      i === activeQuestion &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col items-start justify-between border-l p-5">
        <div>
          {testData &&
            testData[activeSubject][activeSection].questions[activeQuestion]
              .questionImage && (
              <Image
                alt={
                  testData[activeSubject][activeSection].questions[
                    activeQuestion
                  ].questionImage.sys.id
                }
                src={`https:${testData[activeSubject][activeSection].questions[activeQuestion].questionImage.fields.file.url}`}
                width={1000}
                height={1000}
                placeholder="blur"
                blurDataURL={`https:${testData[activeSubject][activeSection].questions[activeQuestion].questionImage.fields.file.url}`}
                priority={true}
                className="h-auto max-h-[225px] min-h-[125px] w-full object-contain"
              />
            )}
          <div className="mt-10 flex flex-row gap-2.5 pl-14">
            {OPTIONS.map((item, i) => {
              return (
                <button
                  key={i}
                  onClick={handleOptionsClick}
                  data-section={activeSubject}
                  data-section-type={activeSection}
                  data-question={activeQuestion}
                  data-value={item.value}
                  className={cn(
                    "flex items-center justify-center rounded-md bg-gray-100 px-5 py-2.5 font-semibold",
                    item.value ===
                      testData[activeSubject][activeSection].questions[
                        activeQuestion
                      ].optionSelectedbyUser && "bg-indigo-600 text-white",
                    item.value === activeSelectedOption &&
                      "bg-indigo-600 text-white",
                  )}
                >
                  ({item.value}) {item.option}
                </button>
              );
            })}
          </div>
          <Dialog>
            <DialogTrigger
              onClick={progress}
              className="absolute right-5 top-5 rounded-3xl bg-black px-5 py-2 font-sora text-sm font-semibold text-white"
            >
              see progress : {formatTime(timeRemaining / 1000)}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Summary</DialogTitle>
                <div className="mt-5 grid grid-cols-2 gap-5 py-5 font-inter">
                  <p className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    <span className="text-black">{testProgress.attempted}</span>{" "}
                    Attempted
                  </p>
                  <p className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    <span className="text-black">{testProgress.skipped}</span>{" "}
                    Skipped
                  </p>
                  <p className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    <span className="text-black">
                      {testProgress.markedForReview}
                    </span>{" "}
                    Marked for Review
                  </p>
                  <p className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    <span className="text-black">
                      {testProgress.notVisited}
                    </span>{" "}
                    Not Visited
                  </p>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-10 flex w-full flex-row flex-wrap justify-between gap-5">
          <div className="flex flex-row flex-wrap gap-5">
            <button
              onClick={handleClearResponse}
              className="flex items-center justify-center rounded-md bg-rose-500 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-rose-600"
            >
              Clear Response
            </button>
            <button
              onClick={handleMarkForReview}
              className="flex items-center justify-center rounded-md bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-yellow-600"
            >
              Mark for Review
            </button>
          </div>
          <div className="flex flex-row flex-wrap gap-5">
            <button
              onClick={() => {
                if (activeQuestion > 0) {
                  setActiveQuestion((prev) => prev - 1);
                }
              }}
              className="flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-indigo-600"
            >
              Previous
            </button>
            {activeSubject === SUBJECTS.Zoology &&
            activeSection === SECTIONS.sectionB &&
            activeQuestion === 14 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-indigo-600"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-indigo-600"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const data = await client.getEntries({
    content_type: "testSeries",
    order: "sys.createdAt",
  });
  const testSeries = data.items;
  //[...slug] generate path for this
  const paths = testSeries.map((item) => {
    const testSeriesName = item.fields.testSeriesName;
    const id = item.sys.id;

    return {
      params: {
        slug: [testSeriesName, id],
      },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx) {
  //get the slug
  const { slug } = ctx.params;
  const title = slug[0];
  const id = slug[1];
  console.log(slug);
  const data = await client.getEntry(slug[1]);

  const physicsSectionA = await client.getEntry(
    data.fields.physics.fields.sectionA.sys.id,
  );
  const physicsSectionB = await client.getEntry(
    data.fields.physics.fields.sectionB.sys.id,
  );

  const chemistrySectionA = await client.getEntry(
    data.fields.chemistry.fields.sectionA.sys.id,
  );

  const chemistrySectionB = await client.getEntry(
    data.fields.chemistry.fields.sectionB.sys.id,
  );

  const botanySectionA = await client.getEntry(
    data.fields.botany.fields.sectionA.sys.id,
  );

  const botanySectionB = await client.getEntry(
    data.fields.botany.fields.sectionB.sys.id,
  );

  const zoologySectionA = await client.getEntry(
    data.fields.zoology.fields.sectionA.sys.id,
  );
  const zoologySectionB = await client.getEntry(
    data.fields.zoology.fields.sectionB.sys.id,
  );
  //   console.log(data);
  //get the data
  return {
    props: {
      data: {
        ...data,
      },
      sections: {
        physics: {
          sectionA: {
            ...physicsSectionA,
          },
          sectionB: {
            ...physicsSectionB,
          },
        },
        chemistry: {
          sectionA: {
            ...chemistrySectionA,
          },
          sectionB: {
            ...chemistrySectionB,
          },
        },
        botany: {
          sectionA: {
            ...botanySectionA,
          },
          sectionB: {
            ...botanySectionB,
          },
        },
        zoology: {
          sectionA: {
            ...zoologySectionA,
          },
          sectionB: {
            ...zoologySectionB,
          },
        },
      },
      title,
    },
    // revalidate: process.env.NODE_ENV === "development" ? 1 : 3600,
  };
}

export default TestSeiesById;