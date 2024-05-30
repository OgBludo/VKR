import { useSelector } from 'react-redux';
import Les from './Lessons';

function Disc({ Text, disciplines }) {
  const data = useSelector((state) => state.progSlice.data);
  return (
    <>
      <div className="container">
        <div className="titleinf">{data[2]}</div>

        {disciplines.map((value) => (
          <div key={value._id}>
            <div>
              <div className="inftxt">
                <Text label={data[3]} value={value.index} />
              </div>
              <div className="inftxt">
                <Text label={data[4]} value={value.title} />
              </div>
              <div className="inftxt">
                <Text label={data[5]} value={value.hours} />
              </div>
            </div>
            {<Les lessons={value.lessons} />}
          </div>
        ))}
      </div>
    </>
  );
}

export default Disc;
