/**
 * https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#Syntax
 */
export enum UiPointerButton {
  Main = 0, // usually the left button or the un-initialized state
  Auxiliary = 1, // usually the wheel button or the middle button (if present)
  Secondary = 2, // usually the right button
  Fourth = 3, // typically the Browser Back button
  Fifth = 4, // typically the Browser Forward button
}
