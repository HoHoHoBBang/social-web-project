import ControlBox from "./ControlBox";
import DayList from "./DayList";
import Rightbar from "./Rightbar";
import useCalendar from "../../hooks/useCalendar";
import useEvents from "../../hooks/useEvents";

const Calendar = () => {
  const { newDate, setNewDate, Week, allDay } = useCalendar();
  const {
    allEvent,
    input,
    setInput,
    event,
    colorList,
    deleteHandler,
    cancelHandler,
    submitHandler,
    state,
    dispatch,
  } = useEvents(newDate);

  return (
    <div className="flex h-dvh flex-[8] items-center justify-center dark:bg-black">
      <div className="mt-16 flex h-[80%] w-[90%] flex-col gap-2 rounded-lg p-2 shadow dark:bg-neutral-700 max-sm:h-[85%] max-sm:w-[95%]">
        <div>
          <ControlBox
            newDate={newDate}
            setNewDate={setNewDate}
            input={input}
            setInput={setInput}
          />
        </div>

        <div className="flex h-full w-full overflow-hidden">
          <div
            className={`${state.open ? "flex-[3]" : state.wide ? "flex-[2]" : "flex-none duration-700"} flex h-full w-full flex-col`}
          >
            <div className="grid h-full grid-cols-7">
              {Week.map((data) => (
                <div key={data} className="flex items-center justify-center">
                  <p
                    className={`${data === "Sun" ? "text-red-500" : data === "Sat" ? "text-blue-400" : "text-black dark:text-white"}`}
                  >
                    {data}
                  </p>
                </div>
              ))}
              {allDay.map((data: Date) => (
                <DayList
                  key={data.getTime()}
                  data={data}
                  newDate={newDate}
                  setNewDate={setNewDate}
                  allEvent={allEvent}
                  input={input}
                  setInput={setInput}
                  dispatch={dispatch}
                />
              ))}
            </div>
          </div>

          <div
            className={`${state.open ? "flex-1" : state.wide ? "flex-[2]" : "flex-none scale-x-0"} origin-right duration-500`}
          >
            <Rightbar
              newDate={newDate}
              Week={Week}
              event={event}
              colorList={colorList}
              input={input}
              setInput={setInput}
              deleteHandler={deleteHandler}
              cancelHandler={cancelHandler}
              submitHandler={submitHandler}
              state={state}
              dispatch={dispatch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
