
const useGetTime = () => {

  const getElapsed = (date, dateCreated) => {
    let timeElapsed = date - dateCreated;
  
    if (( timeElapsed / 1000 ) > 0 && ( timeElapsed / 1000 ) < 60 ){
      timeElapsed = `${ Math.round(timeElapsed / 1000) } secs ago`;
  
    } else if (( timeElapsed / 60000 ) >= 1 && ( timeElapsed / 60000 ) < 60) {
      timeElapsed = `${ Math.round(timeElapsed / 60000) } min ago`;
  
    } else if (( timeElapsed / 3600000 ) >= 1 && ( timeElapsed / 3600000 ) < 24) {
      timeElapsed = `${ Math.round(timeElapsed / 3600000) } hrs ago`;
  
    } else if (( timeElapsed / 86400000 ) >= 1 && ( timeElapsed / 86400000 ) < 7) {
      timeElapsed = `${ Math.round(timeElapsed / 86400000) } days ago`;
  
    } else if (( timeElapsed / 604800000 ) >= 1 && ( timeElapsed / 604800000 ) < 4) {
      timeElapsed = `${ Math.round(timeElapsed / 604800000) } weeks ago`;
  
    } else if (( timeElapsed / 2629746000 ) >= 1 && ( timeElapsed / 2629746000 ) < 12) {
      timeElapsed = `${ Math.round(timeElapsed / 2629746000) } months ago`;
  
    } else if (( timeElapsed / 31556952000 ) >= 1 && ( timeElapsed / 31556952000 ) < 99) {
      timeElapsed = `${ Math.round(timeElapsed / 31556952000) } years ago`;
  
    } else {
      timeElapsed = "error...";
      
    }
  
    return timeElapsed;
  }

  return {
    getElapsed
  }
}

export default useGetTime;