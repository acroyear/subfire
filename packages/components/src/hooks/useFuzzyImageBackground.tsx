import { CSSProperties } from "react";
import { createGlobalState } from "react-use";

export type FuzzyBackgroundImageStates = Record<string, CSSProperties>;

export const useFuzzyImageBackgroundStates = createGlobalState<FuzzyBackgroundImageStates>();
export const useFuzzyImageBackgroundState = createGlobalState<string>();
export const useFuzzyImageBackgroundImage = createGlobalState<string>();
