import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useCalendar from "../../hooks/useCalendar";
import sliceTime from "../../utils/sliceTime";
import React from "react";
import { EventInputProps } from "../../assets/types/postType";

interface Props {
  newDate: Date;
  setNewDate: React.Dispatch<React.SetStateAction<Date>>;
  input: EventInputProps;
  setInput: React.Dispatch<React.SetStateAction<EventInputProps>>;
}

const ControlBox = ({ newDate, setNewDate, input, setInput }: Props) => {
  const { Month } = useCalendar();

  const changeYear = (i: number) => {
    const date = new Date(newDate.getTime());
    date.setDate(1);
    date.setFullYear(date.getFullYear() + i);
    setNewDate(date);
  };

  const changeMonth = (i: number) => {
    const date = new Date(newDate.getTime());
    date.setDate(1);
    date.setMonth(date.getMonth() + i);
    setNewDate(date);
  };

  const date = new Date();

  return (
    <div className="flex items-center justify-center gap-5">
      <div className="flex items-center gap-2 text-xl">
        <FontAwesomeIcon
          icon={faAnglesLeft}
          className="cursor-pointer dark:text-white"
          onClick={() => changeYear(-1)}
        />
        <FontAwesomeIcon
          icon={faAngleLeft}
          className="cursor-pointer dark:text-white"
          onClick={() => changeMonth(-1)}
        />
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xl dark:text-white">{Month[newDate.getMonth()]}</p>
        <p className="text-xl dark:text-white">{newDate.getFullYear()}</p>
        <div
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 dark:border-purple-500"
          onClick={() => {
            setNewDate(date);
            setInput({
              ...input,
              date:
                date.getFullYear() +
                "-" +
                sliceTime(date.getMonth() + 1) +
                "-" +
                sliceTime(date.getDate()),
            });
          }}
        >
          <p className="text-purple-500 dark:text-white">{date.getDate()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xl">
        <FontAwesomeIcon
          icon={faAngleRight}
          className="cursor-pointer dark:text-white"
          onClick={() => changeMonth(1)}
        />
        <FontAwesomeIcon
          icon={faAnglesRight}
          className="cursor-pointer dark:text-white"
          onClick={() => changeYear(1)}
        />
      </div>
    </div>
  );
};

export default ControlBox;
