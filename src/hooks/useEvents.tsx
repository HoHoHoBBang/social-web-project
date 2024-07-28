import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { db } from "../firebase/firebase";
import { AuthContext } from "../contexts/authContext";
import { v4 as uuid } from "uuid";
import getTime from "../utils/getTime";
import sliceTime from "../utils/sliceTime";
import {
  EventColorListProps,
  EventInputProps,
  EventReducerActionType,
  EventReducerInitialStateProps,
} from "../assets/types/postType";

const useEvents = (newDate: Date) => {
  const colorList: EventColorListProps[] = [
    { color: "bg-red-300", name: "red" },
    { color: "bg-orange-300", name: "orange" },
    { color: "bg-yellow-300", name: "yellow" },
    { color: "bg-green-300", name: "green" },
    { color: "bg-blue-300", name: "blue" },
    { color: "bg-purple-300", name: "purple" },
  ];

  const initialState: EventReducerInitialStateProps = {
    open: false,
    wide: false,
  };

  const eventReducer = (
    state: EventReducerInitialStateProps,
    action: EventReducerActionType,
  ) => {
    switch (action.type) {
      case "OPEN":
        return { open: true };
      case "WIDE":
        return { wide: true };
      case "INITIAL":
        return { open: false, wide: false };
      default:
        return state;
    }
  };

  const { currentUser } = useContext(AuthContext);
  const [event, setEvent] = useState<EventInputProps[]>([]);
  const [allEvent, setAllEvent] = useState<EventInputProps[]>([]);
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const { eventDate: todayEventDate } = getTime(new Date());

  const yyyy = newDate.getFullYear();
  const mm = newDate.getMonth() + 1;
  const dd = newDate.getDate();

  const eventDate = yyyy + "-" + sliceTime(mm) + "-" + sliceTime(dd);

  const [input, setInput] = useState<EventInputProps>({
    title: "",
    description: "",
    date: "",
    color: colorList[0].color,
    createdAt: 0,
    id: "",
  });

  useEffect(() => {
    if (currentUser) {
      const unsub = onSnapshot(doc(db, "events", currentUser.uid), (doc) => {
        const eventsList: EventInputProps[] = [];

        if (doc.exists()) {
          const eventsData = doc.data().event;
          setAllEvent(eventsData);

          eventsData.forEach((data: EventInputProps) => {
            if (data.date === eventDate) {
              eventsList.push(data);
            }
          });
        }
        setEvent(eventsList);
      });

      return () => unsub();
    }
  }, [currentUser, eventDate]);

  const deleteHandler = async (data: EventInputProps) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "events", currentUser.uid), {
        event: arrayRemove(data),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelHandler = () => {
    setInput({
      title: "",
      description: "",
      date: eventDate,
      color: colorList[0].color,
      createdAt: 0,
      id: "",
    });
  };

  const submitHandler = async () => {
    if (!currentUser) return;

    if (input.title.trim() !== "" && input.date !== "") {
      const createdAt = Date.now();
      const id = uuid();

      setInput({ ...input, createdAt, id });

      try {
        await updateDoc(doc(db, "events", currentUser.uid), {
          event: arrayUnion({ ...input, createdAt, id }),
        });
      } catch (error) {
        console.log(error);
      }
    }

    setInput({
      title: "",
      description: "",
      date: eventDate,
      color: colorList[0].color,
      createdAt: 0,
      id: "",
    });
  };

  const todayEvents = () => {
    const todayEvent: EventInputProps[] = [];

    allEvent.map((event) => {
      if (event.date === todayEventDate) {
        todayEvent.push(event);
      }
    });

    return todayEvent;
  };

  return {
    event,
    allEvent,
    colorList,
    state,
    dispatch,
    input,
    setInput,
    deleteHandler,
    cancelHandler,
    submitHandler,
    todayEvents,
  };
};

export default useEvents;
