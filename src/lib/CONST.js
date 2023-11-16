export const SUBJECTS = Object.freeze({
  Physics: "physics",
  Chemistry: "chemistry",
  Botany: "botany",
  Zoology: "zoology",
});

export const SECTIONS = Object.freeze({
  sectionA: "sectionA",
  sectionB: "sectionB",
});

export const OPTIONS = [
  { option: "1", value: "A" },
  { option: "2", value: "B" },
  { option: "3", value: "C" },
  { option: "4", value: "D" },
];

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
};

export const PROFILE_TABS = Object.freeze({
  Profile: "profile",
  Softcopy: "softcopy",
  Hardcopy: "hardcopy",
  TestSeries: "test-series",
  Account: "account",
});
