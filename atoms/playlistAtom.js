import { atom } from "recoil";

export const playListState = atom({
  key: "playlistState",
  default: null,
});

export const playlistIdState = atom({
  key: "playlistId", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
