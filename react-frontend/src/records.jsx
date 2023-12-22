import { useState, useEffect } from "react";

function Records({ gameOver, records }) {
  const [allRecords, setAllRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BACKEND_URL}/records)`);
      const recs = await response.json();
      setAllRecords(recs);
    };
    fetchData();
  }, [gameOver, records]);

  if (!allRecords.length) {
    return (
      <h2>No records yet</h2>
    )
  }
  return (
    <div className="allRecords">
      <h1 className="recordTitle">Records: </h1>
      {allRecords && allRecords.map(record => (
        <div className="singleRecord" key={record._id}>
          <h2>User: {record.username}</h2>
          <h2>Time: {record.timer}</h2>
        </div>
      ))}
    </div>
  );
}

export default Records;
