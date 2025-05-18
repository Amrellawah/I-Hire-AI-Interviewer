import { useState, useEffect } from 'react';

const TimerComponent = ({ start = false }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    
    if (start) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [start]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <span className="font-mono">
      {formatTime(time)}
    </span>
  );
};

export default TimerComponent;