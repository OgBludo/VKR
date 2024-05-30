import React from 'react';
import '../scss/app.scss';
import Programms from '../components/Programms';
import ScheduleForm from '../components/ScheduleForm.jsx';

function SysAssist() {
  const [active, setActive] = React.useState(0);
  let def = 'sysbtn ';
  let def2 = 'sysbtn rightsbtn ';
  return (
    <>
      <div className="sysform">
        <div className="cont">
          <div className="choose">
            <a>
              <button
                onClick={() => {
                  setActive(0);
                }}
                className={active === 0 ? def + 'active' : def}>
                Программа
              </button>
            </a>
            <a>
              <button
                onClick={() => {
                  setActive(1);
                }}
                className={active === 1 ? def2 + 'active' : def2}>
                Календарь
              </button>
            </a>
          </div>
        </div>
        <div>{active === 0 ? <Programms /> : <ScheduleForm />}</div>
      </div>
    </>
  );
}

export default SysAssist;
