import { useSelector } from 'react-redux';

import Disc from './Disciplines';
import { useParams } from 'react-router-dom';
import PopupForm from './Form';
import axios from '../axios';

import React from 'react';

function Programm() {
  const [element, setDisc] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios.get(`/programms/${id}`).then((res) => {
      setDisc(res.data);
      setLoading(false);
    });
  }, []);
  const data = useSelector((state) => state.progSlice.data);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div className="pr">
          <div className="programms">
            <div className="container">
              <div className="titleinf">
                {data[0]}
                <div> {element.title}</div>
              </div>{' '}
              <div>
                <div className="subtitleinf">{data[1]}</div>
                <div className="inftxt"> {element.info}</div>
              </div>
              <PopupForm />
              {<Disc disciplines={element.disciplines} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Programm;
