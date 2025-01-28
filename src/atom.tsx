import { atom } from "recoil";
// import { recoilPersist } from "recoil-persist";

export interface IToDo {
    id: number;
    text: string;
}

// const { persistAtom } = recoilPersist({
//     key: "todoLocal",
//     storage: localStorage,
// });

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

// export const toDoState = atom<IToDoState>({
//     key: "toDo",
//     default: {
//         "To Do": [],
//         Doing: [],
//         Done: [],
//     },
//     // effects_UNSTABLE: [persistAtom],
// });
