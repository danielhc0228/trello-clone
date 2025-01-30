import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export interface IToDo {
    id: number;
    text: string;
}

export interface IBoard {
    title: string;
    content: IToDo[];
}

interface IToDoState {
    [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "To Do": [],
        Doing: [],
        Done: [],
    },
    effects_UNSTABLE: [persistAtom],
});

// const localStorageKey = "todoLocal";

// const loadFromLocalStorage = (): IToDoState => {
//     const savedState = localStorage.getItem(localStorageKey);
//     return savedState
//         ? JSON.parse(savedState)
//         : { "To Do": [], Doing: [], Done: [] };
// };

// export const toDoState = atom<IToDoState>({
//     key: "toDo",
//     default: loadFromLocalStorage(),
//     effects_UNSTABLE: [
//         ({ onSet }) => {
//             onSet((newState) => {
//                 localStorage.setItem(localStorageKey, JSON.stringify(newState));
//             });
//         },
//     ],
// });
