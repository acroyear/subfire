import { SubsonicTypes } from "@subfire/core";

export interface IdItemClick {
  (id: string): void
}

export enum LoginStates {
  notLoggedIn = 'notLoggedIn',
  fullyLoggedIn = 'fullyLoggedIn',
  partiallyLoggedIn = 'partiallyLoggedIn' // for when the ping worked, but fetching initial objects failed
}

export interface LoadingCardPropsType {
  object: Partial<SubsonicTypes.Generic>,
  top: number
}
