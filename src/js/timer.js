const refs = {
  body: document.querySelector('body'),
  data: document.querySelector('[data-value="data"]'),
  start: document.querySelector('[data-action="start"]'),
  timerBox: document.querySelector('.timer__box'),
  formBox: document.querySelector('.form-box'),
};

class CountdownTimer {
  constructor(setTime) {
    const selector = setTime.selector;
    const time = setTime.targetDate.getTime();
    const timerRefs = {
      days: document.querySelector(`${selector}`).querySelector('[data-value="days"]'),
      hours: document.querySelector(`${selector}`).querySelector('[data-value="hours"]'),
      mins: document.querySelector(`${selector}`).querySelector('[data-value="mins"]'),
      secs: document.querySelector(`${selector}`).querySelector('[data-value="secs"]'),
    };
    let started = false; //started timer
    let timerId = null;
    let changeTime = null;
    const oldvalues = {};
    function start() {
      if (!started) {
        timerId = setInterval(newValue, 1000);
        started = true;
        return;
      }
    }

    const observer = new MutationObserver(e => console.log(e));
    function newValue() {
      if (Date.now() < time) {
        changeTime = time - Date.now();
        // console.log(changeTime); //==============change time
        updateTime(changeTime);
        return;
      }
      clearInterval(timerId);
      started = false;
      // console.log('timer-stop', `${time}`);
      return;
    }
    function pad(value) {
      return String(value).padStart(2, '0');
    }
    function updateTime(currentTime) {
      //formatting UNIX time to dd.. hh mm ss
      const days = pad(Math.floor(currentTime / (1000 * 60 * 60 * 24)));
      const hours = pad(Math.floor((currentTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const mins = pad(Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60)));
      const secs = pad(Math.floor((currentTime % (1000 * 60)) / 1000));
      getValue(days, hours, mins, secs);
      timeactive(days, hours, mins, secs);

      observer;
    }
    function getValue(days, hours, mins, secs) {
      timerRefs.days.innerHTML = days;
      timerRefs.hours.innerHTML = hours;
      timerRefs.mins.innerHTML = mins;
      timerRefs.secs.innerHTML = secs;
    }

    function timeactive(days, hours, mins, secs) {
      //checker changes values
      if (days !== oldvalues.days) {
        adaptiveList(timerRefs.days);
      }
      if (hours !== oldvalues.hours) {
        adaptiveList(timerRefs.hours);
      }
      if (mins !== oldvalues.mins) {
        adaptiveList(timerRefs.mins);
      }
      if (secs !== oldvalues.secs) {
        adaptiveList(timerRefs.secs);
      }

      oldvalues.days = days;
      oldvalues.hours = hours;
      oldvalues.mins = mins;
      oldvalues.secs = secs;
    }

    function adaptiveList(rel) {
      //add and remove active class (.field_click)
      rel.parentNode.classList.add('field_click');
      const timerTick = setTimeout(timeOutTick, 150);
      function timeOutTick() {
        clearTimeout(timerTick);
        rel.parentNode.classList.remove('field_click');
      }
    }
    start();
  }
}

function timer() {
  let started = false; //is started

  refs.data.addEventListener('change', changeData);

  function changeData() {
    //action to change data in form
    if (Date.now() < refs.data.valueAsNumber) {
      //comparing two dates(now and input)
      refs.start.removeAttribute('disabled');
      refs.start.addEventListener('click', start);
      return;
    }
    refs.start.setAttribute('disabled', true);
    refs.start.removeEventListener('click', start);
  }

  function start() {
    if (!started) {
      started = true;
      isHiddenReplacer(refs.formBox, refs.timerBox);
      refs.start.setAttribute('disabled', true);
      //=========of class
      new CountdownTimer({
        selector: '#timer-1',
        targetDate: new Date(refs.data.valueAsNumber),
      });
      //=========of class
    }
  }

  function isHiddenReplacer(add, remove) {
    remove.classList.remove('is-hide');
    add.classList.add('is-hide');
  }

  function initPage() {
    //start settings on download page
    refs.start.setAttribute('disabled', true);
  }

  initPage(); //set start settings on download page
}

timer(); //start script.
