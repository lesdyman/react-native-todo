import { Step } from './Step';

export interface Todo {
  key: string;
  text: string;
  color: string;
  done: boolean;
  steps: Step[];
}
