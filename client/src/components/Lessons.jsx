import { useSelector } from 'react-redux';

function Les({ lessons }) {
  const data = useSelector((state) => state.progSlice.data);
  return (
    <div className="container">
      <div className="newcl">
        <div className="lescontainer">
          <div className="titleinf">{data[6]}</div>
          <div className="table">
            <div className="row rheader">
              <div className="cell">{data[8]}</div>
              <div className="cell">{data[7]}</div>
              <div className="cell">{data[9]}</div>
            </div>
            {lessons.map((value) => (
              <div key={value._id} className="row">
                <div className="cell">{value.number}</div>
                <div className="cell">{value.info}</div>
                <div className="cell">{value.hours}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Les;
