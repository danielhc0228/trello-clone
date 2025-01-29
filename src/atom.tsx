import { atom } from "recoil";

export interface IToDo {
    id: number;
    text: string;
}

interface IToDoState {
    [key: string]: IToDo[];
}

const localStorageKey = "todoLocal";

const loadFromLocalStorage = (): IToDoState => {
    const savedState = localStorage.getItem(localStorageKey);
    return savedState
        ? JSON.parse(savedState)
        : { "To Do": [], Doing: [], Done: [] };
};

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: loadFromLocalStorage(),
    effects_UNSTABLE: [
        ({ onSet }) => {
            onSet((newState) => {
                localStorage.setItem(localStorageKey, JSON.stringify(newState));
            });
        },
    ],
});
