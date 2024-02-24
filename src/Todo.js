import { Chart, registerables } from "chart.js";
import { get, ref, update } from 'firebase/database';
import React, { useEffect, useRef, useState } from "react";
import GaugeChart from "react-gauge-chart";
import "./App.css";
import "./firebase"; // Make sure to import your Firebase configuration
import { db } from "./firebase"; // Import your Firebase Realtime Database instance

Chart.register(...registerables);


const Todo = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const temperatureData = useRef([]);
  const [fetchedData, setFetchedData] = useState(null);
  const [fetchedData1, setFetchedData1] = useState(null);
  const [timePeriod, setTimePeriod] = useState("1min");
  const [repeat, setRepeat] = useState(false);
  const [showKkk, setShowKkk] = useState(false);
  const [message, setMessage] = useState("");
  const[Temp,setTemp]=useState();
  const[Temp1,setTemp1]=useState();
  const[Humidity,setHumidity]=useState();
  const[pre,setpre]=useState();

  // Function to format the current time as "12:40 PM"
  const formatCurrentTime = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  };
  
  // Fetch temperature data from Firebase
  const fetchData = async () => {
    let globalpre = null;
    try {
      const dataRef = ref(db);
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        const newTemp = snapshot.val().dis;

         if (2>newTemp) {
          temperatureData.current.push(1000);
          globalpre=100;
        } else if (newTemp<3) {
          temperatureData.current.push(900);
          globalpre=90;
        } else if (newTemp<4) {
          temperatureData.current.push(800);
          globalpre=80;
         
        } else if (newTemp<5) {
          temperatureData.current.push(700);
          globalpre=70;
        } else if (newTemp<6) {
          temperatureData.current.push(600);
          globalpre=60;
        } else if (newTemp<7) {
          temperatureData.current.push(500);
          globalpre=50;
        } else if (newTemp<8) {
          temperatureData.current.push(450);
          globalpre=40;
        }
        else if (newTemp<9) {
          temperatureData.current.push(400);
          globalpre=35;
        }

        else if (newTemp<10) {
          temperatureData.current.push(350);
          globalpre=30;
        }
        else if (newTemp<11) {
          temperatureData.current.push(300);
          globalpre=25;
        }
        else if (newTemp<12) {
          temperatureData.current.push(250);
          globalpre=20;
        }
        else if (newTemp<13) {
          temperatureData.current.push(200);
          globalpre=10;
        }

        else if (newTemp<14) {
          temperatureData.current.push(100);
          globalpre=5;
        }
        else if (newTemp<15) {
          temperatureData.current.push(50);
          globalpre=0;
        }
        else if (newTemp<17) {
          temperatureData.current.push(0);
          globalpre=0;
        }


        setFetchedData(newTemp);
        setpre(globalpre);
        updateChart();
      }
    } catch (error) {
      console.error("Error fetching data from Realtime Database: ", error);
    }
  };

  const fetchData1 = async () => {
    let globalTemp = null;
    let globalTemp1 = null;
    let globalhum = null;
    let tempMessage = "";
    try {
      const dataRef1 = ref(db);
      const snapshot1 = await get(dataRef1);
  
      if (snapshot1.exists()) {
        const newTemp1 = snapshot1.val().Temp;
        setFetchedData1(newTemp1);
        globalTemp=newTemp1;
  
        // Fetch another set of data
        const dataRef2 = ref(db);
        const Snapshot2 = await get(dataRef2); // Replace 'anotherDataRef' with the actual reference to the second data
        if (Snapshot2.exists()) {
          const newTemp2= Snapshot2.val().outtemp;
          // Do something with anotherData if needed

          globalTemp1=newTemp2;

          if(newTemp2<20){
            tempMessage="1500 ML"
          }

          else if(20<newTemp2<30){

            tempMessage="2500 ML"
          }
          else if(31<newTemp2<45){

            tempMessage="3500 ML"
          }
          else if(46<newTemp2<55){

            tempMessage="5000 ML"
          }
          
        }

        const dataRef3 = ref(db);
        const Snapshot3 = await get(dataRef3); // Replace 'anotherDataRef' with the actual reference to the second data
        if (Snapshot3.exists()) {
          const newTemp3= Snapshot3.val().Humidity;
          // Do something with anotherData if needed

          globalhum =newTemp3;
        }
      }

      setTemp(globalTemp);
      setTemp1(globalTemp1);
      setHumidity(globalhum);
      setMessage(tempMessage);
    } catch (error) {
      console.error("Error fetching data from Realtime Database: ", error);
    }
  };
  

  // Update the chart with new data
  const updateChart = () => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = temperatureData.current;
      chartInstance.current.data.labels = temperatureData.current.map((_, index) => {
        const currentTime = new Date();
        currentTime.setMinutes(currentTime.getMinutes() + index);
        return formatCurrentTime(currentTime);
      });
      chartInstance.current.update();
    }
  };

  // Function to periodically check and update Firebase based on time and repeat conditions
  const checkAndUpdateFirebase = async () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const selectedHour = parseInt(timePeriod.split(":")[0]);
    const selectedMinute = parseInt(timePeriod.split(":")[1]);

    const shouldUpdateFirebase = repeat && currentHour === selectedHour && currentMinute === selectedMinute;

    try {
      const dataRef = ref(db);
      await update(dataRef, { Sch: shouldUpdateFirebase ? 1 : 0 });
      setShowKkk(shouldUpdateFirebase);
    } catch (error) {
      console.error("Error updating data in Realtime Database: ", error);
    }
  };

  // Periodically check and update Firebase
  useEffect(() => {
    checkAndUpdateFirebase();
    const timer = setInterval(checkAndUpdateFirebase, 60000);

    return () => clearInterval(timer);
  }, [repeat, timePeriod]);

  // Handle changes to the time period selection
  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  // Initialize the chart
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const mychartref = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(mychartref, {
      type: "line",
      data: {
        labels: temperatureData.current.map((_, index) => {
          const currentTime = new Date();
          currentTime.setMinutes(currentTime.getMinutes() + index);
          return formatCurrentTime(currentTime);
        }),
        datasets: [
          {
            label: "Temperature Data",
            data: temperatureData.current,
            fill: false,
            borderColor: 'black',
            borderWidth: 3,
          },
        ],
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Fetch initial data and set up data update interval
  useEffect(() => {
    fetchData();
    fetchData1();

    const dataUpdateInterval = setInterval(fetchData, 1000);
    const dataUpdateInterval1 = setInterval(fetchData1, 1000);

    return () => {
      clearInterval(dataUpdateInterval);
      clearInterval(dataUpdateInterval1);
    };
  }, []);

  return (
    <div style={{backgroundColor:"lightskyblue"}}>
    <section className="todo" style={{ background: 'linear-gradient(to left, #3498db, #ffffff )' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '-10px' }}>
        <thead>
          <tr>
            <th style={{ border: '0px solid #ddd', padding: '10px' ,paddingRight:'100px',fontSize:"20px"}}>Water percentage of the Bottle</th>
            <th style={{ border: '0px solid #ddd', padding: '8px' }}></th>
            <th style={{ border: '0px solid #ddd', padding: '8px' }}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '0px solid #ddd', padding: '8px' }}>
              <div className="gauge">
              <GaugeChart
                id="gauge-chart"
                nrOfLevels={20}
                percent={pre / 100}
                colors={["#00FF00", "#FFFF00", "#FF0000"]}
                arcWidth={0.3}
                style={{ width: "85%", height: "260px" }}
                textColor="blue"
              /></div>
         <h3 style={{paddingLeft:"104px"}}>Humidity percentage</h3> <br></br>
          <div className="gauge">
              <GaugeChart
                id="gauge-chart"
                nrOfLevels={20}
                percent={Humidity / 100}
                colors={["#00FF00", "#FFFF00", "#FF0000"]}
                arcWidth={0.3}
                style={{ width: "85%", height: "260px" }}
                textColor="blue"
              /></div>
 
 
           
            </td>
            <td style={{ border: '0px solid #ddd', padding: '26px', verticalAlign: 'top' }}>
            <div class="card">
  <div class="card-header">
    <h2>Water Temperature</h2>
  </div>
  <div class="card-body">
   <center> <p id="temperature">{Temp} 'C</p></center>
  </div>
  </div>
  <br></br><br></br><br></br><br></br><br></br><br></br>
  <div class="card">
  <div class="card-header">
    <h2>Today Water Drinking Qty</h2>
  </div>
  <div class="card-body">
   <center> <p id="temperature">{message}</p></center>
  </div>
  </div>

  
            </td>
            <td style={{ border: '0px solid #ddd', padding: '26px', verticalAlign: 'top' }}>
            <div class="card">
  <div class="card-header">
    <h2>Outside Temperature</h2>
  </div>
  <div class="card-body">
    <center><p id="temperature">{Temp1} 'C</p></center>
  </div>
  </div>
  <br></br><br></br><br></br><br></br><br></br><br></br>
  <div class="card">
  <div class="card-header">
    <h2>Water Drinking Remider</h2>
  </div>
 
  <div class="card-body">
  <p style={{ margin: '0' }}>
              <select value={timePeriod} onChange={handleTimePeriodChange} style={{ marginRight: '10px' }}>
                
                <option value="1min">1 Minute</option>
                <option value="1hour">1 Hour</option>
                <option value="30min">30 Minutes</option>
                
              </select>
              <span class="b"><label style={{}}>Repeat</label></span>
               <span class="a"><input
                type="checkbox"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
                
              /></span>

             
              
            </p>
            </div>
            </div>
            </td>
          </tr>

          <tr>
            <td colSpan={3}>
            <div class="card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',width:"700px",height:"750px" }}>
                  <h2 style={{ textAlign: 'center' }}>Water Drink Pattern</h2>
                  <h3>ML</h3>
                  <canvas ref={chartRef} style={{ width: "100%", height: "300px" }}></canvas>
                </div>
            </td>
          </tr>

          
        </tbody>
      </table>
    </section></div>
  );
};

export default Todo;
